from django.contrib import admin
from .models import NewsletterSubscriber, WaitlistMember

@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_active', 'subscribed_at')
    list_filter = ('is_active', 'subscribed_at')
    search_fields = ('email',)
    list_editable = ('is_active',)

@admin.register(WaitlistMember)
class WaitlistMemberAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'country', 'is_approved', 'date_joined')
    list_filter = ('is_approved', 'date_joined', 'country')
    search_fields = ('full_name', 'email', 'organization')
    list_editable = ('is_approved',)
    readonly_fields = ('date_joined',)