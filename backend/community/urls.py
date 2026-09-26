from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NewsletterSubscriberViewSet, WaitlistMemberViewSet

router = DefaultRouter()
router.register(r'newsletter', NewsletterSubscriberViewSet)
router.register(r'waitlist', WaitlistMemberViewSet)

urlpatterns = [
    path('', include(router.urls)),
]