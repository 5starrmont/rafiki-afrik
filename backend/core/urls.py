from django.urls import path
from . import views

urlpatterns = [
    # --- MODULE 2 ---
    path('settings/', views.get_site_settings, name='api-settings'),
    path('spotlight/', views.get_active_spotlight, name='api-spotlight'),

    # --- MODULE 4 ---
    path('team/', views.get_team_members, name='api-team'),

    # --- MODULE 7 ---
    path('services/', views.get_services, name='api-services'),
]