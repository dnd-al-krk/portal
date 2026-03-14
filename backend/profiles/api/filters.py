from django_filters import rest_framework as filters

from ..models import PlayerCharacter


class PlayerCharacterFilter(filters.FilterSet):
    class Meta:
        model = PlayerCharacter
        fields = ("owner", "dead")
