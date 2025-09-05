"""
🏔️ Middle Earth RPG - Character Serializers
API serialization for character data
"""

from rest_framework import serializers
from .models import Character, Race, CharacterClass, CharacterSkill


class RaceSerializer(serializers.ModelSerializer):
    """🧝‍♂️ Race serializer"""
    
    attribute_bonuses = serializers.SerializerMethodField()
    
    class Meta:
        model = Race
        fields = [
            'id', 'name', 'description', 'emoji', 
            'special_abilities', 'avg_height_cm', 'avg_weight_kg', 
            'lifespan_years', 'attribute_bonuses'
        ]
    
    def get_attribute_bonuses(self, obj):
        """Get formatted attribute bonuses"""
        return {
            'strength': obj.strength_bonus,
            'dexterity': obj.dexterity_bonus,
            'constitution': obj.constitution_bonus,
            'intelligence': obj.intelligence_bonus,
            'wisdom': obj.wisdom_bonus,
            'charisma': obj.charisma_bonus,
        }


class CharacterClassSerializer(serializers.ModelSerializer):
    """⚔️ Character class serializer"""
    
    class Meta:
        model = CharacterClass
        fields = [
            'id', 'name', 'description', 'emoji', 'icon_name',
            'primary_attribute', 'starting_skills', 'hit_die'
        ]


class CharacterSkillSerializer(serializers.ModelSerializer):
    """⭐ Character skill serializer"""
    
    class Meta:
        model = CharacterSkill
        fields = [
            'id', 'name', 'description', 'skill_type', 'level',
            'experience', 'mana_cost', 'cooldown_seconds', 'learned_at'
        ]
        read_only_fields = ['id', 'learned_at']


class CharacterSerializer(serializers.ModelSerializer):
    """🎭 Complete character serializer"""
    
    race = RaceSerializer(read_only=True)
    character_class = CharacterClassSerializer(read_only=True)
    skills = CharacterSkillSerializer(many=True, read_only=True)
    
    # Calculated fields
    total_attribute_modifier = serializers.ReadOnlyField()
    combat_power = serializers.ReadOnlyField()
    magical_power = serializers.ReadOnlyField()
    
    class Meta:
        model = Character
        fields = [
            'id', 'name', 'nickname', 'race', 'character_class',
            'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma',
            'level', 'experience', 'health', 'max_health', 'mana', 'max_mana',
            'age', 'height_cm', 'weight_kg', 'eye_color', 'hair_color', 'skin_tone',
            'distinguishing_marks', 'alignment', 'origin_region', 'motivation',
            'background_story', 'dark_secret', 'current_location', 'gold',
            'languages', 'knowledge_areas', 'personality_traits', 'ideals', 'bonds', 'flaws',
            'created_at', 'updated_at', 'last_played', 'is_alive', 'skills',
            'total_attribute_modifier', 'combat_power', 'magical_power'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_attribute_modifier', 'combat_power', 'magical_power']


class CharacterCreateSerializer(serializers.ModelSerializer):
    """🎨 Character creation serializer with validation"""
    
    race_id = serializers.CharField(write_only=True)
    class_id = serializers.CharField(write_only=True)
    
    class Meta:
        model = Character
        fields = [
            'name', 'nickname', 'race_id', 'class_id',
            'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma',
            'age', 'height_cm', 'weight_kg', 'eye_color', 'hair_color', 'skin_tone',
            'distinguishing_marks', 'alignment', 'origin_region', 'motivation',
            'background_story', 'dark_secret', 'languages', 'knowledge_areas',
            'personality_traits', 'ideals', 'bonds', 'flaws'
        ]
    
    def validate_name(self, value):
        """Validate character name uniqueness for user"""
        user = self.context['request'].user
        if Character.objects.filter(user=user, name=value, is_active=True).exists():
            raise serializers.ValidationError(
                f"❌ Você já possui um personagem chamado '{value}'. Escolha outro nome!"
            )
        
        if len(value.strip()) < 2:
            raise serializers.ValidationError(
                "❌ Nome deve ter pelo menos 2 caracteres"
            )
            
        return value.strip()
    
    def validate_race_id(self, value):
        """Validate race exists"""
        try:
            race = Race.objects.get(id=value)
            return race
        except Race.DoesNotExist:
            raise serializers.ValidationError(f"❌ Raça '{value}' não encontrada")
    
    def validate_class_id(self, value):
        """Validate class exists"""
        try:
            char_class = CharacterClass.objects.get(id=value)
            return char_class
        except CharacterClass.DoesNotExist:
            raise serializers.ValidationError(f"❌ Classe '{value}' não encontrada")
    
    def validate_attributes(self, attrs):
        """Validate all attributes are within 3-18 range"""
        attribute_fields = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']
        
        for attr_name in attribute_fields:
            value = attrs.get(attr_name)
            if value is not None and (value < 3 or value > 18):
                raise serializers.ValidationError(
                    f"❌ {attr_name.capitalize()} deve estar entre 3 e 18 (atual: {value})"
                )
        
        return attrs
    
    def create(self, validated_data):
        """Create character with race and class assignment"""
        race = validated_data.pop('race_id')
        char_class = validated_data.pop('class_id')
        
        # Apply racial bonuses
        validated_data['strength'] += race.strength_bonus
        validated_data['dexterity'] += race.dexterity_bonus
        validated_data['constitution'] += race.constitution_bonus
        validated_data['intelligence'] += race.intelligence_bonus
        validated_data['wisdom'] += race.wisdom_bonus
        validated_data['charisma'] += race.charisma_bonus
        
        # Set max health based on constitution and class
        constitution_modifier = (validated_data['constitution'] - 10) // 2
        validated_data['max_health'] = char_class.hit_die + constitution_modifier
        validated_data['health'] = validated_data['max_health']
        
        # Set max mana based on intelligence/wisdom
        magic_modifier = max(
            (validated_data['intelligence'] - 10) // 2,
            (validated_data['wisdom'] - 10) // 2
        )
        validated_data['max_mana'] = 10 + magic_modifier
        validated_data['mana'] = validated_data['max_mana']
        
        # Assign race and class
        validated_data['race'] = race
        validated_data['character_class'] = char_class
        
        return super().create(validated_data)
