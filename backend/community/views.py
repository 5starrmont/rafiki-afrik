from rest_framework import viewsets
from .models import NewsletterSubscriber, WaitlistMember
from .serializers import NewsletterSubscriberSerializer, WaitlistMemberSerializer

class NewsletterSubscriberViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscriber.objects.all().order_by('-subscribed_at')
    serializer_class = NewsletterSubscriberSerializer

class WaitlistMemberViewSet(viewsets.ModelViewSet):
    queryset = WaitlistMember.objects.all().order_by('-date_joined')
    serializer_class = WaitlistMemberSerializer