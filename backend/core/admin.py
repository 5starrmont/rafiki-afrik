from django.contrib import admin
from .models import SiteSettings, DynamicSpotlight, TeamMember, WaitlistEntry, Service

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return True

@admin.register(DynamicSpotlight)
class DynamicSpotlightAdmin(admin.ModelAdmin):
    list_display = ('title', 'tag', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('title',)

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'order', 'is_active')
    list_filter = ('is_active', 'role')
    search_fields = ('name', 'role')
    list_editable = ('order', 'is_active') 

@admin.register(WaitlistEntry)
class WaitlistEntryAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'country', 'organization', 'submitted_at')
    list_filter = ('country', 'submitted_at')
    search_fields = ('full_name', 'email', 'organization')
    readonly_fields = ('submitted_at',) 

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('title',)
    list_editable = ('order', 'is_active')
    prepopulated_fields = {'slug': ('title',)}