from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

# Define an inline admin descriptor for Employee model
# which acts a bit like a singleton
from .constants import ROLE_DM, ROLE_PLAYER
from .models import Profile, PlayerCharacter


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = _("Profiles")
    max_num = 1
    min_num = 1


class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)


admin.site.unregister(User)
admin.site.register(User, UserAdmin)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ["__str__", "role"]
    actions = ["make_dm", "make_player"]

    def make_dm(self, request, queryset):
        updated = queryset.update(role=ROLE_DM)
        self.message_user(request, _("{} successfully changed roles to DM.").format(updated))

    make_dm.short_description = _("Change role to DM")

    def make_player(self, request, queryset):
        updated = queryset.update(role=ROLE_PLAYER)
        self.message_user(request, _("{} successfully changed roles to Player.").format(updated))

    make_player.short_description = _("Change role to Player")


@admin.register(PlayerCharacter)
class PlayerCharacterAdmin(admin.ModelAdmin):
    list_display = ["name", "level", "race", "pc_class", "faction"]
    search_fields = ["name"]
    list_filter = ["level", "race", "pc_class", "faction"]
