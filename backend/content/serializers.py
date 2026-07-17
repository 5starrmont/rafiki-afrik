from rest_framework import serializers
from .models import Category, Article, VideoStory, Film, NewsletterSubscriber

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'category', 'author', 
            'featured_image', 'body', 'reading_time', 
            'is_featured', 'is_published', 'published_date'
        ]
        
    def to_representation(self, instance):
        # This tells Django: Accept the ID for saving, but return the full object for reading
        representation = super().to_representation(instance)
        representation['category'] = CategorySerializer(instance.category).data if instance.category else None
        return representation

class VideoStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoStory
        fields = [
            'id', 'title', 'category', 'youtube_url', 
            'thumbnail', 'description', 'is_featured', 'is_published', 'published_date'
        ]
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['category'] = CategorySerializer(instance.category).data if instance.category else None
        return representation

class FilmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Film
        fields = [
            'id', 'title', 'slug', 'director', 'release_year', 
            'poster_image', 'description', 'video_url', 'is_featured', 'published_date'
        ]

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['id', 'email', 'subscribed_at', 'is_active']