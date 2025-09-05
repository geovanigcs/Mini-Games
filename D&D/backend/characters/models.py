"""
🏔️ Middle Earth RPG - Character Models
All character-related database models based on Middle Earth lore
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
import json

User = get_user_model()


class Race(models.Model):
    """Character races available in Middle Earth"""
    
    RACE_CHOICES = [
        ('human', '👨‍⚔️ Humano'),
        ('elf', '🧝‍♂️ Elfo'),
        ('dwarf', '🧙‍♂️ Anão'),
        ('halfling', '🧚‍♂️ Hobbit'),
        ('half_orc', '👹 Meio-Orc'),
        ('half_elf', '🧝‍♀️ Meio-Elfo'),
        ('dunedain', '👑 Dúnedain'),
        ('numenorean', '🏛️ Númenoreano'),
        ('maiar', '⭐ Maiar'),
    ]
    
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    emoji = models.CharField(max_length=10)
    
    # Attribute bonuses
    strength_bonus = models.IntegerField(default=0)
    dexterity_bonus = models.IntegerField(default=0)
    constitution_bonus = models.IntegerField(default=0)
    intelligence_bonus = models.IntegerField(default=0)
    wisdom_bonus = models.IntegerField(default=0)
    charisma_bonus = models.IntegerField(default=0)
    
    # Special abilities (JSON field)
    special_abilities = models.JSONField(default=list)
    
    # Physical characteristics
    avg_height_cm = models.IntegerField()
    avg_weight_kg = models.IntegerField()
    lifespan_years = models.IntegerField()
    
    class Meta:
        db_table = 'races'
        verbose_name = 'Race'
        verbose_name_plural = 'Races'
        
    def __str__(self):
        return f"{self.emoji} {self.name}"


class CharacterClass(models.Model):
    """Character classes/professions"""
    
    CLASS_CHOICES = [
        ('warrior', '⚔️ Guerreiro'),
        ('mage', '🔮 Mago'),
        ('rogue', '🗡️ Ladino'),
        ('cleric', '⛪ Clérigo'),
        ('barbarian', '🪓 Bárbaro'),
        ('paladin', '🛡️ Paladino'),
        ('druid', '🌿 Druida'),
        ('monk', '👊 Monge'),
        ('sorcerer', '✨ Feiticeiro'),
        ('warlock', '👁️ Bruxo'),
        ('ranger', '🏹 Patrulheiro'),
    ]
    
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    emoji = models.CharField(max_length=10)
    icon_name = models.CharField(max_length=50)
    
    # Primary attribute
    primary_attribute = models.CharField(
        max_length=20,
        choices=[
            ('strength', 'Força'),
            ('dexterity', 'Destreza'),
            ('constitution', 'Constituição'),
            ('intelligence', 'Inteligência'),
            ('wisdom', 'Sabedoria'),
            ('charisma', 'Carisma'),
        ]
    )
    
    # Starting skills
    starting_skills = models.JSONField(default=list)
    
    # Hit die for health calculation
    hit_die = models.IntegerField(default=8)
    
    class Meta:
        db_table = 'character_classes'
        verbose_name = 'Character Class'
        verbose_name_plural = 'Character Classes'
        
    def __str__(self):
        return f"{self.emoji} {self.name}"


class Character(models.Model):
    """Player characters in Middle Earth"""
    
    # Basic Information
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='characters')
    name = models.CharField(max_length=100)
    nickname = models.CharField(max_length=100, blank=True)
    race = models.ForeignKey(Race, on_delete=models.PROTECT)
    character_class = models.ForeignKey(CharacterClass, on_delete=models.PROTECT)
    
    # Core Attributes (3-18 range, standard D&D)
    strength = models.IntegerField(
        validators=[MinValueValidator(3), MaxValueValidator(18)],
        help_text="💪 Physical power for melee combat"
    )
    dexterity = models.IntegerField(
        validators=[MinValueValidator(3), MaxValueValidator(18)],
        help_text="🏃 Speed, dexterity, and ranged accuracy"
    )
    constitution = models.IntegerField(
        validators=[MinValueValidator(3), MaxValueValidator(18)],
        help_text="❤️ Health, stamina, and physical resilience"
    )
    intelligence = models.IntegerField(
        validators=[MinValueValidator(3), MaxValueValidator(18)],
        help_text="🧠 Magical power and reasoning ability"
    )
    wisdom = models.IntegerField(
        validators=[MinValueValidator(3), MaxValueValidator(18)],
        help_text="🔮 Perception, intuition, and will"
    )
    charisma = models.IntegerField(
        validators=[MinValueValidator(3), MaxValueValidator(18)],
        help_text="😎 Leadership, persuasion, and force of personality"
    )
    
    # Character progression
    level = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(100)])
    experience = models.BigIntegerField(default=0)
    health = models.IntegerField(default=100)
    max_health = models.IntegerField(default=100)
    mana = models.IntegerField(default=50)
    max_mana = models.IntegerField(default=50)
    
    # Physical appearance
    age = models.IntegerField(validators=[MinValueValidator(15), MaxValueValidator(5000)])
    height_cm = models.IntegerField()
    weight_kg = models.IntegerField()
    eye_color = models.CharField(max_length=50)
    hair_color = models.CharField(max_length=50)
    skin_tone = models.CharField(max_length=50)
    distinguishing_marks = models.TextField(blank=True)
    
    # Moral alignment
    ALIGNMENT_CHOICES = [
        ('lawful_good', '⚖️ Leal e Bom'),
        ('neutral_good', '😇 Neutro e Bom'), 
        ('chaotic_good', '🔥 Caótico e Bom'),
        ('lawful_neutral', '📏 Leal e Neutro'),
        ('true_neutral', '⚖️ Neutro Puro'),
        ('chaotic_neutral', '🎲 Caótico e Neutro'),
        ('lawful_evil', '👿 Leal e Mau'),
        ('neutral_evil', '💀 Neutro e Mau'),
        ('chaotic_evil', '🔥💀 Caótico e Mau'),
    ]
    
    alignment = models.CharField(max_length=20, choices=ALIGNMENT_CHOICES, default='neutral_good')
    
    # Character background
    origin_region = models.CharField(max_length=100, help_text="🗺️ Região de origem na Terra Média")
    motivation = models.TextField(help_text="🎯 Principal motivação do personagem")
    background_story = models.TextField(help_text="📜 História do personagem")
    dark_secret = models.TextField(blank=True, help_text="🤫 Segredo guardado")
    
    # Game mechanics
    current_location = models.CharField(max_length=100, default="Shire")
    gold = models.IntegerField(default=100)
    
    # Languages spoken
    languages = models.JSONField(
        default=list,
        help_text="📚 Idiomas falados (Comum, Élfico, Anão, etc.)"
    )
    
    # Knowledge areas
    knowledge_areas = models.JSONField(
        default=list,
        help_text="🎓 Conhecimentos especializados"
    )
    
    # Personality traits
    personality_traits = models.JSONField(default=dict, help_text="😊 Traços de personalidade")
    ideals = models.JSONField(default=list, help_text="⭐ Ideais do personagem")
    bonds = models.JSONField(default=list, help_text="🔗 Vínculos importantes")
    flaws = models.JSONField(default=list, help_text="😅 Defeitos do personagem")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_played = models.DateTimeField(null=True, blank=True)
    
    # Character status
    is_alive = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'characters'
        verbose_name = 'Character'
        verbose_name_plural = 'Characters'
        unique_together = ['user', 'name']  # Unique name per user
        
    def __str__(self):
        return f"{self.race.emoji} {self.name} (Level {self.level} {self.character_class.name})"
    
    @property
    def total_attribute_modifier(self):
        """Calculate total attribute bonus from race"""
        return (
            self.race.strength_bonus + self.race.dexterity_bonus +
            self.race.constitution_bonus + self.race.intelligence_bonus +
            self.race.wisdom_bonus + self.race.charisma_bonus
        )
    
    @property 
    def combat_power(self):
        """Calculate overall combat effectiveness"""
        base_power = (self.strength + self.dexterity + self.constitution) * self.level
        return base_power + (self.experience // 1000)
    
    @property
    def magical_power(self):
        """Calculate magical effectiveness"""
        base_magic = (self.intelligence + self.wisdom + self.charisma) * self.level
        return base_magic + (self.experience // 1000)


class CharacterSkill(models.Model):
    """Skills and abilities learned by characters"""
    
    character = models.ForeignKey(Character, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)
    description = models.TextField()
    skill_type = models.CharField(
        max_length=20,
        choices=[
            ('combat', '⚔️ Combate'),
            ('magic', '🔮 Magia'),
            ('utility', '🛠️ Utilidade'),
            ('social', '🗣️ Social'),
            ('survival', '🏕️ Sobrevivência'),
        ]
    )
    level = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(100)])
    experience = models.IntegerField(default=0)
    
    # Cooldowns and costs
    mana_cost = models.IntegerField(default=0)
    cooldown_seconds = models.IntegerField(default=0)
    
    learned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'character_skills'
        unique_together = ['character', 'name']
        
    def __str__(self):
        return f"⭐ {self.name} (Level {self.level})"
