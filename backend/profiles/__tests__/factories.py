import factory
from django.contrib.auth.models import User
from django.utils import timezone

from ..models import Profile


class UserFactory(factory.DjangoModelFactory):
    username = factory.Sequence(lambda n: "john%s" % n)
    email = factory.LazyAttribute(lambda o: "%s@example.org" % o.username)
    date_joined = factory.LazyFunction(timezone.now)

    class Meta:
        model = User


class ProfileFactory(factory.DjangoModelFactory):
    class Meta:
        model = Profile

    user = factory.SubFactory(UserFactory)
