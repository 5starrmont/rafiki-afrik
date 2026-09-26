from rest_framework import serializers
from .models import NewsletterSubscriber, WaitlistMember

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = '__all__'

class WaitlistMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaitlistMember
        fields = '__all__'