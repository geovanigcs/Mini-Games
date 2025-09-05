import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏔️ Populando banco de dados com dados completos do D&D dos Pirangueiros...');

  // Limpar dados existentes para recriar
  await prisma.character.deleteMany();
  await prisma.characterClass.deleteMany();
  await prisma.race.deleteMany();

  // Criar todas as raças da Terra Média
  const races = [
    // Raças Boas/Neutras Clássicas
    {
      id: 'hobbit',
      nome: 'Hobbit',
      descricao: 'Pequenos seres pacíficos da Comarca, conhecidos por seu amor pela natureza e vida simples.',
      emoji: '🌱',
      habilidades_especiais: JSON.stringify(['Pés Peludos', 'Sortudo', 'Corajoso', 'Resistência a Corrupção']),
      altura_media_cm: 100,
      peso_medio_kg: 30,
      expectativa_vida: 120,
      bonus_forca: 0,
      bonus_destreza: 2,
      bonus_constituicao: 1,
      bonus_inteligencia: 0,
      bonus_sabedoria: 2,
      bonus_carisma: 1
    },
    {
      id: 'elfo',
      nome: 'Elfo',
      descricao: 'Seres imortais e sábios, mestres da magia e arqueria.',
      emoji: '🧝‍♀️',
      habilidades_especiais: JSON.stringify(['Visão no Escuro', 'Resistência à Magia', 'Longevidade', 'Precisão Élfica']),
      altura_media_cm: 180,
      peso_medio_kg: 65,
      expectativa_vida: 10000,
      bonus_forca: 0,
      bonus_destreza: 2,
      bonus_constituicao: 0,
      bonus_inteligencia: 1,
      bonus_sabedoria: 2,
      bonus_carisma: 1
    },
    {
      id: 'meio_elfo',
      nome: 'Meio-Elfo',
      descricao: 'Descendentes de elfos e humanos, enfrentando dilemas de identidade entre dois mundos.',
      emoji: '🌟',
      habilidades_especiais: JSON.stringify(['Versatilidade', 'Visão no Escuro', 'Resistência Parcial à Magia']),
      altura_media_cm: 170,
      peso_medio_kg: 68,
      expectativa_vida: 200,
      bonus_forca: 1,
      bonus_destreza: 1,
      bonus_constituicao: 1,
      bonus_inteligencia: 1,
      bonus_sabedoria: 1,
      bonus_carisma: 2
    },
    {
      id: 'humano',
      nome: 'Humano',
      descricao: 'Versáteis e adaptáveis, a raça mais diversa da Terra Média.',
      emoji: '👤',
      habilidades_especiais: JSON.stringify(['Versatilidade', 'Ambição', 'Adaptabilidade', 'Determinação']),
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
      id: 'dunedain',
      nome: 'Dúnedain',
      descricao: 'Humanos de linhagem nobre, descendentes dos Reis de Númenor, com longevidade estendida.',
      emoji: '👑',
      habilidades_especiais: JSON.stringify(['Longevidade', 'Liderança', 'Rastreamento', 'Resistência']),
      altura_media_cm: 185,
      peso_medio_kg: 80,
      expectativa_vida: 150,
      bonus_forca: 2,
      bonus_destreza: 1,
      bonus_constituicao: 2,
      bonus_inteligencia: 1,
      bonus_sabedoria: 2,
      bonus_carisma: 2
    },
    {
      id: 'rohirrim',
      nome: 'Rohirrim',
      descricao: 'O povo de Rohan, mestres cavaleiros conhecidos por sua bravura e lealdade.',
      emoji: '🐎',
      habilidades_especiais: JSON.stringify(['Cavalgar', 'Coragem', 'Lealdade', 'Resistência']),
      altura_media_cm: 178,
      peso_medio_kg: 75,
      expectativa_vida: 85,
      bonus_forca: 2,
      bonus_destreza: 1,
      bonus_constituicao: 2,
      bonus_inteligencia: 0,
      bonus_sabedoria: 1,
      bonus_carisma: 1
    },
    {
      id: 'anao',
      nome: 'Anão',
      descricao: 'Guerreiros robustos e habilidosos artesãos das montanhas.',
      emoji: '⛏️',
      habilidades_especiais: JSON.stringify(['Resistência', 'Trabalho em Metal', 'Visão no Escuro', 'Resistência a Venenos']),
      altura_media_cm: 140,
      peso_medio_kg: 80,
      expectativa_vida: 350,
      bonus_forca: 2,
      bonus_destreza: 0,
      bonus_constituicao: 3,
      bonus_inteligencia: 0,
      bonus_sabedoria: 2,
      bonus_carisma: 0
    },
    {
      id: 'ent',
      nome: 'Ent',
      descricao: 'Pastores das árvores, protetores ancestrais das florestas.',
      emoji: '🌳',
      habilidades_especiais: JSON.stringify(['Comunicação com Plantas', 'Força Sobre-humana', 'Longevidade', 'Resistência a Fogo']),
      altura_media_cm: 350,
      peso_medio_kg: 500,
      expectativa_vida: 50000,
      bonus_forca: 4,
      bonus_destreza: -2,
      bonus_constituicao: 4,
      bonus_inteligencia: 1,
      bonus_sabedoria: 4,
      bonus_carisma: 0
    },
    
    // Raças Mágicas/Especiais
    {
      id: 'istari',
      nome: 'Istari (Mago)',
      descricao: 'Seres angelicais enviados para guiar as raças livres, com vastos poderes mágicos.',
      emoji: '🧙‍♂️',
      habilidades_especiais: JSON.stringify(['Magia Poderosa', 'Imortalidade', 'Sabedoria Ancestral', 'Resistência Mental']),
      altura_media_cm: 180,
      peso_medio_kg: 70,
      expectativa_vida: 999999,
      bonus_forca: 0,
      bonus_destreza: 1,
      bonus_constituicao: 2,
      bonus_inteligencia: 4,
      bonus_sabedoria: 4,
      bonus_carisma: 3
    },
    {
      id: 'maiar',
      nome: 'Maiar',
      descricao: 'Espíritos menores, servos dos Valar, com grande poder mágico.',
      emoji: '✨',
      habilidades_especiais: JSON.stringify(['Metamorfose', 'Magia Ancestral', 'Telepatia', 'Visão Verdadeira']),
      altura_media_cm: 175,
      peso_medio_kg: 60,
      expectativa_vida: 999999,
      bonus_forca: 1,
      bonus_destreza: 2,
      bonus_constituicao: 2,
      bonus_inteligencia: 3,
      bonus_sabedoria: 3,
      bonus_carisma: 4
    },
    
    // Raças "Malignas" jogáveis (anti-heróis)
    {
      id: 'orc_redimido',
      nome: 'Orc Redimido',
      descricao: 'Orc que rejeitou a escuridão e busca redenção através de atos heroicos.',
      emoji: '👹',
      habilidades_especiais: JSON.stringify(['Ferocidade Controlada', 'Visão no Escuro', 'Resistência à Dor', 'Força de Vontade']),
      altura_media_cm: 165,
      peso_medio_kg: 85,
      expectativa_vida: 60,
      bonus_forca: 3,
      bonus_destreza: 0,
      bonus_constituicao: 2,
      bonus_inteligencia: -1,
      bonus_sabedoria: 0,
      bonus_carisma: -1
    },
    {
      id: 'uruk_hai_livre',
      nome: 'Uruk-hai Livre',
      descricao: 'Uruk-hai que quebrou as correntes de Saruman e busca seu próprio destino.',
      emoji: '⚔️',
      habilidades_especiais: JSON.stringify(['Força Brutal', 'Resistência Solar', 'Disciplina', 'Intimidação']),
      altura_media_cm: 185,
      peso_medio_kg: 100,
      expectativa_vida: 80,
      bonus_forca: 4,
      bonus_destreza: 0,
      bonus_constituicao: 3,
      bonus_inteligencia: 0,
      bonus_sabedoria: -1,
      bonus_carisma: 0
    },
    {
      id: 'goblin_sabio',
      nome: 'Goblin Sábio',
      descricao: 'Goblin que desenvolveu inteligência superior e usa astúcia em vez de brutalidade.',
      emoji: '👺',
      habilidades_especiais: JSON.stringify(['Furtividade Superior', 'Agilidade', 'Visão no Escuro', 'Escalada Mestre']),
      altura_media_cm: 120,
      peso_medio_kg: 40,
      expectativa_vida: 50,
      bonus_forca: -1,
      bonus_destreza: 3,
      bonus_constituicao: 0,
      bonus_inteligencia: 2,
      bonus_sabedoria: 1,
      bonus_carisma: 0
    },
    {
      id: 'troll_inteligente',
      nome: 'Troll Inteligente',
      descricao: 'Troll raro que desenvolveu inteligência e usa força com sabedoria.',
      emoji: '🗿',
      habilidades_especiais: JSON.stringify(['Força Titânica', 'Regeneração', 'Resistência Mágica', 'Sabedoria Primitiva']),
      altura_media_cm: 300,
      peso_medio_kg: 400,
      expectativa_vida: 200,
      bonus_forca: 6,
      bonus_destreza: -2,
      bonus_constituicao: 4,
      bonus_inteligencia: -1,
      bonus_sabedoria: 1,
      bonus_carisma: -1
    },
    
    // Raças Especiais/Elementais
    {
      id: 'draconica',
      nome: 'Linhagem Dracônica',
      descricao: 'Descendentes distantes de dragões, com vestígios do poder ancestral.',
      emoji: '🐲',
      habilidades_especiais: JSON.stringify(['Sopro Elemental', 'Escamas Resistentes', 'Presença Majestosa', 'Conexão Dracônica']),
      altura_media_cm: 190,
      peso_medio_kg: 95,
      expectativa_vida: 300,
      bonus_forca: 2,
      bonus_destreza: 1,
      bonus_constituicao: 2,
      bonus_inteligencia: 1,
      bonus_sabedoria: 1,
      bonus_carisma: 3
    },
    {
      id: 'elemental',
      nome: 'Touched Elemental',
      descricao: 'Seres tocados pelos elementos primordiais: fogo, água, terra e ar.',
      emoji: '🌊',
      habilidades_especiais: JSON.stringify(['Afinidade Elemental', 'Resistência Elemental', 'Comunicação Natural', 'Magia Inata']),
      altura_media_cm: 175,
      peso_medio_kg: 70,
      expectativa_vida: 500,
      bonus_forca: 1,
      bonus_destreza: 2,
      bonus_constituicao: 2,
      bonus_inteligencia: 1,
      bonus_sabedoria: 3,
      bonus_carisma: 1
    },
    {
      id: 'barbaro_norte',
      nome: 'Bárbaro do Norte',
      descricao: 'Guerreiros nômades das terras selvagens, mestres da sobrevivência.',
      emoji: '🪓',
      habilidades_especiais: JSON.stringify(['Fúria Primitiva', 'Sobrevivência Extrema', 'Resistência ao Frio', 'Intimidação Natural']),
      altura_media_cm: 185,
      peso_medio_kg: 90,
      expectativa_vida: 70,
      bonus_forca: 3,
      bonus_destreza: 1,
      bonus_constituicao: 3,
      bonus_inteligencia: -1,
      bonus_sabedoria: 2,
      bonus_carisma: 0
    },
    {
      id: 'espectro_redimido',
      nome: 'Espectro Redimido',
      descricao: 'Antigo espírito que encontrou redenção e luta contra a escuridão.',
      emoji: '👻',
      habilidades_especiais: JSON.stringify(['Forma Etérea', 'Resistência Mágica', 'Visão Espiritual', 'Purificação']),
      altura_media_cm: 175,
      peso_medio_kg: 0,
      expectativa_vida: 999999,
      bonus_forca: -1,
      bonus_destreza: 3,
      bonus_constituicao: -2,
      bonus_inteligencia: 2,
      bonus_sabedoria: 4,
      bonus_carisma: 3
    },
    {
      id: 'ent_jovem',
      nome: 'Ent Jovem',
      descricao: 'Ent mais jovem e ágil, ainda aprendendo os caminhos da floresta.',
      emoji: '🌿',
      habilidades_especiais: JSON.stringify(['Comunicação com Plantas', 'Crescimento Acelerado', 'Resistência Natural', 'Força da Natureza']),
      altura_media_cm: 250,
      peso_medio_kg: 300,
      expectativa_vida: 50000,
      bonus_forca: 3,
      bonus_destreza: -1,
      bonus_constituicao: 3,
      bonus_inteligencia: 1,
      bonus_sabedoria: 3,
      bonus_carisma: 1
    }
  ];

  // Criar classes expandidas
  const classes = [
    // Classes de Combate
    {
      id: 'guerreiro',
      nome: 'Guerreiro',
      descricao: 'Mestre das armas e da batalha, protetor dos inocentes.',
      emoji: '⚔️',
      icone_nome: 'sword',
      atributo_principal: 'forca',
      dado_vida: 10,
      habilidades_iniciais: JSON.stringify(['Combate Corpo a Corpo', 'Resistência', 'Liderança', 'Táticas']),
      tipo_armadura: 'Pesada',
      armas_permitidas: JSON.stringify(['Espadas', 'Machados', 'Martelos', 'Lanças', 'Escudos'])
    },
    {
      id: 'paladino',
      nome: 'Paladino',
      descricao: 'Guerreiro sagrado que combina força marcial com poderes divinos.',
      emoji: '🛡️',
      icone_nome: 'shield',
      atributo_principal: 'carisma',
      dado_vida: 10,
      habilidades_iniciais: JSON.stringify(['Combate Sagrado', 'Cura Divina', 'Detectar Mal', 'Aura de Proteção']),
      tipo_armadura: 'Pesada',
      armas_permitidas: JSON.stringify(['Espadas Sagradas', 'Martelos', 'Lanças', 'Escudos Abençoados'])
    },
    {
      id: 'barbaro',
      nome: 'Bárbaro',
      descricao: 'Guerreiro selvagem que luta com fúria primitiva e instintos naturais.',
      emoji: '🪓',
      icone_nome: 'zap',
      atributo_principal: 'forca',
      dado_vida: 12,
      habilidades_iniciais: JSON.stringify(['Fúria', 'Sobrevivência', 'Intimidação', 'Resistência Primitiva']),
      tipo_armadura: 'Leve/Média',
      armas_permitidas: JSON.stringify(['Machados', 'Martelos', 'Clavas', 'Lanças'])
    },
    
    // Classes de Agilidade
    {
      id: 'arqueiro',
      nome: 'Arqueiro',
      descricao: 'Preciso e mortal à distância, guardião das florestas.',
      emoji: '🏹',
      icone_nome: 'target',
      atributo_principal: 'destreza',
      dado_vida: 8,
      habilidades_iniciais: JSON.stringify(['Tiro Certeiro', 'Rastreamento', 'Sobrevivência', 'Camuflagem']),
      tipo_armadura: 'Leve',
      armas_permitidas: JSON.stringify(['Arcos Longos', 'Bestas', 'Adagas', 'Espadas Curtas'])
    },
    {
      id: 'ladino',
      nome: 'Ladino',
      descricao: 'Ágil e astuto, mestre das sombras e da infiltração.',
      emoji: '🗡️',
      icone_nome: 'eye',
      atributo_principal: 'destreza',
      dado_vida: 6,
      habilidades_iniciais: JSON.stringify(['Furtividade', 'Desarmar Armadilhas', 'Persuasão', 'Ataque Furtivo']),
      tipo_armadura: 'Leve',
      armas_permitidas: JSON.stringify(['Adagas', 'Espadas Curtas', 'Arcos', 'Besta de Mão'])
    },
    {
      id: 'assassino',
      nome: 'Assassino',
      descricao: 'Especialista em eliminação silenciosa e combate nas sombras.',
      emoji: '🔪',
      icone_nome: 'eye',
      atributo_principal: 'destreza',
      dado_vida: 6,
      habilidades_iniciais: JSON.stringify(['Morte Silenciosa', 'Venenos', 'Disfarces', 'Furtividade Mestre']),
      tipo_armadura: 'Leve',
      armas_permitidas: JSON.stringify(['Adagas Envenenadas', 'Zarabatanas', 'Cordas', 'Dardos'])
    },
    
    // Classes Mágicas
    {
      id: 'mago',
      nome: 'Mago',
      descricao: 'Estudioso das artes arcanas, manipula as forças místicas do universo.',
      emoji: '🧙‍♂️',
      icone_nome: 'sparkles',
      atributo_principal: 'inteligencia',
      dado_vida: 4,
      habilidades_iniciais: JSON.stringify(['Magia Elemental', 'Conhecimento Arcano', 'Meditação', 'Ritual']),
      tipo_armadura: 'Nenhuma/Robes',
      armas_permitidas: JSON.stringify(['Cajados', 'Varinhas', 'Adagas', 'Orbes'])
    },
    {
      id: 'feiticeiro',
      nome: 'Feiticeiro',
      descricao: 'Possuidor de magia inata, canaliza poder através de sua força de vontade.',
      emoji: '🔮',
      icone_nome: 'sparkles',
      atributo_principal: 'carisma',
      dado_vida: 6,
      habilidades_iniciais: JSON.stringify(['Magia Inata', 'Metamagia', 'Presença Mágica', 'Intuição Arcana']),
      tipo_armadura: 'Leve/Robes',
      armas_permitidas: JSON.stringify(['Cajados', 'Varinhas', 'Adagas', 'Cristais Mágicos'])
    },
    {
      id: 'bruxo',
      nome: 'Bruxo',
      descricao: 'Fez um pacto com entidade poderosa em troca de poder mágico.',
      emoji: '🔥',
      icone_nome: 'sparkles',
      atributo_principal: 'carisma',
      dado_vida: 8,
      habilidades_iniciais: JSON.stringify(['Pacto Sombrio', 'Magia Proibida', 'Invocação', 'Resistência Mental']),
      tipo_armadura: 'Leve',
      armas_permitidas: JSON.stringify(['Cajados Malditos', 'Lâminas Pactuadas', 'Foices', 'Grimórios'])
    },
    
    // Classes de Suporte
    {
      id: 'clerigo',
      nome: 'Clérigo',
      descricao: 'Servo divino que cura feridas e protege contra as trevas.',
      emoji: '✨',
      icone_nome: 'heart',
      atributo_principal: 'sabedoria',
      dado_vida: 8,
      habilidades_iniciais: JSON.stringify(['Cura Divina', 'Expulsar Mortos-Vivos', 'Proteção', 'Benção']),
      tipo_armadura: 'Média/Pesada',
      armas_permitidas: JSON.stringify(['Martelos', 'Maças', 'Escudos', 'Símbolos Sagrados'])
    },
    {
      id: 'druida',
      nome: 'Druida',
      descricao: 'Guardião da natureza que canaliza o poder dos elementos e das criaturas.',
      emoji: '🍃',
      icone_nome: 'leaf',
      atributo_principal: 'sabedoria',
      dado_vida: 8,
      habilidades_iniciais: JSON.stringify(['Magia Natural', 'Forma Animal', 'Comunicação Animal', 'Cura Natural']),
      tipo_armadura: 'Leve/Natural',
      armas_permitidas: JSON.stringify(['Cajados', 'Cimitarras', 'Dardos', 'Escudos Naturais'])
    },
    {
      id: 'bardo',
      nome: 'Bardo',
      descricao: 'Artista e contador de histórias que usa música e palavras como magia.',
      emoji: '🎵',
      icone_nome: 'music',
      atributo_principal: 'carisma',
      dado_vida: 8,
      habilidades_iniciais: JSON.stringify(['Inspiração', 'Magia Bardica', 'Conhecimento', 'Persuasão']),
      tipo_armadura: 'Leve',
      armas_permitidas: JSON.stringify(['Espadas Curtas', 'Instrumentos', 'Adagas', 'Bestas Leves'])
    },
    
    // Classes Especializadas
    {
      id: 'ranger',
      nome: 'Ranger',
      descricao: 'Explorador das terras selvagens, protetor das fronteiras.',
      emoji: '🏹',
      icone_nome: 'target',
      atributo_principal: 'destreza',
      dado_vida: 10,
      habilidades_iniciais: JSON.stringify(['Rastreamento Mestre', 'Tiro Certeiro', 'Sobrevivência', 'Inimigo Favorito']),
      tipo_armadura: 'Leve/Média',
      armas_permitidas: JSON.stringify(['Arcos', 'Espadas', 'Machados', 'Lanças'])
    },
    {
      id: 'monge',
      nome: 'Monge',
      descricao: 'Mestre das artes marciais que canaliza energia interna.',
      emoji: '👊',
      icone_nome: 'hand',
      atributo_principal: 'sabedoria',
      dado_vida: 8,
      habilidades_iniciais: JSON.stringify(['Artes Marciais', 'Ki', 'Deflexão', 'Movimento Rápido']),
      tipo_armadura: 'Nenhuma',
      armas_permitidas: JSON.stringify(['Punhos', 'Cajados', 'Nunchakus', 'Shurikens'])
    },
    
    // Classes Híbridas Especiais
    {
      id: 'cavaleiro',
      nome: 'Cavaleiro',
      descricao: 'Nobre guerreiro montado, mestre da cavalgada e do código de honra.',
      emoji: '🐎',
      icone_nome: 'shield',
      atributo_principal: 'forca',
      dado_vida: 10,
      habilidades_iniciais: JSON.stringify(['Cavalgar', 'Liderança', 'Honra', 'Carga Montada']),
      tipo_armadura: 'Pesada',
      armas_permitidas: JSON.stringify(['Lanças', 'Espadas Longas', 'Escudos', 'Arcos Montados'])
    },
    {
      id: 'necromante',
      nome: 'Necromante Redimido',
      descricao: 'Ex-seguidor das trevas que agora usa conhecimento sombrio para o bem.',
      emoji: '💀',
      icone_nome: 'sparkles',
      atributo_principal: 'inteligencia',
      dado_vida: 6,
      habilidades_iniciais: JSON.stringify(['Magia da Morte', 'Comunicar com Mortos', 'Resistência Necrótica', 'Purificação']),
      tipo_armadura: 'Leve/Robes',
      armas_permitidas: JSON.stringify(['Cajados Sombrios', 'Foices', 'Adagas Rituais', 'Amuletos'])
    },
    {
      id: 'shaman',
      nome: 'Xamã',
      descricao: 'Místico tribal que se conecta com espíritos ancestrais e forças naturais.',
      emoji: '🪶',
      icone_nome: 'sparkles',
      atributo_principal: 'sabedoria',
      dado_vida: 8,
      habilidades_iniciais: JSON.stringify(['Magia Espiritual', 'Comunicação Ancestral', 'Visão Espiritual', 'Cura Ritual']),
      tipo_armadura: 'Leve/Natural',
      armas_permitidas: JSON.stringify(['Cajados Totêmicos', 'Tomahawks', 'Adagas Rituais', 'Arcos Tribais'])
    },
    {
      id: 'alquimista',
      nome: 'Alquimista',
      descricao: 'Estudioso que mistura ciência e magia através de poções e experimentos.',
      emoji: '⚗️',
      icone_nome: 'sparkles',
      atributo_principal: 'inteligencia',
      dado_vida: 6,
      habilidades_iniciais: JSON.stringify(['Alquimia', 'Poções', 'Experimentos', 'Conhecimento Químico']),
      tipo_armadura: 'Leve',
      armas_permitidas: JSON.stringify(['Cajados', 'Bestas', 'Bombas Alquímicas', 'Adagas'])
    },
    
    // Classes Místicas Especiais
    {
      id: 'istari',
      nome: 'Istari',
      descricao: 'Mago de poder imenso, enviado pelos Valar para guiar a Terra Média.',
      emoji: '🧙‍♂️',
      icone_nome: 'sparkles',
      atributo_principal: 'sabedoria',
      dado_vida: 8,
      habilidades_iniciais: JSON.stringify(['Magia Suprema', 'Sabedoria Infinita', 'Liderança Divina', 'Resistência Total']),
      tipo_armadura: 'Robes Mágicos',
      armas_permitidas: JSON.stringify(['Cajado do Poder', 'Glamdring', 'Orcrist', 'Anéis de Poder'])
    }
  ];

  // Inserir raças
  for (const race of races) {
    await prisma.race.upsert({
      where: { id: race.id },
      update: race,
      create: race,
    });
    console.log(`✨ Raça criada: ${race.nome}`);
  }

  // Inserir classes
  for (const charClass of classes) {
    await prisma.characterClass.upsert({
      where: { id: charClass.id },
      update: charClass,
      create: charClass,
    });
    console.log(`⚔️ Classe criada: ${charClass.nome}`);
  }

  console.log('\n🎉 Banco de dados expandido com sucesso!');
  console.log(`📊 Total: ${races.length} raças e ${classes.length} classes do D&D dos Pirangueiros`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
