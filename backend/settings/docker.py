from os import environ

from settings.base import *

read_env = lambda e, d=None: environ[e] if e in environ else d

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

STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]

EMAIL_HOST = "email"
EMAIL_PORT = 1025
EMAIL_HOST_USER = ""
EMAIL_HOST_PASSWORD = ""
EMAIL_USE_TLS = False

ROOT_URL = "http://localhost:8000"

APP_URL = "http://localhost:3000"

ALLOWED_HOSTS = ["localhost"]
