import factory
from django.contrib.auth.models import User
from django.utils import timezone
from factory.django import DjangoModelFactory

from ..models import Profile


class UserFactory(DjangoModelFactory):
    username = factory.Sequence(lambda n: "john%s" % n)
    email = factory.LazyAttribute(lambda o: "%s@example.org" % o.username)
    date_joined = factory.LazyFunction(timezone.now)

    class Meta:
        model = User


class ProfileFactory(DjangoModelFactory):
    class Meta:
        model = Profile

    user = factory.SubFactory(UserFactory)
