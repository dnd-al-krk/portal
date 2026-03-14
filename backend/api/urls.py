from django.urls import re_path as url
from django.urls import include
from django.urls import path
from rest_framework.routers import DefaultRouter
from profiles.api import views as profiles_views
from games.api import views as games_views

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register("characters", profiles_views.PlayerCharacterViewSet)
router.register("profiles", profiles_views.ProfileViewSet)
router.register("adventures", games_views.AdventuresViewSet)
router.register("games/list", games_views.GameSessionViewSet, basename="game_session")
router.register("games/future", games_views.FutureGameSessionViewSet, basename="future_game_session")
router.register("games/past", games_views.PastGameSessionViewSet, basename="past_game_session")
router.register("games/booking", games_views.GameSessionBookViewSet)
# router.register(r'register', profiles_views.RegistrationView)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    url(r"^", include(router.urls)),
    url(r"register/?$", profiles_views.RegistrationView.as_view()),
    url(r"^current_user/?$", profiles_views.CurrentUserView.as_view()),
]
