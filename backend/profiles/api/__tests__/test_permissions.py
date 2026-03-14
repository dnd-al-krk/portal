import pytest
from rest_framework.test import APIRequestFactory

from profiles.models import PlayerCharacter

from ...constants import ROLE_DM, ROLE_PLAYER
from ..permissions import IsOwnerOrReadOnly, IsProfileOwnerOrReadOnly, OnlyDMCanRead


@pytest.mark.django_db
class TestIsOwnerOrReadOnly:
    def test_safe_methods_allowed_for_non_owner(self, profile_factory):
        owner = profile_factory()
        other_user = profile_factory()
        character = PlayerCharacter.objects.create(owner=owner, name="Test Character")

        permission = IsOwnerOrReadOnly()
        factory = APIRequestFactory()
        request = factory.get("/")
        request.user = other_user.user

        assert permission.has_object_permission(request, None, character)

    def test_unsafe_methods_allowed_for_owner(self, profile_factory):
        owner = profile_factory()
        character = PlayerCharacter.objects.create(owner=owner, name="Test Character")

        permission = IsOwnerOrReadOnly()
        factory = APIRequestFactory()
        request = factory.put("/")
        request.user = owner.user

        assert permission.has_object_permission(request, None, character)

    def test_unsafe_methods_denied_for_non_owner(self, profile_factory):
        owner = profile_factory()
        other_user = profile_factory()
        character = PlayerCharacter.objects.create(owner=owner, name="Test Character")

        permission = IsOwnerOrReadOnly()
        factory = APIRequestFactory()
        request = factory.put("/")
        request.user = other_user.user

        assert not permission.has_object_permission(request, None, character)


@pytest.mark.django_db
class TestIsProfileOwnerOrReadOnly:
    def test_safe_methods_allowed_for_non_owner(self, profile_factory):
        profile = profile_factory()
        other_user = profile_factory()

        permission = IsProfileOwnerOrReadOnly()
        factory = APIRequestFactory()
        request = factory.get("/")
        request.user = other_user.user

        assert permission.has_object_permission(request, None, profile)

    def test_unsafe_methods_allowed_for_owner(self, profile_factory):
        profile = profile_factory()

        permission = IsProfileOwnerOrReadOnly()
        factory = APIRequestFactory()
        request = factory.put("/")
        request.user = profile.user

        assert permission.has_object_permission(request, None, profile)

    def test_unsafe_methods_denied_for_non_owner(self, profile_factory):
        profile = profile_factory()
        other_user = profile_factory()

        permission = IsProfileOwnerOrReadOnly()
        factory = APIRequestFactory()
        request = factory.put("/")
        request.user = other_user.user

        assert not permission.has_object_permission(request, None, profile)


@pytest.mark.django_db
class TestOnlyDMCanRead:
    def test_dm_can_read(self, profile_factory):
        dm = profile_factory(role=ROLE_DM)

        permission = OnlyDMCanRead()
        factory = APIRequestFactory()
        request = factory.get("/")
        request.user = dm.user

        assert permission.has_permission(request, None)

    def test_player_cannot_read(self, profile_factory):
        player = profile_factory(role=ROLE_PLAYER)

        permission = OnlyDMCanRead()
        factory = APIRequestFactory()
        request = factory.get("/")
        request.user = player.user

        assert not permission.has_permission(request, None)
