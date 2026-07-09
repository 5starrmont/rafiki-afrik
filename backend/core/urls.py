from django.urls import path
from . import views

urlpatterns = [
    # --- MODULE 2 ---
    path('settings/', views.get_site_settings, name='api-settings'),
    path('spotlight/', views.get_active_spotlight, name='api-spotlight'),

    # --- MODULE 3 ---
    path('categories/', views.get_categories, name='api-categories'),
    path('articles/latest/', views.get_latest_articles, name='api-latest-articles'),
    path('videos/latest/', views.get_latest_videos, name='api-latest-videos'),

    # --- MODULE 4 ---
    path('team/', views.get_team_members, name='api-team'),

    # --- MODULE 5 ---
    path('waitlist/', views.join_waitlist, name='api-join-waitlist'),

    # --- MODULE 6 ---
    path('films/', views.get_films, name='api-films'),

    # --- MODULE 7 ---
    path('services/', views.get_services, name='api-services'),

    # --- MODULE 8 (NEW) ---
    path('newsletter/subscribe/', views.subscribe_newsletter, name='api-subscribe-newsletter'),
]