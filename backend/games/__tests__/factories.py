import factory
from django.utils import timezone
from factory.django import DjangoModelFactory

from ..models import Adventure, GameSession, GameSessionPlayerSignUp, Table


class AdventureFactory(DjangoModelFactory):
    class Meta:
        model = Adventure

    title = "Super Adventure"


class TableFactory(DjangoModelFactory):
    class Meta:
        model = Table


class GameSessionFactory(DjangoModelFactory):
    class Meta:
        model = GameSession

    date = factory.LazyFunction(timezone.now)
    table = factory.SubFactory(TableFactory)


class GameSessionPlayerSignUpFactory(DjangoModelFactory):
    class Meta:
        model = GameSessionPlayerSignUp
