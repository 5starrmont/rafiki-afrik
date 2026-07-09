from rest_framework import serializers
from .models import SiteSettings, DynamicSpotlight, Category, Article, VideoStory, TeamMember, WaitlistEntry, Film, Service, NewsletterSubscriber

# --- MODULE 2 ---
class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = '__all__'

class DynamicSpotlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = DynamicSpotlight
        fields = '__all__'

# --- MODULE 3 ---
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ArticleSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Article
        fields = '__all__'

class VideoStorySerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = VideoStory
        fields = '__all__'

# --- MODULE 4 ---
class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'

# --- MODULE 5 ---
class WaitlistEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = WaitlistEntry
        fields = '__all__'

# --- MODULE 6 ---
class FilmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Film
        fields = '__all__'

# --- MODULE 7 ---
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

# --- MODULE 8 (NEW) ---
class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = '__all__'