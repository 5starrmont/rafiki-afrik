from django.db import models
from django.utils import timezone

class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(
        default=True,
        help_text="Uncheck if they unsubscribe from the newsletter."
    )
    subscribed_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-subscribed_at']
        verbose_name_plural = "Newsletter Subscribers"

    def __str__(self):
        return self.email


class WaitlistMember(models.Model):
    # Core Identity
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    country = models.CharField(max_length=100)
    
    # Extended Info (Optional)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    organization = models.CharField(max_length=255, blank=True, null=True)
    
    # Community & Movement Flags
    is_approved = models.BooleanField(
        default=False, 
        help_text="Checked when they are approved to join the Friends from Afrika 4 Afrika cohort."
    )
    
    # Tracking
    date_joined = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-date_joined']
        verbose_name_plural = "Waitlist Members"

    def __str__(self):
        return f"{self.full_name} ({self.email})"