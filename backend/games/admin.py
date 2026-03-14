from django.contrib import admin

from games.utils import send_report
from .models import Table, Adventure, GameSession, GameSessionPlayerSignUp


@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ["name", "max_spots"]


@admin.register(Adventure)
class AdventureAdmin(admin.ModelAdmin):
    list_display = ["__str__", "type", "tier", "season", "number"]
    list_filter = ["season", "type"]


@admin.register(GameSession)
class GameSessionAdmin(admin.ModelAdmin):
    list_display = [
        "date",
        "table",
        "adventure",
        "time_start",
        "spots",
        "max_spots",
        "dm",
        "active",
        "reported",
        "report_time",
    ]
    list_filter = ["date", "adventure__season", "adventure__type", "adventure__number", "spots", "table__max_spots"]
    search_fields = ["adventure__title", "table__name", "dm__nickname", "dm__user__first_name", "dm__user__last_name"]
    actions = ["activate_sessions", "deactivate_sessions", "generate_report"]

    def max_spots(self, session):
        return session.table.max_spots

    def activate_sessions(self, request, queryset):
        updated = queryset.update(active=True)
        self.message_user(request, "%s successfully marked as active." % updated)

    activate_sessions.short_description = "Mark game sessions as active"

    def deactivate_sessions(self, request, queryset):
        updated = queryset.update(active=False)
        self.message_user(request, "%s successfully marked as not active." % updated)

    deactivate_sessions.short_description = "Mark game sessions as not active"

    def generate_report(self, request, queryset):
        updated = send_report(queryset)
        self.message_user(request, "%s game sent in the report to managers' emails" % updated)

    generate_report.short_description = "Create and send report for the games"


@admin.register(GameSessionPlayerSignUp)
class GameSessionPlayerSignUpAdmin(admin.ModelAdmin):
    list_display = ["created", "game", "player", "character", "reported"]
    list_filter = [
        "game__date",
        "game__adventure__season",
        "game__adventure__type",
        "game__adventure__number",
        "game__spots",
    ]
