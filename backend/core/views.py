from rest_framework.decorators import api_view
from rest_framework.response import Response

# Imports from core (this app)
from .models import SiteSettings, DynamicSpotlight, TeamMember, Service
from .serializers import (
    SiteSettingsSerializer, 
    DynamicSpotlightSerializer,
    TeamMemberSerializer,
    ServiceSerializer
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

# --- MODULE 4 ---
@api_view(['GET'])
def get_team_members(request):
    team = TeamMember.objects.filter(is_active=True).order_by('order', 'name')
    serializer = TeamMemberSerializer(team, many=True, context={'request': request})
    return Response(serializer.data)

# --- MODULE 7 ---
@api_view(['GET'])
def get_services(request):
    services = Service.objects.filter(is_active=True).order_by('order', 'title')
    serializer = ServiceSerializer(services, many=True, context={'request': request})
    return Response(serializer.data)