import pytest
from django.utils import timezone
from rest_framework.test import APIClient

from games.models import GameSessionPlayerSignUp
from profiles.models import PlayerCharacter


@pytest.mark.django_db
class TestAdventuresViewSet:
    def test_list_requires_authentication(self, adventure_factory):
        adventure_factory.create_batch(3)
        client = APIClient()
        response = client.get("/api/adventures/")
        assert response.status_code == 401

    def test_list_authenticated(self, adventure_factory, user_factory, profile_factory):
        adventure_factory.create_batch(3)
        user = user_factory()
        profile_factory(user=user)
        client = APIClient()
        client.force_authenticate(user=user)
        response = client.get("/api/adventures/")
        assert response.status_code == 200
        assert len(response.data) == 3

    def test_retrieve_authenticated(self, adventure_factory, user_factory, profile_factory):
        adventure = adventure_factory()
        user = user_factory()
        profile_factory(user=user)
        client = APIClient()
        client.force_authenticate(user=user)
        response = client.get(f"/api/adventures/{adventure.id}/")
        assert response.status_code == 200
        assert response.data["id"] == str(adventure.id)


@pytest.mark.django_db
class TestGameSessionViewSet:
    def test_list_requires_authentication(self, game_session_factory):
        game_session_factory.create_batch(2)
        client = APIClient()
        response = client.get("/api/games/list/")
        assert response.status_code == 401

    def test_list_authenticated(self, game_session_factory, user_factory, profile_factory):
        game_session_factory.create_batch(2, active=True)
        user = user_factory()
        profile_factory(user=user)
        client = APIClient()
        client.force_authenticate(user=user)
        response = client.get("/api/games/list/")
        assert response.status_code == 200
        assert len(response.data) == 2

    def test_retrieve_authenticated(self, game_session_factory, user_factory, profile_factory):
        game = game_session_factory(active=True)
        user = user_factory()
        profile_factory(user=user)
        client = APIClient()
        client.force_authenticate(user=user)
        response = client.get(f"/api/games/list/{game.id}/")
        assert response.status_code == 200
        assert response.data["id"] == str(game.id)


@pytest.mark.django_db
class TestGameSessionSignUp:
    def test_signup_happy_path(self, game_session_factory, user_factory, profile_factory, adventure_factory):
        dm = profile_factory()
        player = profile_factory()
        adventure = adventure_factory()
        game = game_session_factory(dm=dm, adventure=adventure, active=True, spots=5)
        character = PlayerCharacter.objects.create(owner=player, name="Test Character")

        client = APIClient()
        client.force_authenticate(user=player.user)
        response = client.put(f"/api/games/list/{game.id}/signUp/", {"character_id": character.id})

        assert response.status_code == 200
        assert GameSessionPlayerSignUp.objects.filter(game=game, player=player, character=character).exists()

    def test_signup_dead_character_rejected(
        self, game_session_factory, user_factory, profile_factory, adventure_factory
    ):
        dm = profile_factory()
        player = profile_factory()
        adventure = adventure_factory()
        game = game_session_factory(dm=dm, adventure=adventure, active=True, spots=5)
        character = PlayerCharacter.objects.create(owner=player, name="Dead Character", dead=True)

        client = APIClient()
        client.force_authenticate(user=player.user)
        response = client.put(f"/api/games/list/{game.id}/signUp/", {"character_id": character.id})

        assert response.status_code == 400

    def test_signup_full_game_rejected(self, game_session_factory, profile_factory, adventure_factory):
        dm = profile_factory()
        player = profile_factory()
        adventure = adventure_factory()
        game = game_session_factory(dm=dm, adventure=adventure, active=True, spots=1)

        # Fill the game
        other_player = profile_factory()
        other_character = PlayerCharacter.objects.create(owner=other_player, name="Other Character")
        GameSessionPlayerSignUp.objects.create(game=game, player=other_player, character=other_character)

        character = PlayerCharacter.objects.create(owner=player, name="Test Character")
        client = APIClient()
        client.force_authenticate(user=player.user)
        response = client.put(f"/api/games/list/{game.id}/signUp/", {"character_id": character.id})

        assert response.status_code == 400


@pytest.mark.django_db
class TestGameSessionSignOut:
    def test_signout_happy_path(self, game_session_factory, profile_factory, adventure_factory):
        dm = profile_factory()
        player = profile_factory()
        adventure = adventure_factory()
        game = game_session_factory(
            dm=dm, adventure=adventure, active=True, date=timezone.now().date() + timezone.timedelta(days=2)
        )
        character = PlayerCharacter.objects.create(owner=player, name="Test Character")
        signup = GameSessionPlayerSignUp.objects.create(game=game, player=player, character=character)

        client = APIClient()
        client.force_authenticate(user=player.user)
        response = client.put(f"/api/games/list/{game.id}/signOut/")

        assert response.status_code == 200
        assert not GameSessionPlayerSignUp.objects.filter(id=signup.id).exists()

    def test_signout_not_signed_up_rejected(self, game_session_factory, profile_factory, adventure_factory):
        dm = profile_factory()
        player = profile_factory()
        adventure = adventure_factory()
        game = game_session_factory(
            dm=dm, adventure=adventure, active=True, date=timezone.now().date() + timezone.timedelta(days=2)
        )

        client = APIClient()
        client.force_authenticate(user=player.user)
        response = client.put(f"/api/games/list/{game.id}/signOut/")

        assert response.status_code == 400


