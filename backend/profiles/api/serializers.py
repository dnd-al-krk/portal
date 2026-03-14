import logging

from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from rest_framework import serializers

from ..models import PlayerCharacter, Profile

logger = logging.getLogger(__name__)


class PublicPlayerCharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerCharacter
        fields = ("id", "name", "pc_class", "race", "level", "faction", "notes", "dead")


class PlayerCharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerCharacter
        fields = ("id", "owner", "name", "pc_class", "race", "faction", "level", "notes", "created", "modified", "dead")
        read_only_fields = ("created", "modified", "owner")


class PlayerCharacterListSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()

    def get_owner_name(self, obj):
        return str(obj.owner)

    class Meta:
        model = PlayerCharacter
        fields = ("id", "owner", "owner_name", "name", "pc_class", "race", "faction", "level", "created", "modified")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ("id", "first_name", "last_name")


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True)
    role = serializers.SerializerMethodField()
    characters_count = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ("id", "user", "nickname", "role", "characters_count")

    def update(self, instance, validated_data):
        try:
            user_data = validated_data.pop("user")
        except KeyError:
            pass
        else:
            instance.nickname = validated_data.get("nickname", instance.nickname)
            instance.save()

            user_serializer = UserSerializer(instance=instance.user, data=user_data)
            if user_serializer.is_valid():
                user_serializer.save()

        return instance

    def get_role(self, obj):
        return obj.get_role_display()

    def get_characters_count(self, obj):
        return obj.characters.all().count()


class PublicProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)
    characters_count = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ("id", "user", "nickname", "role", "characters_count", "first_name", "last_name")

    def get_role(self, obj):
        return obj.get_role_display()

    def get_characters_count(self, obj):
        return obj.characters.all().count()


REQUIRED = {"allow_null": False, "allow_blank": False, "required": True}


class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "password")
        extra_kwargs = {"email": REQUIRED, "first_name": REQUIRED, "last_name": REQUIRED}

    def validate_password(self, password):
        if len(password) < 8:
            raise serializers.ValidationError("Password length should be at least 8 characters")
        return password

    def validate(self, data):
        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError("You cannot signup as user with this data.")
        return data


class RegisterProfileSerializer(serializers.ModelSerializer):
    user = RegisterUserSerializer(required=True)

    class Meta:
        model = Profile
        fields = ("nickname", "user")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["user"]["email"],
            email=validated_data["user"]["email"],
            password=validated_data["user"]["password"],
            first_name=validated_data["user"]["first_name"],
            last_name=validated_data["user"]["last_name"],
            is_active=False,
        )

        return Profile.objects.create(user=user, nickname=validated_data["nickname"])

    def validate(self, data):
        if not ((data["user"]["first_name"] and data["user"]["last_name"]) or data["nickname"]):
            raise serializers.ValidationError("You mast provide either First and Last name or Nickname")
        return data
