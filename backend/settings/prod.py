from os import environ
from settings.base import *

read_env = lambda e, d=None: environ[e] if e in environ else d

SECRET_KEY = read_env("PORTAL_SECRET")

DEBUG = False
TEMPLATE_DEBUG = False

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",  # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        "NAME": read_env("PORTAL_PROD_DB_NAME"),  # Or path to database file if using sqlite3.
        "USER": read_env("PORTAL_PROD_DB_USER"),  # Not used with sqlite3.
        "PASSWORD": read_env("PORTAL_PROD_DB_PASS"),  # Not used with sqlite3.
        "HOST": read_env("PORTAL_PROD_DB_HOST"),  # Set to empty string for localhost. Not used with sqlite3.
        "PORT": "",  # Set to empty string for default. Not used with sqlite3.
    }
}

ALLOWED_HOSTS += ["latest.dndkrakow.pl", "alkrakow.toady.org", "api.alkrakow.toady.org", "dndkrakow.pl", "api.dndkrakow.pl", "api.rpgkrakow.pl", "rpgkrakow.pl"]

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
