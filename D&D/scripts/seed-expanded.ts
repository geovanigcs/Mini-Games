import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Populando dados expandidos do jogo...')

  // Limpar dados existentes se necessário
  console.log('🧹 Limpando dados antigos...')
  await prisma.characterClass.deleteMany()
  await prisma.race.deleteMany()

  // Criar Raças
  console.log('🏛️ Criando raças...')
  const races = [
    {
      id: 'humano',
      nome: 'Humano',
      descricao: 'Versáteis e ambiciosos, os humanos se adaptam rapidamente a qualquer situação.',
      emoji: '👤',
      habilidades_especiais: JSON.stringify(['Versatilidade', 'Determinação']),
      altura_media_cm: 175,
      peso_medio_kg: 70,
      expectativa_vida: 80,
      bonus_forca: 1,
      bonus_destreza: 1,
      bonus_constituicao: 1,
      bonus_inteligencia: 1,
      bonus_sabedoria: 1,
      bonus_carisma: 1
    },
    {
      id: 'elfo',
      nome: 'Elfo',
      descricao: 'Graciosos e longevos, dominam a magia e têm conexão profunda com a natureza.',
      emoji: '🧝',
      habilidades_especiais: JSON.stringify(['Visão no Escuro', 'Resistência a Encantos']),
      altura_media_cm: 170,
      peso_medio_kg: 55,
      expectativa_vida: 700,
      bonus_forca: 0,
      bonus_destreza: 2,
      bonus_constituicao: 0,
      bonus_inteligencia: 1,
      bonus_sabedoria: 1,
      bonus_carisma: 1
    },
    {
      id: 'anao',
      nome: 'Anão',
      descricao: 'Robustos e determinados, são mestres na forja e resistentes a magias.',
      emoji: '🧔',
      habilidades_especiais: JSON.stringify(['Resistência a Veneno', 'Conhecimento de Pedra']),
      altura_media_cm: 140,
      peso_medio_kg: 80,
      expectativa_vida: 350,
      bonus_forca: 1,
      bonus_destreza: 0,
      bonus_constituicao: 2,
      bonus_inteligencia: 0,
      bonus_sabedoria: 1,
      bonus_carisma: 0
    },
    {
      id: 'halfling',
      nome: 'Halfling',
      descricao: 'Pequenos mas corajosos, são ágeis e têm sorte extraordinária.',
      emoji: '🍀',
      habilidades_especiais: JSON.stringify(['Sorte dos Halflings', 'Agilidade']),
      altura_media_cm: 90,
      peso_medio_kg: 30,
      expectativa_vida: 150,
      bonus_forca: 0,
      bonus_destreza: 2,
      bonus_constituicao: 1,
      bonus_inteligencia: 0,
      bonus_sabedoria: 0,
      bonus_carisma: 1
    },
    {
      id: 'orc',
      nome: 'Orc',
      descricao: 'Guerreiros ferozes com força brutal e resistência natural.',
      emoji: '👹',
      habilidades_especiais: JSON.stringify(['Fúria Sanguinária', 'Resistência']),
      altura_media_cm: 190,
      peso_medio_kg: 95,
      expectativa_vida: 50,
      bonus_forca: 2,
      bonus_destreza: 0,
      bonus_constituicao: 1,
      bonus_inteligencia: -1,
      bonus_sabedoria: 0,
      bonus_carisma: -1
    }
  ]

  for (const race of races) {
    await prisma.race.upsert({
      where: { id: race.id },
      update: race,
      create: race,
    })
  }

  // Criar Classes (incluindo subclasses como profissões)
  console.log('⚔️ Criando classes e profissões...')
  const characterClasses = [
    // Classes de Combate
    {
      id: 'guerreiro',
      nome: 'Guerreiro',
      descricao: 'Mestre em combate corpo a corpo, especialista em armas e armaduras.',
      emoji: '⚔️',
      icone_nome: 'sword',
      atributo_principal: 'Força',
      dado_vida: 10,
      habilidades_iniciais: JSON.stringify(['Combate com Armas', 'Uso de Armaduras']),
      tipo_armadura: 'Todas',
      armas_permitidas: 'Todas',
      escolas_magia: null
    },
    {
      id: 'paladino',
      nome: 'Paladino',
      descricao: 'Guerreiro sagrado que combina força física com poder divino.',
      emoji: '🛡️',
      icone_nome: 'shield',
      atributo_principal: 'Força',
      dado_vida: 10,
      habilidades_iniciais: JSON.stringify(['Combate Sagrado', 'Cura Menor']),
      tipo_armadura: 'Todas',
      armas_permitidas: 'Corpo a Corpo',
      escolas_magia: 'Divina'
    },
    {
      id: 'barbaro',
      nome: 'Bárbaro',
      descricao: 'Guerreiro selvagem movido por fúria primitiva e instintos.',
      emoji: '🪓',
      icone_nome: 'axe',
      atributo_principal: 'Força',
      dado_vida: 12,
      habilidades_iniciais: JSON.stringify(['Fúria', 'Sobrevivência']),
      tipo_armadura: 'Leve/Média',
      armas_permitidas: 'Corpo a Corpo',
      escolas_magia: null
    },

    // Classes Mágicas
    {
      id: 'mago',
      nome: 'Mago',
      descricao: 'Estudioso das artes arcanas, manipula a realidade através de magias.',
      emoji: '🧙',
      icone_nome: 'wand',
      atributo_principal: 'Inteligência',
      dado_vida: 6,
      habilidades_iniciais: JSON.stringify(['Magia Arcana', 'Conhecimento Místico']),
      tipo_armadura: 'Nenhuma',
      armas_permitidas: 'Simples',
      escolas_magia: 'Arcana'
    },
    {
      id: 'clerigo',
      nome: 'Clérigo',
      descricao: 'Servo divino que canaliza o poder dos deuses para curar e proteger.',
      emoji: '⛪',
      icone_nome: 'cross',
      atributo_principal: 'Sabedoria',
      dado_vida: 8,
      habilidades_iniciais: JSON.stringify(['Magia Divina', 'Canalizar Divindade']),
      tipo_armadura: 'Leve/Média',
      armas_permitidas: 'Simples',
      escolas_magia: 'Divina'
    },
    {
      id: 'feiticeiro',
      nome: 'Feiticeiro',
      descricao: 'Mago nato com poder mágico inato, manipula energia bruta.',
      emoji: '✨',
      icone_nome: 'sparkles',
      atributo_principal: 'Carisma',
      dado_vida: 6,
      habilidades_iniciais: JSON.stringify(['Magia Inata', 'Metamagia']),
      tipo_armadura: 'Nenhuma',
      armas_permitidas: 'Simples',
      escolas_magia: 'Arcana'
    },

    // Classes Furtivas
    {
      id: 'ladino',
      nome: 'Ladino',
      descricao: 'Especialista em furtividade, trabalha nas sombras com precisão letal.',
      emoji: '🗡️',
      icone_nome: 'dagger',
      atributo_principal: 'Destreza',
      dado_vida: 8,
      habilidades_iniciais: JSON.stringify(['Furtividade', 'Ataque Surpresa']),
      tipo_armadura: 'Leve',
      armas_permitidas: 'Finesse/Distância',
      escolas_magia: null
    },
    {
      id: 'assassino',
      nome: 'Assassino',
      descricao: 'Matador profissional especializado em eliminação silenciosa.',
      emoji: '🥷',
      icone_nome: 'mask',
      atributo_principal: 'Destreza',
      dado_vida: 8,
      habilidades_iniciais: JSON.stringify(['Morte Silenciosa', 'Venenos']),
      tipo_armadura: 'Leve',
      armas_permitidas: 'Finesse',
      escolas_magia: null
    },

    // Classes de Suporte
    {
      id: 'bardo',
      nome: 'Bardo',
      descricao: 'Artista versátil que usa música e palavras como armas e cura.',
      emoji: '🎭',
      icone_nome: 'music',
      atributo_principal: 'Carisma',
      dado_vida: 8,
      habilidades_iniciais: JSON.stringify(['Inspiração', 'Versatilidade']),
      tipo_armadura: 'Leve',
      armas_permitidas: 'Simples',
      escolas_magia: 'Arcana'
    },
    {
      id: 'druida',
      nome: 'Druida',
      descricao: 'Guardião da natureza com poder de transformação e magia natural.',
      emoji: '🌿',
      icone_nome: 'leaf',
      atributo_principal: 'Sabedoria',
      dado_vida: 8,
      habilidades_iniciais: JSON.stringify(['Forma Selvagem', 'Magia Natural']),
      tipo_armadura: 'Natural',
      armas_permitidas: 'Naturais',
      escolas_magia: 'Natural'
    },

    // Profissões/Classes Sociais
    {
      id: 'ferreiro',
      nome: 'Ferreiro',
      descricao: 'Artesão mestre na forja de armas e armaduras.',
      emoji: '🔨',
      icone_nome: 'hammer',
      atributo_principal: 'Força',
      dado_vida: 8,
      habilidades_iniciais: JSON.stringify(['Forjar Itens', 'Conhecimento de Metais']),
      tipo_armadura: 'Média',
      armas_permitidas: 'Martelos/Maças',
      escolas_magia: null
    },
    {
      id: 'camponês',
      nome: 'Camponês',
      descricao: 'Trabalhador rural com conhecimento da terra e resistência.',
      emoji: '🌾',
      icone_nome: 'wheat',
      atributo_principal: 'Constituição',
      dado_vida: 8,
      habilidades_iniciais: JSON.stringify(['Agricultura', 'Resistência']),
      tipo_armadura: 'Leve',
      armas_permitidas: 'Ferramentas/Simples',
      escolas_magia: null
    },
    {
      id: 'escravo',
      nome: 'Ex-Escravo',
      descricao: 'Libertado da servidão, determinado a forjar seu próprio destino.',
      emoji: '⛓️',
      icone_nome: 'chain',
      atributo_principal: 'Constituição',
      dado_vida: 6,
      habilidades_iniciais: JSON.stringify(['Resistência Mental', 'Determinação']),
      tipo_armadura: 'Leve',
      armas_permitidas: 'Improvisadas/Simples',
      escolas_magia: null
    },
    {
      id: 'mercador',
      nome: 'Mercador',
      descricao: 'Comerciante hábil em negociação e conhecimento de valores.',
      emoji: '💰',
      icone_nome: 'coins',
      atributo_principal: 'Carisma',
      dado_vida: 6,
      habilidades_iniciais: JSON.stringify(['Negociação', 'Avaliação']),
      tipo_armadura: 'Leve',
      armas_permitidas: 'Simples',
      escolas_magia: null
    },
    {
      id: 'nobre',
      nome: 'Nobre',
      descricao: 'Aristocrata educado com influência política e recursos.',
      emoji: '👑',
      icone_nome: 'crown',
      atributo_principal: 'Carisma',
      dado_vida: 6,
      habilidades_iniciais: JSON.stringify(['Liderança', 'Etiqueta']),
      tipo_armadura: 'Leve/Média',
      armas_permitidas: 'Refinadas',
      escolas_magia: null
    },
    {
      id: 'guarda',
      nome: 'Guarda',
      descricao: 'Soldado profissional treinado para manter a ordem.',
      emoji: '🛡️',
      icone_nome: 'shield-check',
      atributo_principal: 'Força',
      dado_vida: 8,
      habilidades_iniciais: JSON.stringify(['Vigilância', 'Detenção']),
      tipo_armadura: 'Média',
      armas_permitidas: 'Militares',
      escolas_magia: null
    },
    {
      id: 'explorador',
      nome: 'Explorador',
      descricao: 'Aventureiro experiente em terrenos selvagens e perigosos.',
      emoji: '🗺️',
      icone_nome: 'map',
      atributo_principal: 'Sabedoria',
      dado_vida: 10,
      habilidades_iniciais: JSON.stringify(['Rastreamento', 'Sobrevivência']),
      tipo_armadura: 'Leve/Média',
      armas_permitidas: 'Distância/Corpo a Corpo',
      escolas_magia: null
    },
    {
      id: 'curandeiro',
      nome: 'Curandeiro',
      descricao: 'Praticante de artes de cura através de ervas e conhecimento médico.',
      emoji: '🏥',
      icone_nome: 'medical',
      atributo_principal: 'Sabedoria',
      dado_vida: 6,
      habilidades_iniciais: JSON.stringify(['Medicina', 'Herbologia']),
      tipo_armadura: 'Leve',
      armas_permitidas: 'Não-letais',
      escolas_magia: null
    }
  ]

  for (const characterClass of characterClasses) {
    await prisma.characterClass.upsert({
      where: { id: characterClass.id },
      update: characterClass,
      create: characterClass,
    })
  }

  console.log(`✅ ${races.length} raças criadas!`)
  console.log(`✅ ${characterClasses.length} classes/profissões criadas!`)
  console.log('🎉 Seed expandido concluído!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
