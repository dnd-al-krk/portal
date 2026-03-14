import logging
from django.core.management.base import BaseCommand
from django.utils import timezone

from ...constants import FUTURE_TABLES_ADDED_AMOUNT, AFTER_HOW_MANY_DAYS_ADD_TABLES
from ...models import Table, GameSession

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Creates game sessions for the future."

    def handle(self, *args, **options):
        self.creation_time_start = timezone.now()
        self.days_to_add = FUTURE_TABLES_ADDED_AMOUNT
        self.create_tables("Online")
        self.create_tables("Other (see additional info)")
        self.create_tables("Carcossa", dow=5)
        self.create_tables("Innsmouth", dow=2)
        self.create_tables("Uniwersytet Miskatonik", dow=4)

    def create_tables(self, name, dow=None):
        try:
            table = Table.objects.get(name=name)
        except Table.DoesNotExist:
            logger.warning(
                "There is no online table set!"
            )
            return

        for day in range(1, self.days_to_add+1):
            session_time = self.creation_time_start + timezone.timedelta(days=day)
            if dow and session_time.date().weekday() != dow:
                continue

            try:
                gs, created = GameSession.objects.get_or_create(
                    date=session_time.date(),
                    table=table,
                    active=True,
                )
                if created:
                    gs.spots = table.max_spots
                    gs.save(update_fields=["spots"])
            except GameSession.MultipleObjectsReturned:
                logger.error("Could not create a Game Session for date: %s table id: %s", str(session_time.date()), str(table.id))