@pytest.mark.django_db
class TestGameSessionCancel:
    def test_dm_can_cancel(self, game_session_factory, profile_factory, adventure_factory, mocker):
        dm = profile_factory()
        adventure = adventure_factory()
        game = game_session_factory(dm=dm, adventure=adventure, active=True)
        mocker.patch("games.models.send_email")

        client = APIClient()
        client.force_authenticate(user=dm.user)
        response = client.get(f"/api/games/booking/{game.id}/cancel/")

        assert response.status_code == 200
        game.refresh_from_db()
        assert game.dm is None

    def test_non_dm_cannot_cancel(self, game_session_factory, profile_factory, adventure_factory):
        dm = profile_factory()
        other_user = profile_factory()
        adventure = adventure_factory()
        game = game_session_factory(dm=dm, adventure=adventure, active=True)

        client = APIClient()
        client.force_authenticate(user=other_user.user)
        response = client.get(f"/api/games/booking/{game.id}/cancel/")

        assert response.status_code == 400


@pytest.mark.django_db
class TestFutureGameSessionViewSet:
    def test_only_future_games(self, game_session_factory, user_factory, profile_factory):
        game_session_factory(active=True, date=timezone.now().date() - timezone.timedelta(days=2))
        game_session_factory(active=True, date=timezone.now().date() + timezone.timedelta(days=2))

        user = user_factory()
        profile_factory(user=user)
        client = APIClient()
        client.force_authenticate(user=user)
        response = client.get("/api/games/future/")

        assert response.status_code == 200
        assert len(response.data) == 1


@pytest.mark.django_db
class TestPastGameSessionViewSet:
    def test_only_past_games_with_adventure(
        self, game_session_factory, user_factory, profile_factory, adventure_factory
    ):
        adventure = adventure_factory()
        game_session_factory(active=True, date=timezone.now().date() + timezone.timedelta(days=2), adventure=adventure)
        game_session_factory(active=True, date=timezone.now().date() - timezone.timedelta(days=2), adventure=adventure)
        game_session_factory(active=True, date=timezone.now().date() - timezone.timedelta(days=3), adventure=None)

        user = user_factory()
        profile_factory(user=user)
        client = APIClient()
        client.force_authenticate(user=user)
        response = client.get("/api/games/past/")

        assert response.status_code == 200
        assert len(response.data["results"]) == 1

    def test_pagination_structure(self, game_session_factory, user_factory, profile_factory, adventure_factory):
        adventure = adventure_factory()
        game_session_factory.create_batch(
            3, active=True, date=timezone.now().date() - timezone.timedelta(days=2), adventure=adventure
        )

        user = user_factory()
        profile_factory(user=user)
        client = APIClient()
        client.force_authenticate(user=user)
        response = client.get("/api/games/past/")

        assert response.status_code == 200
        assert "count" in response.data
        assert "next" in response.data
        assert "previous" in response.data
        assert "results" in response.data
        assert response.data["count"] == 3
        assert response.data["next"] is None
        assert response.data["previous"] is None
        assert len(response.data["results"]) == 3

    def test_pagination_limit_param(self, game_session_factory, user_factory, profile_factory, adventure_factory):
        adventure = adventure_factory()
        game_session_factory.create_batch(
            5, active=True, date=timezone.now().date() - timezone.timedelta(days=2), adventure=adventure
        )

        user = user_factory()
        profile_factory(user=user)
        client = APIClient()
        client.force_authenticate(user=user)
        response = client.get("/api/games/past/?limit=2")

        assert response.status_code == 200
        assert response.data["count"] == 5
        assert len(response.data["results"]) == 2
        assert response.data["next"] is not None
        assert response.data["previous"] is None

    def test_pagination_offset_param(self, game_session_factory, user_factory, profile_factory, adventure_factory):
        adventure = adventure_factory()
        game_session_factory.create_batch(
            5, active=True, date=timezone.now().date() - timezone.timedelta(days=2), adventure=adventure
        )

        user = user_factory()
        profile_factory(user=user)
        client = APIClient()
        client.force_authenticate(user=user)
        response = client.get("/api/games/past/?offset=2")

        assert response.status_code == 200
        assert response.data["count"] == 5
        assert len(response.data["results"]) == 3
        assert response.data["next"] is None
        assert response.data["previous"] is not None
