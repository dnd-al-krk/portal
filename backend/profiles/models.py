from django.contrib.auth.models import User
from django.db import models
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.utils.translation import gettext_lazy as _

from utils.email import send_email
from utils.models import UUIDModel
from .constants import ROLE_DM, ROLE_PLAYER
from .utils import account_activation_token


class Profile(models.Model):

    USER_TYPE = ((ROLE_DM, "Dungeon Master"), (ROLE_PLAYER, "Player"))

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    nickname = models.CharField(_("Discord Nickname"), max_length=255, blank=True, null=True)
    dci = models.CharField(_("DCI"), max_length=15, blank=True, null=True)
    role = models.CharField(_("Role"), max_length=20, default=ROLE_PLAYER, choices=USER_TYPE)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} / {self.nickname}"

    def is_dm(self):
        return self.role == ROLE_DM

    def save(self, *args, **kwargs):
        created = False if self.pk else True
        super().save(*args, **kwargs)
        if created:
            self.send_verification_email()

    def send_verification_email(self):
        send_email(
            "Activate your portAL account",
            "emails/account_activate_email.html",
            {
                "user": self.user,
                "profile": self,
                "uid": urlsafe_base64_encode(force_bytes(self.user.pk)),
                "token": account_activation_token.make_token(self.user),
            },
            to=[self.user.email],
        )


class PlayerCharacter(UUIDModel):
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="characters")
    name = models.CharField(_("Character name"), max_length=255)
    pc_class = models.CharField(_("Character class"), max_length=60, db_index=True, null=True, blank=True)
    race = models.CharField(_("Character race"), max_length=40, db_index=True, null=True, blank=True)
    faction = models.CharField(_("Character faction"), max_length=50, db_index=True, null=True, blank=True)
    level = models.PositiveIntegerField(_("Level"), default=1)
    notes = models.TextField(_("Additional notes"), blank=True, null=True)
    created = models.DateTimeField(_("Created"), auto_now_add=True)
    modified = models.DateTimeField(_("Modified"), auto_now=True)
    dead = models.BooleanField(default=False, null=False)

    def __str__(self):
        return self.name
