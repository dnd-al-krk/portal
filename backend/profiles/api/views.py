import logging

import requests
from django.conf import settings
from django_filters import rest_framework as filters
from rest_framework import viewsets, mixins, status
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .filters import PlayerCharacterFilter
from .permissions import IsOwnerOrReadOnly, IsProfileOwnerOrReadOnly
from .serializers import (
    PlayerCharacterSerializer,
    ProfileSerializer,
    PlayerCharacterListSerializer,
    RegisterProfileSerializer,
    PublicProfileSerializer,
)
from ..models import PlayerCharacter, Profile


logger = logging.getLogger(__file__)


class PlayerCharacterViewSet(viewsets.ModelViewSet):
    serializer_class = PlayerCharacterSerializer
    queryset = PlayerCharacter.objects.all()
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = (filters.DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_class = PlayerCharacterFilter
    search_fields = ("name", "owner__nickname", "owner__user__first_name", "owner__user__last_name")
    ordering_fields = ("name", "level", "created", "modified")
    ordering = "-created"

    def get_serializer_class(self):
        if self.action == "list":
            return PlayerCharacterListSerializer
        return PlayerCharacterSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)

    def perform_update(self, serializer):
        serializer.save(owner=self.request.user.profile)


class ProfileViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = PublicProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsAuthenticated, IsProfileOwnerOrReadOnly]


class CurrentUserView(APIView):
    def get(self, request):
        serializer = ProfileSerializer(request.user.profile)
        return Response(serializer.data)

    def put(self, request):
        serializer = ProfileSerializer(request.user.profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)


class RegistrationView(APIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterProfileSerializer
    model = Profile.objects.all()

    def _verify_turnstile(self, request):
        token = request.data.pop("turnstile_token")
        if not token:
            return False

        url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
        data = {
            "secret": settings.TURNSTILE_SECRET_KEY,
            "response": token,
            "remoteip": request.META.get("REMOTE_ADDR")
        }

        response = requests.post(url, data=data)
        result = response.json()

        logger.warning("Turnstile token check: %s", result)

        return result.get("success", False)

    def post(self, request, *args, **kwargs):
        if not self._verify_turnstile(request):
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RegisterProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
