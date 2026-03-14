from os import environ

from settings.base import *

read_env = lambda e, d=None: environ[e] if e in environ else d

SECRET_KEY = read_env("PORTAL_SECRET")

DEBUG = False
TEMPLATE_DEBUG = False

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": read_env("PORTAL_PROD_DB_NAME"),
        "USER": read_env("PORTAL_PROD_DB_USER"),
        "PASSWORD": read_env("PORTAL_PROD_DB_PASS"),
        "HOST": read_env("PORTAL_PROD_DB_HOST"),
        "PORT": "",
    }
}

ALLOWED_HOSTS += [
    "latest.dndkrakow.pl",
    "alkrakow.toady.org",
    "api.alkrakow.toady.org",
    "dndkrakow.pl",
    "api.dndkrakow.pl",
    "api.rpgkrakow.pl",
    "rpgkrakow.pl",
]

# EMAIL SETTINGS
EMAIL_HOST = read_env("PORTAL_PROD_EMAIL_HOST")
EMAIL_PORT = read_env("PORTAL_PROD_EMAIL_PORT")
EMAIL_FROM = EMAIL_HOST_USER = read_env("PORTAL_PROD_EMAIL_USERNAME")
EMAIL_HOST_PASSWORD = read_env("PORTAL_PROD_EMAIL_PASSWORD")
EMAIL_USE_SSL = True

ROOT_URL = "http://api.rpgkrakow.pl"

STATIC_ROOT = BASE_DIR + "/public/static/"
STATIC_URL = "/static/"

SECURE_SSL_REDIRECT = False

ADMINS = (("DnD Kraków", "alkrk_tech@toady.org"),)

CORS_ALLOWED_ORIGINS = ["https://dndkrakow.pl", "https://rpgkrakow.pl", "https://latest.dndkrakow.pl"]

APP_URL = "https://rpgkrakow.pl"

TIME_ZONE = "Europe/Warsaw"

DISCORD_WEBHOOK_URL = read_env("PORTAL_DISCORD_WEBHOOK_URL")
DISCORD_ROLE_TIER1 = read_env("PORTAL_DISCORD_ROLE_TIER1")
DISCORD_ROLE_TIER2 = read_env("PORTAL_DISCORD_ROLE_TIER2")
DISCORD_ROLE_TIER3 = read_env("PORTAL_DISCORD_ROLE_TIER3")
DISCORD_ROLE_TIER4 = read_env("PORTAL_DISCORD_ROLE_TIER4")

TURNSTILE_SECRET_KEY = read_env("PORTAL_TURNSTILE_SECRET_KEY")
