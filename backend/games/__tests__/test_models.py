import pytest
from django.utils import timezone

import games

from ..constants import ADVENTURE_TYPE_AL, ADVENTURE_TYPE_CCC, ADVENTURE_TYPE_OTHER


@pytest.mark.django_db
def test_factory_fixture(adventure_factory):
    adventure = adventure_factory(type=ADVENTURE_TYPE_OTHER)

    assert adventure.type == ADVENTURE_TYPE_OTHER


@pytest.mark.django_db
def test_other_adventure_display_only_name(adventure_factory):
    adventure = adventure_factory(type=ADVENTURE_TYPE_OTHER)

    assert str(adventure) == "Super Adventure"


@pytest.mark.django_db
def test_future_game_session_not_ended(game_session_factory):
    # given
    game = game_session_factory(date=timezone.now().date() + timezone.timedelta(days=2))

    # then
    assert not game.ended


@pytest.mark.django_db
def test_past_game_session_ended(game_session_factory):
    # given
    game = game_session_factory(date=timezone.now().date() - timezone.timedelta(days=2))

    # then
    assert game.ended


@pytest.mark.django_db
def test_today_after_time_end_game_session_is_ended(game_session_factory):
    # given
    game = game_session_factory(
        date=timezone.now().date(), time_end=(timezone.now() - timezone.timedelta(hours=2)).time()
    )

    # then
    assert game.ended


@pytest.mark.django_db
def test_minimum_players_not_available_email_sent(
    game_session_factory, profile_factory, game_session_player_sign_up_factory, adventure_factory, mocker
):
    # given
    game = game_session_factory(dm=profile_factory(), adventure=adventure_factory())
    game_session_player_sign_up_factory.create_batch(2, game=game, player=profile_factory())
    mocker.patch("games.models.send_email")
    mocker.patch("games.models.send_discord_game_notification")

    # when
    game.check_minimum_players()

    # then
    assert games.models.send_email.call_count == 1


@pytest.mark.django_db
def test_minimum_players_number_is_there_no_email(
    game_session_factory, profile_factory, game_session_player_sign_up_factory, mocker
):
    # given
    game = game_session_factory(dm=profile_factory())
    game_session_player_sign_up_factory.create_batch(3, game=game, player=profile_factory())
    mocker.patch("games.models.send_email")

    # when
    game.check_minimum_players()

    # then
    assert not games.models.send_email.called


@pytest.mark.django_db
def test_reporting_game_session(game_session_factory):
    # given
    game = game_session_factory()
    extra_players = "123,456,789"

    # when
    game.report(extra_players)

    # then
    game.refresh_from_db()
    assert game.extra_players == extra_players
    assert game.reported
    assert game.report_time is not None


@pytest.mark.django_db
def test_can_sign_up_dm_cannot_sign_up_to_own_game(game_session_factory, profile_factory, adventure_factory):
    dm = profile_factory()
    game = game_session_factory(
        dm=dm, adventure=adventure_factory(), date=timezone.now().date() + timezone.timedelta(days=2)
    )

    assert not game.can_sign_up(dm)


@pytest.mark.django_db
def test_can_sign_up_player_can_sign_up(game_session_factory, profile_factory, adventure_factory):
    dm = profile_factory()
    player = profile_factory()
    game = game_session_factory(
        dm=dm, adventure=adventure_factory(), spots=5, date=timezone.now().date() + timezone.timedelta(days=2)
    )

    assert game.can_sign_up(player)


@pytest.mark.django_db
def test_can_sign_up_game_full(
    game_session_factory, profile_factory, adventure_factory, game_session_player_sign_up_factory
):
    dm = profile_factory()
    player = profile_factory()
    game = game_session_factory(
        dm=dm, adventure=adventure_factory(), spots=1, date=timezone.now().date() + timezone.timedelta(days=2)
    )
    game_session_player_sign_up_factory(game=game, player=profile_factory())

    assert not game.can_sign_up(player)


@pytest.mark.django_db
def test_can_sign_up_game_ended(game_session_factory, profile_factory, adventure_factory):
    dm = profile_factory()
    player = profile_factory()
    game = game_session_factory(
        dm=dm, adventure=adventure_factory(), date=timezone.now().date() - timezone.timedelta(days=2)
    )

    assert not game.can_sign_up(player)


@pytest.mark.django_db
def test_can_sign_up_no_dm_assigned(game_session_factory, profile_factory, adventure_factory):
    player = profile_factory()
    game = game_session_factory(
        dm=None, adventure=adventure_factory(), date=timezone.now().date() + timezone.timedelta(days=2)
    )

    assert not game.can_sign_up(player)


@pytest.mark.django_db
def test_can_sign_out_player_signed_up(
    game_session_factory, profile_factory, adventure_factory, game_session_player_sign_up_factory
):
    player = profile_factory()
    game = game_session_factory(date=timezone.now().date() + timezone.timedelta(days=2))
    game_session_player_sign_up_factory(game=game, player=player)

    assert game.can_sign_out(player)


@pytest.mark.django_db
def test_can_sign_out_player_not_signed_up(game_session_factory, profile_factory):
    player = profile_factory()
    game = game_session_factory(date=timezone.now().date() + timezone.timedelta(days=2))

    assert not game.can_sign_out(player)


@pytest.mark.django_db
def test_can_sign_out_game_ended(game_session_factory, profile_factory, game_session_player_sign_up_factory):
    player = profile_factory()
    game = game_session_factory(date=timezone.now().date() - timezone.timedelta(days=2))
    game_session_player_sign_up_factory(game=game, player=player)

    assert not game.can_sign_out(player)


@pytest.mark.django_db
def test_cancel_sends_email(
    game_session_factory, profile_factory, adventure_factory, game_session_player_sign_up_factory, mocker
):
    dm = profile_factory()
    game = game_session_factory(dm=dm, adventure=adventure_factory())
    game_session_player_sign_up_factory.create_batch(2, game=game, player=profile_factory())
    mocker.patch("games.models.send_email")

    game.cancel()

    game.refresh_from_db()
    assert game.dm is None
    assert games.models.send_email.call_count == 1


@pytest.mark.django_db
def test_adventure_str_al_type(adventure_factory):
    adventure = adventure_factory(type=ADVENTURE_TYPE_AL, season=8, number=5, title="Test Adventure")

    assert "DDAL8-5" in str(adventure)
    assert "Test Adventure" in str(adventure)


@pytest.mark.django_db
def test_adventure_str_ccc_type(adventure_factory):
    adventure = adventure_factory(type=ADVENTURE_TYPE_CCC, title="TEST-01")

    assert str(adventure) == "CCC-TEST-01"


@pytest.mark.django_db
def test_adventure_str_other_type(adventure_factory):
    adventure = adventure_factory(type=ADVENTURE_TYPE_OTHER, title="Custom Adventure")

    assert str(adventure) == "Custom Adventure"
