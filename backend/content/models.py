from django.db import models
from django.utils.text import slugify
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


class Article(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='articles')
    author = models.CharField(max_length=255, default="Rafiki Afrik")
    featured_image = models.ImageField(upload_to='articles/images/')
    body = models.TextField(help_text="Full article content.")
    reading_time = models.CharField(max_length=50, help_text="e.g., '5 min read'")
    is_featured = models.BooleanField(default=False, help_text="Check to feature on the homepage.")
    is_published = models.BooleanField(default=True, help_text="Toggle to publish or save as draft.")
    published_date = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class VideoStory(models.Model):
    title = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='videos')
    youtube_url = models.URLField()
    thumbnail = models.ImageField(upload_to='videos/thumbnails/')
    description = models.TextField(help_text="Short description for the card.")
    is_featured = models.BooleanField(default=False, help_text="Check to feature on the homepage.")
    is_published = models.BooleanField(default=True, help_text="Toggle to publish or save as draft.")
    published_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title
        
    class Meta:
        verbose_name_plural = "Video Stories"


class Film(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    director = models.CharField(max_length=255)
    release_year = models.CharField(max_length=4)
    poster_image = models.ImageField(upload_to='films/posters/')
    description = models.TextField(help_text="Synopsis of the film.")
    video_url = models.URLField(blank=True, null=True, help_text="Link to the full film or trailer.")
    is_featured = models.BooleanField(default=False)
    published_date = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True, help_text="Uncheck if the user unsubscribes.")

    def __str__(self):
        return self.email