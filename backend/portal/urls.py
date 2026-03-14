"""portal URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin
from django.shortcuts import redirect
from django.urls import path, include, re_path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django_rest_passwordreset import urls as reset_urls
from profiles import views as profile_views


def redirect_to_frontend(request):
    """Redirect root to frontend (dev: localhost:3000, prod: rpgkrakow.pl)"""
    url = "http://localhost:3000" if settings.DEBUG else "https://rpgkrakow.pl"
    return redirect(url)

urlpatterns = [
    path("activate/<slug:uidb64>/<slug:token>/", profile_views.activate, name="activate"),
    path("api/token/auth/", TokenObtainPairView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view()),
    path("api/password_reset/", include("django_rest_passwordreset.urls", namespace="password_reset")),
    path("api/", include(("api.urls", "api"), namespace="api")),
    path("admin/", admin.site.urls),
    path("", redirect_to_frontend, name="index"),
]
