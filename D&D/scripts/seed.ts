import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏔️ Populando banco de dados com dados do Middle Earth RPG...');

  // Criar raças
  const races = [
    {
      id: 'humano',
      nome: 'Humano',
      descricao: 'Versáteis e ambiciosos, os humanos se adaptam a qualquer situação.',
      emoji: '👨‍🦲',
      habilidades_especiais: JSON.stringify(['Versatilidade', 'Adaptabilidade', 'Liderança Natural']),
      altura_media_cm: 175,
      peso_medio_kg: 70,
      expectativa_vida: 80,
      bonus_constituicao: 1,
      bonus_inteligencia: 1,
      bonus_carisma: 1
    },
    {
      id: 'elfo',
      nome: 'Elfo',
      descricao: 'Seres imortais de grande sabedoria e graça, mestres da magia.',
      emoji: '🧝‍♂️',
      habilidades_especiais: JSON.stringify(['Imortalidade', 'Visão Noturna', 'Resistência à Magia']),
      altura_media_cm: 180,
      peso_medio_kg: 65,
      expectativa_vida: 10000,
      bonus_destreza: 2,
      bonus_constituicao: -1,
      bonus_inteligencia: 1,
      bonus_sabedoria: 1,
      bonus_carisma: 1
    },
    {
      id: 'anao',
      nome: 'Anão',
      descricao: 'Guerreiros robustos das montanhas, mestres da forja e do martelo.',
      emoji: '🧔',
      habilidades_especiais: JSON.stringify(['Resistência', 'Conhecimento de Pedras', 'Maestria em Forja']),
      altura_media_cm: 140,
      peso_medio_kg: 80,
      expectativa_vida: 300,
      bonus_forca: 1,
      bonus_constituicao: 2,
      bonus_sabedoria: 1,
      bonus_carisma: -1
    },
    {
      id: 'hobbit',
      nome: 'Hobbit',
      descricao: 'Pequenos mas corajosos, amantes da paz e das aventuras inesperadas.',
      emoji: '🏠',
      habilidades_especiais: JSON.stringify(['Pés Peludos Silenciosos', 'Sorte', 'Resistência ao Medo']),
      altura_media_cm: 100,
      peso_medio_kg: 35,
      expectativa_vida: 120,
      bonus_forca: -1,
      bonus_destreza: 2,
      bonus_constituicao: 1,
      bonus_sabedoria: 1,
      bonus_carisma: 1
    },
    {
      id: 'orc',
      nome: 'Orc',
      descricao: 'Guerreiros ferozes corrompidos pela escuridão, mas capazes de redenção.',
      emoji: '👹',
      habilidades_especiais: JSON.stringify(['Fúria de Batalha', 'Visão Noturna', 'Resistência à Dor']),
      altura_media_cm: 190,
      peso_medio_kg: 90,
      expectativa_vida: 60,
      bonus_forca: 2,
      bonus_destreza: 1,
      bonus_constituicao: 1,
      bonus_inteligencia: -1,
      bonus_sabedoria: -1,
      bonus_carisma: -2
    }
  ];

  for (const race of races) {
    await prisma.race.upsert({
      where: { id: race.id },
      update: race,
      create: race,
    });
    console.log(`✨ Raça criada: ${race.nome}`);
  }

  // Criar classes
  const classes = [
    {
      id: 'guerreiro',
      nome: 'Guerreiro',
      descricao: 'Mestre das armas e da batalha, protege os inocentes.',
      emoji: '⚔️',
      icone_nome: 'sword',
      atributo_principal: 'forca',
      dado_vida: 10,
      habilidades_iniciais: JSON.stringify(['Combate Corpo a Corpo', 'Resistência', 'Liderança']),
      tipo_armadura: 'Pesada',
      armas_permitidas: JSON.stringify(['Espadas', 'Machados', 'Martelos', 'Lanças']),
    },
    {
      id: 'arqueiro',
      nome: 'Arqueiro',
      descricao: 'Preciso e mortal à distância, guardião das florestas.',
      emoji: '🏹',
      icone_nome: 'target',
      atributo_principal: 'destreza',
      dado_vida: 8,
      habilidades_iniciais: JSON.stringify(['Tiro Certeiro', 'Rastreamento', 'Sobrevivência']),
      tipo_armadura: 'Leve',
      armas_permitidas: JSON.stringify(['Arcos', 'Bestas', 'Adagas']),
    },
    {
      id: 'mago',
      nome: 'Mago',
      descricao: 'Estudioso das artes arcanas, manipula as forças místicas.',
      emoji: '🧙‍♂️',
      icone_nome: 'sparkles',
      atributo_principal: 'inteligencia',
      dado_vida: 4,
      habilidades_iniciais: JSON.stringify(['Magia Elemental', 'Conhecimento Arcano', 'Meditação']),
      tipo_armadura: 'Nenhuma',
      armas_permitidas: JSON.stringify(['Cajados', 'Varinhas', 'Adagas']),
      escolas_magia: JSON.stringify(['Evocação', 'Transmutação', 'Ilusão']),
    },
    {
      id: 'ladino',
      nome: 'Ladino',
      descricao: 'Ágil e astuto, mestre das sombras e da infiltração.',
      emoji: '🗡️',
      icone_nome: 'eye-off',
      atributo_principal: 'destreza',
      dado_vida: 6,
      habilidades_iniciais: JSON.stringify(['Furtividade', 'Desarmar Armadilhas', 'Persuasão']),
      tipo_armadura: 'Leve',
      armas_permitidas: JSON.stringify(['Adagas', 'Espadas Curtas', 'Arcos']),
    },
    {
      id: 'clerigo',
      nome: 'Clérigo',
      descricao: 'Servo divino que cura feridas e protege contra o mal.',
      emoji: '✨',
      icone_nome: 'heart',
      atributo_principal: 'sabedoria',
      dado_vida: 8,
      habilidades_iniciais: JSON.stringify(['Cura Divina', 'Proteção', 'Conhecimento Religioso']),
      tipo_armadura: 'Média',
      armas_permitidas: JSON.stringify(['Martelos', 'Maças', 'Cajados']),
      escolas_magia: JSON.stringify(['Cura', 'Proteção', 'Luz']),
    }
  ];

  for (const characterClass of classes) {
    await prisma.characterClass.upsert({
      where: { id: characterClass.id },
      update: characterClass,
      create: characterClass,
    });
    console.log(`⚔️ Classe criada: ${characterClass.nome}`);
  }

  console.log('✅ Banco de dados populado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao popular banco:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
