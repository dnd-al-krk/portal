from django.contrib.auth.models import User
from django.utils import timezone

from games.models import GameSessionQuerySet
from utils.email import send_email


def send_report(queryset: GameSessionQuerySet):
    for_update = queryset.reported()
    timestamp = timezone.now().strftime("%Y-%m-%d")
    receivers = list(User.objects.filter(is_superuser=True).values_list("email", flat=True))

    games = []

    for session in for_update:
        game = {
            "date": session.date.strftime("%Y-%m-%d"),
            "players": [],
            "dm": "",
            "extra_players": session.extra_players if session.extra_players else "",
        }
        print(game)
        games.append(game)

    send_email(f"Report for the games {timestamp}", "emails/games_report.html", {"games": games}, to=receivers)

    return for_update.count()
