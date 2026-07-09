from django.contrib import admin
from .models import SiteSettings, DynamicSpotlight, Category, Article, VideoStory, TeamMember, WaitlistEntry, Film, Service, NewsletterSubscriber

# --- MODULE 2 ---
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

# --- MODULE 3 ---
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'publish_date', 'is_featured')
    list_filter = ('category', 'is_featured')
    search_fields = ('title', 'author')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(VideoStory)
class VideoStoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'publish_date', 'is_featured')
    list_filter = ('category', 'is_featured')
    search_fields = ('title',)
    prepopulated_fields = {'slug': ('title',)}

# --- MODULE 4 ---
@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'order', 'is_active')
    list_filter = ('is_active', 'role')
    search_fields = ('name', 'role')
    list_editable = ('order', 'is_active') 

# --- MODULE 5 ---
@admin.register(WaitlistEntry)
class WaitlistEntryAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'country', 'organization', 'submitted_at')
    list_filter = ('country', 'submitted_at')
    search_fields = ('full_name', 'email', 'organization')
    readonly_fields = ('submitted_at',) 

# --- MODULE 6 ---
@admin.register(Film)
class FilmAdmin(admin.ModelAdmin):
    list_display = ('title', 'release_date', 'created_at')
    list_filter = ('release_date',)
    search_fields = ('title',)
    prepopulated_fields = {'slug': ('title',)}

# --- MODULE 7 ---
@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('title',)
    list_editable = ('order', 'is_active')
    prepopulated_fields = {'slug': ('title',)}

# --- MODULE 8 (NEW) ---
@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'subscribed_at', 'is_active')
    list_filter = ('is_active', 'subscribed_at')
    search_fields = ('email',)