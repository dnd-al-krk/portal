from settings.base import *

DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": os.path.join(BASE_DIR, "db.sqlite3")}}

STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]

CORS_ORIGIN_ALLOW_ALL = True

EMAIL_HOST = "localhost"
EMAIL_PORT = 1025
EMAIL_HOST_USER = ""
EMAIL_HOST_PASSWORD = ""
EMAIL_USE_TLS = False

ROOT_URL = "http://localhost:8000"

APP_URL = "http://localhost:3000"

ALLOWED_HOSTS = ["localhost", "dev.rpgkrakow.pl",]
