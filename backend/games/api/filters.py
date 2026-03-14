from django_filters import Filter
from django_filters import rest_framework as filters

from ..models import Adventure, GameSession


class AdventureFilter(filters.FilterSet):
    class Meta:
        model = Adventure
        fields = ("season", "number", "type")


class GameSessionFilter(filters.FilterSet):
    having_player = Filter(field_name="players")

    class Meta:
        model = GameSession
        fields = ("dm__id", "date", "adventure__id", "spots", "adventure__number", "adventure__season", "reported")
