from os import environ
from settings.base import *

read_env = lambda e, d=None: environ[e] if e in environ else d

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

STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]

EMAIL_HOST = "email"
EMAIL_PORT = 1025
EMAIL_HOST_USER = ""
EMAIL_HOST_PASSWORD = ""
EMAIL_USE_TLS = False

ROOT_URL = "http://localhost:8000"

APP_URL = "http://localhost:3000"

ALLOWED_HOSTS = ["localhost"]
