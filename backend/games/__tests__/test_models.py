from unittest.mock import patch

import pytest
from django.utils import timezone

import games
from profiles.__tests__.factories import ProfileFactory
from ..constants import ADVENTURE_TYPE_OTHER
from .factories import AdventureFactory, GameSessionFactory, GameSessionPlayerSignUpFactory

from pytest_factoryboy import register

register(AdventureFactory)
register(GameSessionFactory)
register(GameSessionPlayerSignUpFactory)
register(ProfileFactory)


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
    game_session_factory, profile_factory, game_session_player_sign_up_factory, mocker
):
    # given
    game = game_session_factory(dm=profile_factory())
    game_session_player_sign_up_factory.create_batch(2, game=game, player=profile_factory())
    mocker.patch("games.models.send_email")

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
