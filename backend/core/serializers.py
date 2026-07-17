from rest_framework import serializers
from .models import SiteSettings, DynamicSpotlight, TeamMember, WaitlistEntry, Service

# --- MODULE 2 ---
class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = '__all__'

class DynamicSpotlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = DynamicSpotlight
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

# --- MODULE 7 ---
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'