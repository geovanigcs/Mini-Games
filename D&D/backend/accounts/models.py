"""
🏔️ Middle Earth RPG - Custom User Model
Extended user model with RPG-specific fields
"""

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    """Extended user model for Middle Earth RPG"""
    
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    is_premium = models.BooleanField(default=False)
    experience_points = models.IntegerField(default=0)
    total_playtime_hours = models.FloatField(default=0.0)
    
    # Game preferences
    preferred_language = models.CharField(
        max_length=10, 
        default='pt-br',
        choices=[
            ('pt-br', 'Português'),
            ('en', 'English'),
            ('es', 'Español'),
        ]
    )
    
    # Social features
    friends = models.ManyToManyField(
        'self', 
        symmetrical=True, 
        blank=True,
        related_name='user_friends'
    )
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"🧙‍♂️ {self.username}"
    
    @property
    def total_characters(self):
        return self.characters.count()
    
    @property
    def highest_level_character(self):
        return self.characters.order_by('-level').first()


class UserProfile(models.Model):
    """Additional profile information for users"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    
    # Gaming stats
    favorite_race = models.CharField(max_length=50, blank=True)
    favorite_class = models.CharField(max_length=50, blank=True)
    achievements_unlocked = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profiles'
        
    def __str__(self):
        return f"📜 Profile of {self.user.username}"
