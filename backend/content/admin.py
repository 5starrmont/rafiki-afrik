from django.contrib import admin
from .models import Category, Article, VideoStory, Film, NewsletterSubscriber

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'published_date', 'is_featured')
    list_filter = ('category', 'is_featured', 'published_date')
    search_fields = ('title', 'author', 'body')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('is_featured',)

@admin.register(VideoStory)
class VideoStoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'published_date', 'is_featured')
    list_filter = ('category', 'is_featured', 'published_date')
    search_fields = ('title', 'description')
    list_editable = ('is_featured',)

@admin.register(Film)
class FilmAdmin(admin.ModelAdmin):
    list_display = ('title', 'director', 'release_year', 'is_featured', 'published_date')
    list_filter = ('is_featured', 'release_year')
    search_fields = ('title', 'director', 'description')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('is_featured',)

@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'subscribed_at', 'is_active')
    list_filter = ('is_active', 'subscribed_at')
    search_fields = ('email',)
    list_editable = ('is_active',)