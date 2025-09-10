import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Seed Races
  const races = [
    {
      id: 'human',
      nome: 'Humano',
      descricao: 'Versáteis e adaptáveis, os humanos são a raça mais comum.',
      emoji: '👤',
      altura_media_cm: 175,
      peso_medio_kg: 70,
      expectativa_vida: 80,
      habilidades_especiais: JSON.stringify(['Versatilidade', 'Determinação']),
      bonus_forca: 1,
      bonus_destreza: 1,
      bonus_constituicao: 1,
      bonus_inteligencia: 1,
      bonus_sabedoria: 1,
      bonus_carisma: 1
    },
    {
      id: 'elf',
      nome: 'Elfo',
      descricao: 'Graciosos e mágicos, com conexão profunda com a natureza.',
      emoji: '🧝',
      altura_media_cm: 180,
      peso_medio_kg: 65,
      expectativa_vida: 700,
      habilidades_especiais: JSON.stringify(['Visão no Escuro', 'Resistência a Encantamentos']),
      bonus_forca: 0,
      bonus_destreza: 2,
      bonus_constituicao: 0,
      bonus_inteligencia: 1,
      bonus_sabedoria: 0,
      bonus_carisma: 0
    },
    {
      id: 'dwarf',
      nome: 'Anão',
      descricao: 'Resistentes e habilidosos, mestres da forja e da pedra.',
      emoji: '🧔',
      altura_media_cm: 140,
      peso_medio_kg: 80,
      expectativa_vida: 350,
      habilidades_especiais: JSON.stringify(['Resistência a Venenos', 'Visão no Escuro']),
      bonus_forca: 0,
      bonus_destreza: 0,
      bonus_constituicao: 2,
      bonus_inteligencia: 0,
      bonus_sabedoria: 1,
      bonus_carisma: 0
    }
  ]

  for (const race of races) {
    await prisma.race.upsert({
      where: { id: race.id },
      update: {},
      create: race
    })
  }

  // Seed Classes
  const classes = [
    {
      id: 'warrior',
      nome: 'Guerreiro',
      descricao: 'Mestres do combate corpo a corpo e táticas de guerra.',
      emoji: '⚔️',
      icone_nome: 'sword',
      dado_vida: 10,
      atributo_principal: 'Força',
      tipo_armadura: JSON.stringify(['Todas as Armaduras', 'Escudos']),
      armas_permitidas: JSON.stringify(['Armas Simples', 'Armas Marciais']),
      habilidades_iniciais: JSON.stringify(['Atletismo', 'Intimidação'])
    },
    {
      id: 'mage',
      nome: 'Mago',
      descricao: 'Estudiosos da magia arcana e manipuladores das forças místicas.',
      emoji: '🧙',
      icone_nome: 'wand2',
      dado_vida: 6,
      atributo_principal: 'Inteligência',
      tipo_armadura: null,
      armas_permitidas: JSON.stringify(['Adagas', 'Dardos', 'Fundas', 'Bordões', 'Bestas Leves']),
      escolas_magia: JSON.stringify(['Evocação', 'Conjuração', 'Transmutação']),
      habilidades_iniciais: JSON.stringify(['Arcanismo', 'História'])
    },
    {
      id: 'rogue',
      nome: 'Ladino',
      descricao: 'Especialistas em furtividade, desarmar armadilhas e ataques precisos.',
      emoji: '🗡️',
      icone_nome: 'target',
      dado_vida: 8,
      atributo_principal: 'Destreza',
      tipo_armadura: JSON.stringify(['Armaduras Leves']),
      armas_permitidas: JSON.stringify(['Armas Simples', 'Bestas de Mão', 'Espadas Longas', 'Rapieiras', 'Espadas Curtas']),
      habilidades_iniciais: JSON.stringify(['Furtividade', 'Prestidigitação'])
    }
  ]

  for (const characterClass of classes) {
    await prisma.characterClass.upsert({
      where: { id: characterClass.id },
      update: {},
      create: characterClass
    })
  }

  console.log('✅ Seed concluído com sucesso!')
  console.log(`📊 Criadas ${races.length} raças e ${classes.length} classes`)
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
