import pytest

from ..constants import ROLE_DM, ROLE_PLAYER


@pytest.mark.django_db
def test_profile_str(profile_factory, user_factory):
    user = user_factory(first_name="John", last_name="Doe")
    profile = profile_factory(user=user, nickname="JohnnyD")

    assert str(profile) == "John Doe / JohnnyD"


@pytest.mark.django_db
def test_profile_is_dm_returns_true_for_dm(profile_factory):
    profile = profile_factory(role=ROLE_DM)

    assert profile.is_dm()


@pytest.mark.django_db
def test_profile_is_dm_returns_false_for_player(profile_factory):
    profile = profile_factory(role=ROLE_PLAYER)

    assert not profile.is_dm()


@pytest.mark.django_db
def test_player_character_str(profile_factory):
    from profiles.models import PlayerCharacter

    profile = profile_factory()
    character = PlayerCharacter.objects.create(owner=profile, name="Gandalf the Grey")

    assert str(character) == "Gandalf the Grey"
