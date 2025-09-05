"""
🏔️ Middle Earth RPG - Character Management Commands
Django management commands for character data
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from characters.models import Race, CharacterClass


class Command(BaseCommand):
    help = '🏔️ Initialize Middle Earth RPG game data (races, classes, etc.)'

    def handle(self, *args, **options):
        """Initialize all game data"""
        self.stdout.write(self.style.SUCCESS('🏔️ Inicializando dados do Middle Earth RPG...'))
        
        with transaction.atomic():
            self.create_races()
            self.create_classes()
        
        self.stdout.write(
            self.style.SUCCESS('✅ Dados do Middle Earth RPG inicializados com sucesso!')
        )

    def create_races(self):
        """Create all playable races"""
        races_data = [
            {
                'id': 'human',
                'name': 'Humano',
                'description': 'Versáteis e ambiciosos, os humanos se adaptam a qualquer situação.',
                'emoji': '👨‍🦲',
                'special_abilities': ['Versatilidade', 'Adaptabilidade', 'Liderança Natural'],
                'avg_height_cm': 175,
                'avg_weight_kg': 70,
                'lifespan_years': 80,
                'strength_bonus': 0,
                'dexterity_bonus': 0,
                'constitution_bonus': 1,
                'intelligence_bonus': 1,
                'wisdom_bonus': 0,
                'charisma_bonus': 1
            },
            {
                'id': 'elf',
                'name': 'Elfo',
                'description': 'Seres imortais de grande sabedoria e graça, mestres da magia.',
                'emoji': '🧝‍♂️',
                'special_abilities': ['Imortalidade', 'Visão Noturna', 'Resistência à Magia'],
                'avg_height_cm': 180,
                'avg_weight_kg': 65,
                'lifespan_years': 10000,
                'strength_bonus': 0,
                'dexterity_bonus': 2,
                'constitution_bonus': -1,
                'intelligence_bonus': 1,
                'wisdom_bonus': 1,
                'charisma_bonus': 1
            },
            {
                'id': 'dwarf',
                'name': 'Anão',
                'description': 'Guerreiros robustos das montanhas, mestres da forja e do martelo.',
                'emoji': '🧔',
                'special_abilities': ['Resistência', 'Conhecimento de Pedras', 'Maestria em Forja'],
                'avg_height_cm': 140,
                'avg_weight_kg': 80,
                'lifespan_years': 300,
                'strength_bonus': 1,
                'dexterity_bonus': 0,
                'constitution_bonus': 2,
                'intelligence_bonus': 0,
                'wisdom_bonus': 1,
                'charisma_bonus': -1
            },
            {
                'id': 'hobbit',
                'name': 'Hobbit',
                'description': 'Pequenos mas corajosos, amantes da paz e das aventuras inesperadas.',
                'emoji': '🏠',
                'special_abilities': ['Pés Peludos Silenciosos', 'Sorte', 'Resistência ao Medo'],
                'avg_height_cm': 100,
                'avg_weight_kg': 35,
                'lifespan_years': 120,
                'strength_bonus': -1,
                'dexterity_bonus': 2,
                'constitution_bonus': 1,
                'intelligence_bonus': 0,
                'wisdom_bonus': 1,
                'charisma_bonus': 1
            },
            {
                'id': 'orc',
                'name': 'Orc',
                'description': 'Guerreiros ferozes corrompidos pela escuridão, mas capazes de redenção.',
                'emoji': '👹',
                'special_abilities': ['Fúria de Batalha', 'Visão Noturna', 'Resistência à Dor'],
                'avg_height_cm': 190,
                'avg_weight_kg': 90,
                'lifespan_years': 60,
                'strength_bonus': 2,
                'dexterity_bonus': 1,
                'constitution_bonus': 1,
                'intelligence_bonus': -1,
                'wisdom_bonus': -1,
                'charisma_bonus': -2
            },
            {
                'id': 'ent',
                'name': 'Ent',
                'description': 'Guardiões ancestrais das florestas, sábios e poderosos.',
                'emoji': '🌳',
                'special_abilities': ['Comando sobre Plantas', 'Regeneração', 'Longevidade'],
                'avg_height_cm': 400,
                'avg_weight_kg': 500,
                'lifespan_years': 50000,
                'strength_bonus': 3,
                'dexterity_bonus': -2,
                'constitution_bonus': 2,
                'intelligence_bonus': 0,
                'wisdom_bonus': 3,
                'charisma_bonus': 0
            },
            {
                'id': 'eagle',
                'name': 'Águia Gigante',
                'description': 'Nobres senhores dos céus, aliados dos povos livres.',
                'emoji': '🦅',
                'special_abilities': ['Voo', 'Visão Aguçada', 'Velocidade'],
                'avg_height_cm': 200,
                'avg_weight_kg': 50,
                'lifespan_years': 500,
                'strength_bonus': 1,
                'dexterity_bonus': 3,
                'constitution_bonus': 0,
                'intelligence_bonus': 2,
                'wisdom_bonus': 2,
                'charisma_bonus': 1
            },
            {
                'id': 'wizard',
                'name': 'Istari (Mago)',
                'description': 'Enviados divinos com grande poder mágico e sabedoria.',
                'emoji': '🧙‍♂️',
                'special_abilities': ['Magia Poderosa', 'Sabedoria Ancestral', 'Imortalidade'],
                'avg_height_cm': 180,
                'avg_weight_kg': 75,
                'lifespan_years': 999999,
                'strength_bonus': -1,
                'dexterity_bonus': 0,
                'constitution_bonus': 0,
                'intelligence_bonus': 3,
                'wisdom_bonus': 3,
                'charisma_bonus': 2
            },
            {
                'id': 'ranger',
                'name': 'Dúnadan (Montanhês)',
                'description': 'Guardiões das terras selvagens, herdeiros de Númenor.',
                'emoji': '🏹',
                'special_abilities': ['Rastreamento', 'Sobrevivência', 'Longevidade'],
                'avg_height_cm': 185,
                'avg_weight_kg': 75,
                'lifespan_years': 150,
                'strength_bonus': 1,
                'dexterity_bonus': 2,
                'constitution_bonus': 1,
                'intelligence_bonus': 1,
                'wisdom_bonus': 2,
                'charisma_bonus': 0
            }
        ]
        
        for race_data in races_data:
            race, created = Race.objects.get_or_create(
                id=race_data['id'],
                defaults=race_data
            )
            if created:
                self.stdout.write(f'✨ Raça criada: {race.name}')

    def create_classes(self):
        """Create all character classes"""
        classes_data = [
            {
                'id': 'warrior',
                'name': 'Guerreiro',
                'description': 'Mestre das armas e da batalha, protege os inocentes.',
                'emoji': '⚔️',
                'icon_name': 'sword',
                'primary_attribute': 'strength',
                'starting_skills': ['Combate Corpo a Corpo', 'Resistência', 'Liderança'],
                'hit_die': 10
            },
            {
                'id': 'archer',
                'name': 'Arqueiro',
                'description': 'Preciso e mortal à distância, guardião das florestas.',
                'emoji': '🏹',
                'icon_name': 'target',
                'primary_attribute': 'dexterity',
                'starting_skills': ['Tiro Certeiro', 'Rastreamento', 'Sobrevivência'],
                'hit_die': 8
            },
            {
                'id': 'wizard',
                'name': 'Mago',
                'description': 'Estudioso das artes arcanas, manipula as forças místicas.',
                'emoji': '🧙‍♂️',
                'icon_name': 'sparkles',
                'primary_attribute': 'intelligence',
                'starting_skills': ['Magia Elemental', 'Conhecimento Arcano', 'Meditação'],
                'hit_die': 4
            },
            {
                'id': 'rogue',
                'name': 'Ladino',
                'description': 'Ágil e astuto, mestre das sombras e da infiltração.',
                'emoji': '🗡️',
                'icon_name': 'eye-off',
                'primary_attribute': 'dexterity',
                'starting_skills': ['Furtividade', 'Desarmar Armadilhas', 'Persuasão'],
                'hit_die': 6
            },
            {
                'id': 'cleric',
                'name': 'Clérigo',
                'description': 'Servo divino que cura feridas e protege contra o mal.',
                'emoji': '✨',
                'icon_name': 'heart',
                'primary_attribute': 'wisdom',
                'starting_skills': ['Cura Divina', 'Proteção', 'Conhecimento Religioso'],
                'hit_die': 8
            },
            {
                'id': 'paladin',
                'name': 'Paladino',
                'description': 'Guerreiro sagrado que combina força e magia divina.',
                'emoji': '🛡️',
                'icon_name': 'shield',
                'primary_attribute': 'charisma',
                'starting_skills': ['Combate Sagrado', 'Cura Menor', 'Detectar Mal'],
                'hit_die': 10
            },
            {
                'id': 'bard',
                'name': 'Bardo',
                'description': 'Contador de histórias que inspira aliados com música e magia.',
                'emoji': '🎵',
                'icon_name': 'music',
                'primary_attribute': 'charisma',
                'starting_skills': ['Inspiração', 'Conhecimento', 'Diplomacia'],
                'hit_die': 6
            },
            {
                'id': 'barbarian',
                'name': 'Bárbaro',
                'description': 'Selvagem feroz que entra em fúria na batalha.',
                'emoji': '💪',
                'icon_name': 'zap',
                'primary_attribute': 'strength',
                'starting_skills': ['Fúria', 'Sobrevivência', 'Intimidação'],
                'hit_die': 12
            },
            {
                'id': 'druid',
                'name': 'Druida',
                'description': 'Guardião da natureza que se transforma em animais.',
                'emoji': '🌿',
                'icon_name': 'leaf',
                'primary_attribute': 'wisdom',
                'starting_skills': ['Transformação', 'Magia Natural', 'Comunicação Animal'],
                'hit_die': 8
            },
            {
                'id': 'sorcerer',
                'name': 'Feiticeiro',
                'description': 'Nascido com poder mágico inato, molda a realidade.',
                'emoji': '⚡',
                'icon_name': 'bolt',
                'primary_attribute': 'charisma',
                'starting_skills': ['Magia Selvagem', 'Metamagia', 'Resistência Mágica'],
                'hit_die': 4
            },
            {
                'id': 'monk',
                'name': 'Monge',
                'description': 'Mestre das artes marciais e da disciplina interior.',
                'emoji': '🥋',
                'icon_name': 'hand',
                'primary_attribute': 'wisdom',
                'starting_skills': ['Artes Marciais', 'Meditação', 'Velocidade'],
                'hit_die': 8
            }
        ]
        
        for class_data in classes_data:
            char_class, created = CharacterClass.objects.get_or_create(
                id=class_data['id'],
                defaults=class_data
            )
            if created:
                self.stdout.write(f'⚔️ Classe criada: {char_class.name}')
