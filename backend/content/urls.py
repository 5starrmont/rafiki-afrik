from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, ArticleViewSet, 
    VideoStoryViewSet, FilmViewSet,
    NewsletterSubscriberViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'articles', ArticleViewSet)
router.register(r'videos', VideoStoryViewSet)
router.register(r'films', FilmViewSet)
router.register(r'newsletter', NewsletterSubscriberViewSet)

urlpatterns = [
    path('', include(router.urls)),
]