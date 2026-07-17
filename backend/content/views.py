from rest_framework import viewsets, mixins
from .models import Category, Article, VideoStory, Film, NewsletterSubscriber
from .serializers import (
    CategorySerializer, ArticleSerializer, 
    VideoStorySerializer, FilmSerializer, 
    NewsletterSubscriberSerializer
)

# Changed to ModelViewSet to allow React Admin to Create/Edit/Delete
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# Changed to ModelViewSet to allow React Admin to Create/Edit/Delete
class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all().order_by('-published_date')
    serializer_class = ArticleSerializer

# Changed to ModelViewSet to allow React Admin to Create/Edit/Delete
class VideoStoryViewSet(viewsets.ModelViewSet):
    queryset = VideoStory.objects.all().order_by('-published_date')
    serializer_class = VideoStorySerializer

class FilmViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Film.objects.all().order_by('-published_date')
    serializer_class = FilmSerializer

class NewsletterSubscriberViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer