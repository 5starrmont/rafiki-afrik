from django.db import models
from django.utils import timezone
from django.utils.text import slugify

# --- GLOBAL SITE SETTINGS ---

class SiteSettings(models.Model):
    podcasts_produced_count = models.IntegerField(default=0)
    films_produced_count = models.IntegerField(default=0)
    articles_published_count = models.IntegerField(default=0)
    conversations_held_count = models.IntegerField(default=0)
    countries_reached_count = models.IntegerField(default=0)
    strategic_partnerships_count = models.IntegerField(default=0)

    about_who_we_are = models.TextField(default="Overview of Rafiki Afrik and its purpose.")
    about_mission = models.TextField(default="The organization's mission statement.")
    about_vision = models.TextField(default="The organization's vision statement.")

    facebook_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)
    youtube_url = models.URLField(blank=True, null=True)
    contact_email = models.EmailField(default="hello@rafikiafrik.africa")

    class Meta:
        verbose_name_plural = "Global Site Settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super(SiteSettings, self).save(*args, **kwargs)

    def __str__(self):
        return "Rafiki Afrik Global Settings"


class DynamicSpotlight(models.Model):
    tag = models.CharField(max_length=50, default="Featured Event")
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='spotlight/')
    short_description = models.TextField()
    button_text = models.CharField(max_length=50, default="Watch Now")
    button_link = models.URLField()
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# --- TEAM ---

class TeamMember(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100, help_text="e.g., Founder, Editor, Contributor")
    bio = models.TextField()
    profile_picture = models.ImageField(upload_to='team/')
    linkedin_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True, help_text="Uncheck to hide them from the website")
    order = models.IntegerField(default=0, help_text="Lower numbers appear first (e.g., 1 for Founder)")

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


# --- WAITLIST ---

class WaitlistEntry(models.Model):
    full_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100)
    organization = models.CharField(max_length=200, blank=True, null=True)
    submitted_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name_plural = "Waitlist Entries"
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.full_name} - {self.email}"


# --- SERVICES ---

class Service(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(help_text="Detailed description of the service or partnership opportunity")
    image = models.ImageField(upload_to='services/', blank=True, null=True)
    inquiry_button_text = models.CharField(max_length=50, default="Inquire Now")
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0, help_text="Lower numbers appear first")

    class Meta:
        verbose_name_plural = "Services"
        ordering = ['order', 'title']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title