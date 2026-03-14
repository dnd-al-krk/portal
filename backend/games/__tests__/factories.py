import factory
from django.utils import timezone

from ..models import Adventure, GameSession, GameSessionPlayerSignUp, Table


class AdventureFactory(factory.DjangoModelFactory):
    class Meta:
        model = Adventure

    title = "Super Adventure"


class TableFactory(factory.DjangoModelFactory):
    class Meta:
        model = Table


class GameSessionFactory(factory.DjangoModelFactory):
    class Meta:
        model = GameSession

    date = factory.LazyFunction(timezone.now)
    table = factory.SubFactory(TableFactory)


class GameSessionPlayerSignUpFactory(factory.DjangoModelFactory):
    class Meta:
        model = GameSessionPlayerSignUp
