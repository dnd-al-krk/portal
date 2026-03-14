from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created, post_password_reset

from utils.email import send_email
from .models import Profile


@receiver(reset_password_token_created)
def password_reset_token_created(sender, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender:
    :param reset_password_token:
    :param args:
    :param kwargs:
    :return:
    """
    # send an e-mail to the user

    context = {
        "current_user": reset_password_token.user,
        "username": reset_password_token.user.username,
        "email": reset_password_token.user.email,
        "reset_password_url": "/password-reset/{}/".format(reset_password_token.key),
    }

    send_email(
        "Your portAL account password reset",
        "emails/user_reset_password.html",
        context,
        to=[reset_password_token.user.email],
    )


@receiver(post_password_reset)
def post_password_reset(sender, user, *args, **kwargs):
    """
    Sends confirmation of password changing.

    :param sender:
    :param user:
    :param args:
    :param kwargs:
    :return:
    """

    context = {}

    send_email(
        "Your portAL account password has been changed",
        "emails/user_reset_password_confirm.html",
        context,
        to=[user.email],
    )
