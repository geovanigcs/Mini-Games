"""
🏔️ Middle Earth RPG - Character URLs
Character management endpoints
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CharacterViewSet, RaceListView, CharacterClassListView,
    CharacterLevelUpView, CharacterSkillLearnView, CharacterStatsView,
    CharacterLeaderboardView
)

# Create router for viewsets
router = DefaultRouter()
router.register(r'characters', CharacterViewSet, basename='character')

app_name = 'characters'

urlpatterns = [
    # API Routes
    path('api/', include(router.urls)),
    
    # ⚔️ Character Management
    path('api/races/', RaceListView.as_view(), name='race-list'),
    path('api/classes/', CharacterClassListView.as_view(), name='class-list'),
    path('api/characters/<int:character_id>/level-up/', CharacterLevelUpView.as_view(), name='character-level-up'),
    path('api/characters/<int:character_id>/learn-skill/', CharacterSkillLearnView.as_view(), name='character-learn-skill'),
    path('api/characters/<int:character_id>/stats/', CharacterStatsView.as_view(), name='character-stats'),
    
    # 🏆 Leaderboards
    path('api/leaderboard/', CharacterLeaderboardView.as_view(), name='character-leaderboard'),
]
