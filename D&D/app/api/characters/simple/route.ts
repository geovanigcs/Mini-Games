import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const createCharacterSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  raceId: z.string(),
  classId: z.string(),
  level: z.number().min(1).max(20),
  stats: z.object({
    strength: z.number().min(3).max(18),
    dexterity: z.number().min(3).max(18),
    constitution: z.number().min(3).max(18),
    intelligence: z.number().min(3).max(18),
    wisdom: z.number().min(3).max(18),
    charisma: z.number().min(3).max(18),
  })
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
    const validatedData = createCharacterSchema.parse(body);

    // Buscar raça e classe para validação
    const [race, characterClass] = await Promise.all([
      prisma.race.findUnique({ where: { id: validatedData.raceId } }),
      prisma.characterClass.findUnique({ where: { id: validatedData.classId } })
    ]);

    if (!race) {
      return NextResponse.json(
        { error: 'Raça não encontrada' },
        { status: 400 }
      );
    }

    if (!characterClass) {
      return NextResponse.json(
        { error: 'Classe não encontrada' },
        { status: 400 }
      );
    }

    // Criar personagem
    const character = await prisma.character.create({
      data: {
        nome: validatedData.name,
        raca: race.nome,
        classe: characterClass.nome,
        nivel: validatedData.level,
        forca: validatedData.stats.strength,
        destreza: validatedData.stats.dexterity,
        constituicao: validatedData.stats.constitution,
        inteligencia: validatedData.stats.intelligence,
        sabedoria: validatedData.stats.wisdom,
        carisma: validatedData.stats.charisma,
        pontos_vida_maximos: Math.floor(Math.random() * 10) + validatedData.stats.constitution + validatedData.level,
        pontos_vida_atuais: Math.floor(Math.random() * 10) + validatedData.stats.constitution + validatedData.level,
        experiencia: 0,
        dinheiro_ouro: 100,
        idade: 20,
        altura: 170,
        peso: 70,
        corOlhos: 'Castanhos',
        corCabelo: 'Castanho',
        corPele: 'Clara',
        estilo: 'Aventureiro',
        alinhamento: 'Neutro',
        origem: 'Desconhecida',
        motivacao: 'Aventura',
        traumas: '',
        inimigos: '',
        segredo: '',
        armas: '',
        armadura: '',
        itensEspeciais: '',
        proficiencias: '',
        magias: '',
        poderes: '',
        idiomas: '',
        conhecimentos: '',
        personalidade: '',
        tracos: '',
        ideais: '',
        vinculos: '',
        defeitos: '',
        userId: decoded.userId
      },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            nickname: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Personagem criado com sucesso!',
      character: {
        id: character.id,
        nome: character.nome,
        raca: character.raca,
        classe: character.classe,
        nivel: character.nivel,
        stats: {
          strength: character.forca,
          dexterity: character.destreza,
          constitution: character.constituicao,
          intelligence: character.inteligencia,
          wisdom: character.sabedoria,
          charisma: character.carisma
        }
      }
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
      select: {
        id: true,
        nome: true,
        raca: true,
        classe: true,
        nivel: true,
        imagem_url: true,
        pontos_vida_atuais: true,
        experiencia: true
      }
    });

    return NextResponse.json(characters.map(char => ({
      id: char.id,
      name: char.nome,
      race: char.raca,
      characterClass: char.classe,
      level: char.nivel,
      image: char.imagem_url,
      health: char.pontos_vida_atuais,
      experience: char.experiencia
    })));

  } catch (error) {
    console.error('Erro ao buscar personagens:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
