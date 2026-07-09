from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import SiteSettings, DynamicSpotlight, Category, Article, VideoStory, TeamMember, WaitlistEntry, Film, Service, NewsletterSubscriber
from .serializers import (
    SiteSettingsSerializer, 
    DynamicSpotlightSerializer,
    CategorySerializer,
    ArticleSerializer,
    VideoStorySerializer,
    TeamMemberSerializer,
    WaitlistEntrySerializer,
    FilmSerializer,
    ServiceSerializer,
    NewsletterSubscriberSerializer
)

# --- MODULE 2 ---
@api_view(['GET'])
def get_site_settings(request):
    settings = SiteSettings.objects.first()
    if settings:
        serializer = SiteSettingsSerializer(settings)
        return Response(serializer.data)
    return Response({})

@api_view(['GET'])
def get_active_spotlight(request):
    spotlight = DynamicSpotlight.objects.filter(is_active=True).first()
    if spotlight:
        serializer = DynamicSpotlightSerializer(spotlight, context={'request': request})
        return Response(serializer.data)
    return Response(None)

# --- MODULE 3 ---
@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_latest_articles(request):
    articles = Article.objects.order_by('-publish_date')[:6]
    serializer = ArticleSerializer(articles, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def get_latest_videos(request):
    videos = VideoStory.objects.order_by('-publish_date')[:6]
    serializer = VideoStorySerializer(videos, many=True, context={'request': request})
    return Response(serializer.data)

# --- MODULE 4 ---
@api_view(['GET'])
def get_team_members(request):
    team = TeamMember.objects.filter(is_active=True).order_by('order', 'name')
    serializer = TeamMemberSerializer(team, many=True, context={'request': request})
    return Response(serializer.data)

# --- MODULE 5 ---
@api_view(['POST'])
def join_waitlist(request):
    serializer = WaitlistEntrySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Successfully joined the waitlist!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- MODULE 6 ---
@api_view(['GET'])
def get_films(request):
    films = Film.objects.all()
    serializer = FilmSerializer(films, many=True, context={'request': request})
    return Response(serializer.data)

# --- MODULE 7 ---
@api_view(['GET'])
def get_services(request):
    services = Service.objects.filter(is_active=True).order_by('order', 'title')
    serializer = ServiceSerializer(services, many=True, context={'request': request})
    return Response(serializer.data)

# --- MODULE 8 (NEW) ---
@api_view(['POST'])
def subscribe_newsletter(request):
    """Receives an email from the footer and adds it to the newsletter list"""
    serializer = NewsletterSubscriberSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Successfully subscribed!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)