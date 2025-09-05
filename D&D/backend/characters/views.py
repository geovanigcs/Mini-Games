"""
🏔️ Middle Earth RPG - Character API Views
Complete character management system
"""

from rest_framework import status, generics, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Character, Race, CharacterClass, CharacterSkill
from .serializers import (
    CharacterSerializer, CharacterCreateSerializer, 
    RaceSerializer, CharacterClassSerializer,
    CharacterSkillSerializer
)


class RaceViewSet(viewsets.ReadOnlyModelViewSet):
    """🧝‍♂️ Read-only viewset for character races"""
    
    queryset = Race.objects.all()
    serializer_class = RaceSerializer
    permission_classes = [IsAuthenticated]


class CharacterClassViewSet(viewsets.ReadOnlyModelViewSet):
    """⚔️ Read-only viewset for character classes"""
    
    queryset = CharacterClass.objects.all()
    serializer_class = CharacterClassSerializer
    permission_classes = [IsAuthenticated]


class CharacterViewSet(viewsets.ModelViewSet):
    """🎭 Complete character management viewset"""
    
    serializer_class = CharacterSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return only user's characters"""
        return Character.objects.filter(user=self.request.user, is_active=True)
    
    def get_serializer_class(self):
        """Use different serializer for creation"""
        if self.action == 'create':
            return CharacterCreateSerializer
        return CharacterSerializer
    
    def create(self, request, *args, **kwargs):
        """🎨 Create new character"""
        try:
            # Check character limit (max 5 characters per user)
            user_characters_count = Character.objects.filter(user=request.user, is_active=True).count()
            if user_characters_count >= 5:
                return Response({
                    'success': False,
                    'message': '❌ Limite de 5 personagens atingido! Delete um personagem para criar outro.',
                }, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Create character
            character = serializer.save(user=request.user)
            
            return Response({
                'success': True,
                'message': f'🎉 Personagem {character.name} criado com sucesso!',
                'data': CharacterSerializer(character).data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': '❌ Erro ao criar personagem',
                'errors': [str(e)]
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def update(self, request, *args, **kwargs):
        """📝 Update character"""
        try:
            response = super().update(request, *args, **kwargs)
            return Response({
                'success': True,
                'message': '✅ Personagem atualizado com sucesso!',
                'data': response.data
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': '❌ Erro ao atualizar personagem',
                'errors': [str(e)]
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def destroy(self, request, *args, **kwargs):
        """🗑️ Soft delete character"""
        try:
            character = self.get_object()
            character.is_active = False
            character.save()
            
            return Response({
                'success': True,
                'message': f'💀 Personagem {character.name} foi removido da aventura.',
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': '❌ Erro ao deletar personagem',
                'errors': [str(e)]
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'])
    def level_up(self, request, pk=None):
        """⭐ Level up character"""
        try:
            character = self.get_object()
            
            # Calculate experience needed for next level
            exp_needed = character.level * 1000
            
            if character.experience >= exp_needed:
                character.level += 1
                character.experience -= exp_needed
                
                # Increase health and mana
                character.max_health += 10
                character.health = character.max_health  # Full heal on level up
                character.max_mana += 5
                character.mana = character.max_mana
                
                character.save()
                
                return Response({
                    'success': True,
                    'message': f'🎉 {character.name} subiu para o nível {character.level}!',
                    'data': CharacterSerializer(character).data
                })
            else:
                return Response({
                    'success': False,
                    'message': f'❌ Experiência insuficiente. Precisa de {exp_needed - character.experience} XP.',
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({
                'success': False,
                'message': '❌ Erro ao subir de nível',
                'errors': [str(e)]
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'])
    def add_skill(self, request, pk=None):
        """📚 Add new skill to character"""
        try:
            character = self.get_object()
            skill_serializer = CharacterSkillSerializer(data=request.data)
            
            if skill_serializer.is_valid():
                skill = skill_serializer.save(character=character)
                
                return Response({
                    'success': True,
                    'message': f'⭐ Habilidade {skill.name} aprendida!',
                    'data': CharacterSkillSerializer(skill).data
                })
            else:
                return Response({
                    'success': False,
                    'message': '❌ Dados da habilidade inválidos',
                    'errors': skill_serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({
                'success': False,
                'message': '❌ Erro ao adicionar habilidade',
                'errors': [str(e)]
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def roll_attributes(request):
    """🎲 Roll random character attributes (D&D style)"""
    
    import random
    
    def roll_4d6_drop_lowest():
        """Roll 4d6, drop lowest die"""
        rolls = [random.randint(1, 6) for _ in range(4)]
        rolls.sort(reverse=True)
        return sum(rolls[:3])  # Sum the highest 3
    
    try:
        attributes = {
            'strength': roll_4d6_drop_lowest(),
            'dexterity': roll_4d6_drop_lowest(), 
            'constitution': roll_4d6_drop_lowest(),
            'intelligence': roll_4d6_drop_lowest(),
            'wisdom': roll_4d6_drop_lowest(),
            'charisma': roll_4d6_drop_lowest(),
        }
        
        # Calculate total and average
        total = sum(attributes.values())
        average = total / 6
        
        return Response({
            'success': True,
            'message': f'🎲 Atributos rolados! Total: {total}, Média: {average:.1f}',
            'data': {
                'attributes': attributes,
                'total': total,
                'average': round(average, 1),
                'rolls_info': 'Rolagem 4d6, descartando menor dado'
            }
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'message': '❌ Erro ao rolar atributos',
            'errors': [str(e)]
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def character_statistics(request):
    """📊 Get user's character statistics"""
    
    try:
        user = request.user
        characters = user.characters.filter(is_active=True)
        
        if not characters.exists():
            return Response({
                'success': True,
                'message': '📝 Nenhum personagem criado ainda',
                'data': {
                    'total_characters': 0,
                    'average_level': 0,
                    'total_experience': 0,
                    'favorite_race': None,
                    'favorite_class': None,
                }
            })
        
        # Calculate statistics
        total_chars = characters.count()
        avg_level = characters.aggregate(models.Avg('level'))['level__avg'] or 0
        total_exp = characters.aggregate(models.Sum('experience'))['experience__sum'] or 0
        
        # Most used race and class
        race_counts = characters.values('race__name').annotate(
            count=models.Count('race')
        ).order_by('-count').first()
        
        class_counts = characters.values('character_class__name').annotate(
            count=models.Count('character_class')
        ).order_by('-count').first()
        
        stats = {
            'total_characters': total_chars,
            'average_level': round(avg_level, 1),
            'total_experience': total_exp,
            'favorite_race': race_counts['race__name'] if race_counts else None,
            'favorite_class': class_counts['character_class__name'] if class_counts else None,
            'highest_level': characters.order_by('-level').first().level,
            'characters': CharacterSerializer(characters, many=True).data
        }
        
        return Response({
            'success': True,
            'data': stats
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'message': '❌ Erro ao buscar estatísticas',
            'errors': [str(e)]
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
