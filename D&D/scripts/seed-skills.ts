import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Populando habilidades no banco de dados...')

  // Habilidades de Classe Principal - Combate
  const combatSkills = [
    {
      id: 'guerreiro_basico',
      nome: 'Combate com Armas',
      descricao: 'Maestria no uso de armas corpo a corpo e à distância',
      emoji: '⚔️',
      categoria: 'combat',
      atributo_base: 'strength',
      tipo: 'primary_class'
    },
    {
      id: 'defesa_escudo',
      nome: 'Defesa com Escudo',
      descricao: 'Habilidade para usar escudos efetivamente em combate',
      emoji: '🛡️',
      categoria: 'combat',
      atributo_base: 'constitution',
      tipo: 'primary_class'
    },
    {
      id: 'berserker',
      nome: 'Fúria Berserker',
      descricao: 'Capacidade de entrar em fúria aumentando força e resistência',
      emoji: '😤',
      categoria: 'combat',
      atributo_base: 'strength',
      tipo: 'primary_class'
    }
  ]

  // Habilidades de Classe Principal - Magia
  const magicSkills = [
    {
      id: 'magia_elemental',
      nome: 'Magia Elemental',
      descricao: 'Controle dos elementos: fogo, água, terra e ar',
      emoji: '🔥',
      categoria: 'magic',
      atributo_base: 'intelligence',
      tipo: 'primary_class'
    },
    {
      id: 'magia_arcana',
      nome: 'Magia Arcana',
      descricao: 'Conhecimento e uso de magias arcanas complexas',
      emoji: '🧙',
      categoria: 'magic',
      atributo_base: 'intelligence',
      tipo: 'primary_class'
    },
    {
      id: 'cura_divina',
      nome: 'Cura Divina',
      descricao: 'Habilidade de curar ferimentos através de magia divina',
      emoji: '✨',
      categoria: 'magic',
      atributo_base: 'wisdom',
      tipo: 'primary_class'
    }
  ]

  // Habilidades de Classe Principal - Furtividade
  const stealthSkills = [
    {
      id: 'furtividade',
      nome: 'Movimentação Silenciosa',
      descricao: 'Capacidade de se mover sem ser detectado',
      emoji: '🥷',
      categoria: 'stealth',
      atributo_base: 'dexterity',
      tipo: 'primary_class'
    },
    {
      id: 'ataque_surpresa',
      nome: 'Ataque Surpresa',
      descricao: 'Habilidade para atacar pelas costas causando dano extra',
      emoji: '🗡️',
      categoria: 'stealth',
      atributo_base: 'dexterity',
      tipo: 'primary_class'
    },
    {
      id: 'desarmar_armadilhas',
      nome: 'Desarmar Armadilhas',
      descricao: 'Perícia em detectar e desarmar armadilhas',
      emoji: '🔓',
      categoria: 'stealth',
      atributo_base: 'dexterity',
      tipo: 'primary_class'
    }
  ]

  // Habilidades Complementares - Universais
  const complementarySkills = [
    {
      id: 'lideranca',
      nome: 'Liderança',
      descricao: 'Capacidade de inspirar e comandar aliados',
      emoji: '👑',
      categoria: 'social',
      atributo_base: 'charisma',
      tipo: 'complementary'
    },
    {
      id: 'diplomatia',
      nome: 'Diplomacia',
      descricao: 'Habilidade para negociar e resolver conflitos pacificamente',
      emoji: '🤝',
      categoria: 'social',
      atributo_base: 'charisma',
      tipo: 'complementary'
    },
    {
      id: 'sobrevivencia',
      nome: 'Sobrevivência',
      descricao: 'Conhecimento sobre como sobreviver na natureza',
      emoji: '🏕️',
      categoria: 'survival',
      atributo_base: 'wisdom',
      tipo: 'complementary'
    },
    {
      id: 'medicina',
      nome: 'Medicina',
      descricao: 'Conhecimento em primeiros socorros e tratamento médico',
      emoji: '🏥',
      categoria: 'healing',
      atributo_base: 'wisdom',
      tipo: 'complementary'
    },
    {
      id: 'forjar_itens',
      nome: 'Forjar Itens',
      descricao: 'Habilidade para criar e reparar equipamentos',
      emoji: '🔨',
      categoria: 'crafting',
      atributo_base: 'strength',
      tipo: 'complementary'
    },
    {
      id: 'alquimia',
      nome: 'Alquimia',
      descricao: 'Conhecimento em criação de poções e elixires',
      emoji: '⚗️',
      categoria: 'crafting',
      atributo_base: 'intelligence',
      tipo: 'complementary'
    },
    {
      id: 'performance',
      nome: 'Performance',
      descricao: 'Habilidade artística em música, dança ou teatro',
      emoji: '🎭',
      categoria: 'social',
      atributo_base: 'charisma',
      tipo: 'complementary'
    },
    {
      id: 'investigacao',
      nome: 'Investigação',
      descricao: 'Capacidade de encontrar pistas e resolver mistérios',
      emoji: '🔍',
      categoria: 'mental',
      atributo_base: 'intelligence',
      tipo: 'complementary'
    },
    {
      id: 'atletismo',
      nome: 'Atletismo',
      descricao: 'Condicionamento físico e habilidades atléticas',
      emoji: '🏃',
      categoria: 'physical',
      atributo_base: 'strength',
      tipo: 'complementary'
    },
    {
      id: 'acrobacia',
      nome: 'Acrobacia',
      descricao: 'Agilidade e flexibilidade corporal',
      emoji: '🤸',
      categoria: 'physical',
      atributo_base: 'dexterity',
      tipo: 'complementary'
    }
  ]

  // Habilidades Universais - Disponíveis para todos
  const universalSkills = [
    {
      id: 'percepcao',
      nome: 'Percepção',
      descricao: 'Capacidade de notar detalhes e perigos ao redor',
      emoji: '👁️',
      categoria: 'mental',
      atributo_base: 'wisdom',
      tipo: 'universal'
    },
    {
      id: 'intuicao',
      nome: 'Intuição',
      descricao: 'Sexto sentido para detectar mentiras e intenções',
      emoji: '🔮',
      categoria: 'mental',
      atributo_base: 'wisdom',
      tipo: 'universal'
    },
    {
      id: 'persuasao',
      nome: 'Persuasão',
      descricao: 'Capacidade de convencer outros através de argumentos',
      emoji: '💬',
      categoria: 'social',
      atributo_base: 'charisma',
      tipo: 'universal'
    }
  ]

  const allSkills = [
    ...combatSkills,
    ...magicSkills,
    ...stealthSkills,
    ...complementarySkills,
    ...universalSkills
  ]

  // Inserir habilidades
  for (const skill of allSkills) {
    await prisma.skill.upsert({
      where: { id: skill.id },
      update: skill,
      create: skill,
    })
  }

  console.log(`✅ ${allSkills.length} habilidades criadas/atualizadas!`)

  // Verificar se existe algum personagem para adicionar habilidades de exemplo
  const characters = await prisma.character.findMany({
    take: 1
  })

  if (characters.length > 0) {
    const character = characters[0]
    
    // Adicionar algumas habilidades de exemplo com diferentes níveis de maestria
    const exampleSkills = [
      { skillId: 'guerreiro_basico', maestria: 75 },
      { skillId: 'magia_elemental', maestria: 45 },
      { skillId: 'lideranca', maestria: 60 },
      { skillId: 'sobrevivencia', maestria: 30 },
      { skillId: 'percepcao', maestria: 55 }
    ]

    for (const skillData of exampleSkills) {
      await prisma.characterSkill.upsert({
        where: {
          characterId_skillId: {
            characterId: character.id,
            skillId: skillData.skillId
          }
        },
        update: {
          maestria: skillData.maestria
        },
        create: {
          characterId: character.id,
          skillId: skillData.skillId,
          maestria: skillData.maestria,
          experiencia: skillData.maestria * 10
        }
      })
    }

    console.log(`✅ Habilidades de exemplo adicionadas ao personagem ${character.nome}!`)
  }

  console.log('🎉 Seed de habilidades concluído!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
