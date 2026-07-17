from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # This prefixes all our core routes with 'api/'
    path('api/', include('core.urls')), 
    # This mounts your new content endpoints at /api/content/
    path('api/content/', include('content.urls')),
]

# Allows Django to serve uploaded images (like the Spotlight cover) during local development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)