from rest_framework import viewsets, mixins
from .models import Category, Article, VideoStory, Film, NewsletterSubscriber, PodcastEpisode
from .serializers import (
    CategorySerializer, ArticleSerializer, 
    VideoStorySerializer, FilmSerializer, 
    NewsletterSubscriberSerializer, PodcastEpisodeSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all().order_by('-published_date')
    serializer_class = ArticleSerializer
    lookup_field = 'slug'

class VideoStoryViewSet(viewsets.ModelViewSet):
    queryset = VideoStory.objects.all().order_by('-published_date')
    serializer_class = VideoStorySerializer

class FilmViewSet(viewsets.ModelViewSet):
    queryset = Film.objects.all().order_by('-published_date')
    serializer_class = FilmSerializer
    lookup_field = 'slug'

class NewsletterSubscriberViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer

class PodcastEpisodeViewSet(viewsets.ModelViewSet):
    queryset = PodcastEpisode.objects.all().order_by('-published_date')
    serializer_class = PodcastEpisodeSerializer
    lookup_field = 'slug'