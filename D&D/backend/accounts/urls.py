"""
🏔️ Middle Earth RPG - Authentication URLs
API endpoints for user management
"""

from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    # 🎯 Authentication endpoints
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    
    # 👤 Profile endpoints  
    path('profile/', views.user_profile, name='profile'),
    path('profile/update/', views.UpdateProfileView.as_view(), name='update_profile'),
    
    # 🔑 Password management
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
]
