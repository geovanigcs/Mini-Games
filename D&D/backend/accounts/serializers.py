"""
🏔️ Middle Earth RPG - API Serializers
Data serialization for REST API responses
"""

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, UserProfile


class UserSerializer(serializers.ModelSerializer):
    """👤 User model serializer"""
    
    total_characters = serializers.ReadOnlyField()
    highest_level_character = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'date_joined', 'last_login', 'is_premium', 'experience_points',
            'total_playtime_hours', 'preferred_language', 'total_characters',
            'highest_level_character'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']
    
    def get_highest_level_character(self, obj):
        """Get user's highest level character"""
        highest_char = obj.highest_level_character
        if highest_char:
            return {
                'name': highest_char.name,
                'level': highest_char.level,
                'race': highest_char.race.name,
                'class': highest_char.character_class.name,
                'emoji': f"{highest_char.race.emoji} {highest_char.character_class.emoji}"
            }
        return None


class UserProfileSerializer(serializers.ModelSerializer):
    """📜 User profile serializer"""
    
    class Meta:
        model = UserProfile
        fields = [
            'bio', 'location', 'birth_date', 'favorite_race', 
            'favorite_class', 'achievements_unlocked', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class UserRegistrationSerializer(serializers.Serializer):
    """📝 User registration serializer with validation"""
    
    username = serializers.CharField(
        max_length=150,
        help_text="🏷️ Nome de usuário único (3-150 caracteres)"
    )
    email = serializers.EmailField(
        help_text="📧 E-mail válido para comunicação"
    )
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        help_text="🔒 Senha segura (mínimo 8 caracteres)"
    )
    confirm_password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        help_text="🔒 Confirmação da senha"
    )
    first_name = serializers.CharField(
        max_length=150,
        required=False,
        allow_blank=True,
        help_text="👤 Primeiro nome (opcional)"
    )
    last_name = serializers.CharField(
        max_length=150,
        required=False,
        allow_blank=True,
        help_text="👤 Sobrenome (opcional)"
    )
    
    def validate_username(self, value):
        """Validate username uniqueness"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "❌ Este nome de usuário já está em uso. Escolha outro!"
            )
        
        if len(value) < 3:
            raise serializers.ValidationError(
                "❌ Nome de usuário deve ter pelo menos 3 caracteres"
            )
            
        return value
    
    def validate_email(self, value):
        """Validate email uniqueness"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "❌ Este e-mail já está cadastrado. Faça login ou use outro e-mail!"
            )
        return value
    
    def validate_password(self, value):
        """Validate password strength"""
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value
    
    def validate(self, attrs):
        """Validate password confirmation"""
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': '❌ As senhas não coincidem!'
            })
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    """🔑 Change password serializer"""
    
    current_password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        help_text="🔒 Senha atual"
    )
    new_password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        help_text="🔒 Nova senha"
    )
    confirm_new_password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        help_text="🔒 Confirmação da nova senha"
    )
    
    def validate_current_password(self, value):
        """Validate current password"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('❌ Senha atual incorreta!')
        return value
    
    def validate_new_password(self, value):
        """Validate new password strength"""
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value
    
    def validate(self, attrs):
        """Validate new password confirmation"""
        if attrs['new_password'] != attrs['confirm_new_password']:
            raise serializers.ValidationError({
                'confirm_new_password': '❌ As senhas não coincidem!'
            })
        return attrs
