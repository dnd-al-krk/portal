import logging
import requests

from django.conf import settings

logger = logging.getLogger(__name__)


def send_discord_game_notification(text):
    webhook_url = settings.DISCORD_WEBHOOK_URL
    data = {
        "content": text,
    }
    response = requests.post(webhook_url, data=data)
    logger.info("Discord request sent: %s", response.text)
    return response
