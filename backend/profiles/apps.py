from django.apps import AppConfig


class ProfilesConfig(AppConfig):
    name = "profiles"
    verbose_name = "Profiles of Players"

    def ready(self):
        from . import signals
