from django_filters import rest_framework as filters
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from profiles.models import PlayerCharacter
from .filters import AdventureFilter, GameSessionFilter
from .serializers import AdventureSerializer, GameSessionSerializer, GameSessionBookSerializer
from ..models import Adventure, GameSession, GameSessionPlayerSignUp


class AdventuresViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = AdventureSerializer
    queryset = Adventure.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = (filters.DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_class = AdventureFilter
    search_fields = ("title",)
    ordering_fields = ("season", "number", "title")
    ordering = ("season", "number", "title")


class GameSessionViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet
):
    serializer_class = GameSessionSerializer
    queryset = GameSession.games.all()
    permission_classes = [IsAuthenticated]
    filter_backends = (filters.DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_class = GameSessionFilter
    search_fields = ("table__name", "dm__user__first_name", "dm__user__last_name", "dm__nickname", "adventure__title")
    ordering_fields = ("date", "time_end", "time_start")
    ordering = "date"

    @action(methods=["PUT"], detail=True)
    def signUp(self, request, *args, **kwargs):

        instance = self.get_object()
        profile = request.user.profile
        try:
            character_id = request.data["character_id"]
            character = profile.characters.get(id=character_id)
        except (PlayerCharacter.DoesNotExist, KeyError):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if not instance.can_sign_up(profile):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if character.dead:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        signup, _ = GameSessionPlayerSignUp.objects.get_or_create(game=instance, player=profile)
        signup.character = character
        signup.save(update_fields=["character"])

        return Response()

    @action(methods=["PUT"], detail=True)
    def signOut(self, request, *args, **kwargs):
        instance: GameSession = self.get_object()
        profile = request.user.profile

        if not instance.can_sign_out(profile):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            signup = GameSessionPlayerSignUp.objects.get(game=instance, player=profile)
            signup.delete()

            instance.check_minimum_players()
            instance.check_last_spot_notify()
            return Response()
        except GameSessionPlayerSignUp.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["PUT"], detail=True)
    def report(self, request, *args, **kwargs):
        data = request.data
        instance = self.get_object()
        dm = request.user.profile
        if dm != instance.dm:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        players = data.get("players")
        extra_players = data.get("extra_players", None)
        GameSessionPlayerSignUp.objects.filter(game=instance).update(reported=False)
        GameSessionPlayerSignUp.objects.filter(player_id__in=players, game=instance).update(reported=True)
        instance.report(extra_players)

        return Response(status=status.HTTP_200_OK)


class FutureGameSessionViewSet(GameSessionViewSet):
    def get_queryset(self):
        return GameSession.games.future()


class PastGameSessionViewSet(GameSessionViewSet):
    def get_queryset(self):
        return GameSession.games.past().exclude(adventure=None)


class GameSessionBookViewSet(mixins.UpdateModelMixin, viewsets.GenericViewSet):
    serializer_class = GameSessionBookSerializer
    queryset = GameSession.games.all()
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        was_booked = instance.is_booked

        needed_dm = instance.adventure and not instance.dm
        if instance.adventure and instance.dm and instance.dm != request.user.profile:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        update_result = super(GameSessionBookViewSet, self).update(request, *args, **kwargs)

        instance.refresh_from_db()  # get updated state of the instance
        if not was_booked and instance.is_booked and instance.is_online:
            GameSession.objects.recreate_online_game(instance)

        if needed_dm and update_result.status_code == 200:
            instance.booked_again()
        return update_result

    def perform_update(self, serializer):
        serializer.save(dm=self.request.user.profile)

    @action(methods=["GET"], detail=True)
    def cancel(self, request, *args, **kwargs):
        """
        Cancels game run by the owner DM.

        # TODO: Add tests to cover this case.
        """
        instance = self.get_object()
        if instance.dm != request.user.profile:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        instance.cancel()

        return Response(status=status.HTTP_200_OK)
