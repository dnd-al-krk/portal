from pytest_factoryboy import register

from games.__tests__.factories import AdventureFactory, GameSessionFactory, GameSessionPlayerSignUpFactory, TableFactory
from profiles.__tests__.factories import ProfileFactory, UserFactory

register(UserFactory)
register(ProfileFactory)
register(AdventureFactory)
register(TableFactory)
register(GameSessionFactory)
register(GameSessionPlayerSignUpFactory)
