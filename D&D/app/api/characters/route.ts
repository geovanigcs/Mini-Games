import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const characterSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  apelido: z.string().optional(),
  raca: z.string().min(1, 'Raça é obrigatória'),
  classe: z.string().min(1, 'Classe é obrigatória'),
  forca: z.number().min(3).max(18),
  destreza: z.number().min(3).max(18),
  constituicao: z.number().min(3).max(18),
  inteligencia: z.number().min(3).max(18),
  sabedoria: z.number().min(3).max(18),
  carisma: z.number().min(3).max(18),
  idade: z.number().min(1).max(10000),
  altura: z.number().min(50).max(500),
  peso: z.number().min(10).max(1000),
  corOlhos: z.string(),
  corCabelo: z.string(),
  corPele: z.string(),
  estilo: z.string(),
  alinhamento: z.string(),
  origem: z.string(),
  motivacao: z.string(),
  traumas: z.string().optional().default(''),
  inimigos: z.string().optional().default(''),
  segredo: z.string().optional().default(''),
  armas: z.string().optional().default(''),
  armadura: z.string().optional().default(''),
  itensEspeciais: z.string().optional().default(''),
  proficiencias: z.string().optional().default(''),
  magias: z.string().optional().default(''),
  poderes: z.string().optional().default(''),
  idiomas: z.string().optional().default(''),
  conhecimentos: z.string().optional().default(''),
  personalidade: z.string().optional().default(''),
  tracos: z.string().optional().default(''),
  ideais: z.string().optional().default(''),
  vinculos: z.string().optional().default(''),
  defeitos: z.string().optional().default(''),
});

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticação necessário' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const validatedData = characterSchema.parse(body);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const existingCharacter = await prisma.character.findFirst({
      where: {
        userId: decoded.userId,
        nome: validatedData.nome,
      }
    });

    if (existingCharacter) {
      return NextResponse.json(
        { error: 'Você já possui um personagem com este nome' },
        { status: 400 }
      );
    }

    const characterClass = await prisma.characterClass.findUnique({
      where: { id: validatedData.classe }
    });

    const constitutionBonus = Math.floor((validatedData.constituicao - 10) / 2);
    const hitDie = characterClass?.dado_vida || 8;
    const baseHP = hitDie + constitutionBonus;
    const maxHP = Math.max(1, baseHP);

    const character = await prisma.character.create({
      data: {
        userId: decoded.userId,
        ...validatedData,
        pontos_vida_atuais: maxHP,
        pontos_vida_maximos: maxHP,
        dinheiro_cobre: 100, // Dinheiro inicial
        dinheiro_prata: 10,
        dinheiro_ouro: 1,
      },
    });

    return NextResponse.json({
      message: '🎭 Personagem criado com sucesso! Que comece a aventura!',
      character,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Erro ao criar personagem:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticação necessário' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    const characters = await prisma.character.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
    });

    const charactersWithDetails = await Promise.all(
      characters.map(async (character) => {
        const [race, characterClass] = await Promise.all([
          prisma.race.findUnique({
            where: { id: character.raca }
          }),
          prisma.characterClass.findUnique({
            where: { id: character.classe }
          })
        ]);

        return {
          ...character,
          Race: race,
          CharacterClass: characterClass,
        };
      })
    );

    return NextResponse.json({
      characters: charactersWithDetails,
      count: charactersWithDetails.length
    });

  } catch (error) {
    console.error('Erro ao buscar personagens:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
