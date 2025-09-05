"""
🏔️ Middle Earth RPG - Authentication Views  
API endpoints for user registration, login, and profile management
"""

from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User, UserProfile
from .serializers import UserSerializer, UserProfileSerializer, UserRegistrationSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """🎯 Register a new user account"""
    
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            # Validate password
            password = serializer.validated_data['password']
            validate_password(password)
            
            # Create user
            user = User.objects.create_user(
                username=serializer.validated_data['username'],
                email=serializer.validated_data['email'],
                password=password
            )
            
            # Create profile
            UserProfile.objects.create(user=user)
            
            # Create authentication token
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'success': True,
                'message': '🎉 Conta criada com sucesso! Bem-vindo à Terra Média!',
                'data': {
                    'user': UserSerializer(user).data,
                    'token': token.key
                }
            }, status=status.HTTP_201_CREATED)
            
        except ValidationError as e:
            return Response({
                'success': False,
                'message': '❌ Erro na validação da senha',
                'errors': list(e.messages)
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'message': '❌ Erro interno do servidor',
                'errors': [str(e)]
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'success': False,
        'message': '❌ Dados inválidos',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """🔑 Authenticate user and return token"""
    
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'success': False,
            'message': '❌ Nome de usuário e senha são obrigatórios',
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Authenticate user
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        if user.is_active:
            # Update last login IP
            user.last_login_ip = request.META.get('REMOTE_ADDR')
            user.save(update_fields=['last_login_ip', 'last_login'])
            
            # Get or create token
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'success': True,
                'message': f'🏰 Bem-vindo de volta, {user.username}!',
                'data': {
                    'user': UserSerializer(user).data,
                    'token': token.key
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'message': '❌ Conta desativada. Contate o administrador.',
            }, status=status.HTTP_403_FORBIDDEN)
    else:
        return Response({
            'success': False,
            'message': '❌ Credenciais inválidas',
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """🚪 Logout user and delete token"""
    
    try:
        # Delete user token
        request.user.auth_token.delete()
        logout(request)
        
        return Response({
            'success': True,
            'message': '👋 Logout realizado com sucesso. Até a próxima aventura!'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'success': False,
            'message': '❌ Erro no logout',
            'errors': [str(e)]
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """👤 Get current user profile and characters"""
    
    try:
        user_data = UserSerializer(request.user).data
        profile_data = UserProfileSerializer(request.user.profile).data
        
        # Add character count and highest level
        user_data['total_characters'] = request.user.total_characters
        highest_char = request.user.highest_level_character
        user_data['highest_level'] = highest_char.level if highest_char else 0
        
        return Response({
            'success': True,
            'data': {
                'user': user_data,
                'profile': profile_data
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': '❌ Erro ao buscar perfil',
            'errors': [str(e)]
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateProfileView(generics.UpdateAPIView):
    """📝 Update user profile"""
    
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user.profile
    
    def patch(self, request, *args, **kwargs):
        try:
            response = super().patch(request, *args, **kwargs)
            return Response({
                'success': True,
                'message': '✅ Perfil atualizado com sucesso!',
                'data': response.data
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': '❌ Erro ao atualizar perfil',
                'errors': [str(e)]
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
