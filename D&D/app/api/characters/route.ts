import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const characterSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  titulo: z.string().optional(),
  pseudonimo: z.string().optional(),
  familia: z.string().optional(),
  avatar_url: z.string().optional(),
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

    // Verificar duplicações de nome, título e pseudônimo globalmente (não apenas para o usuário)
    const duplicateChecks = [];
    
    if (validatedData.nome) {
      const existingByName = await prisma.character.findFirst({
        where: { nome: validatedData.nome }
      });
      if (existingByName) duplicateChecks.push('nome');
    }
    
    if (validatedData.titulo && validatedData.titulo.trim()) {
      const existingByTitle = await prisma.character.findFirst({
        where: { titulo: validatedData.titulo }
      });
      if (existingByTitle) duplicateChecks.push('título');
    }
    
    if (validatedData.pseudonimo && validatedData.pseudonimo.trim()) {
      const existingByNickname = await prisma.character.findFirst({
        where: { pseudonimo: validatedData.pseudonimo }
      });
      if (existingByNickname) duplicateChecks.push('pseudônimo');
    }

    if (duplicateChecks.length > 0) {
      return NextResponse.json(
        { 
          error: `Já existe um personagem com esse ${duplicateChecks.join(' e ')}. Por favor, escolha outro(s).`,
          duplicateFields: duplicateChecks
        },
        { status: 400 }
      );
    }

    const characterClass = await prisma.characterClass.findUnique({
      where: { id: validatedData.classe }
    });

    console.log('🎯 Dados validados:', JSON.stringify(validatedData, null, 2));

    const constitutionBonus = Math.floor((validatedData.constituicao - 10) / 2);
    const hitDie = characterClass?.dado_vida || 8;
    const baseHP = hitDie + constitutionBonus;
    const maxHP = Math.max(1, baseHP);

    console.log('💖 HP calculado:', { baseHP, maxHP, constitutionBonus, hitDie });

    const createData = {
      userId: decoded.userId,
      ...validatedData,
      pontos_vida_atuais: maxHP,
      pontos_vida_maximos: maxHP,
      dinheiro_cobre: 100, // Dinheiro inicial
      dinheiro_prata: 10,
      dinheiro_ouro: 1,
    };

    console.log('📦 Dados para criação:', JSON.stringify(createData, null, 2));

    const character = await prisma.character.create({
      data: createData,
    });

    return NextResponse.json({
      message: '🎭 Personagem criado com sucesso! Que comece a aventura!',
      character,
      id: character.id,
      nome: character.nome
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
    console.log('🔍 GET /api/characters - Listando personagens do usuário');
    
    // Verificar autenticação
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticação necessário' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;
    
    try {
      const jwt = require('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'seu_jwt_secret_aqui';
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;
    console.log(`👤 Usuário autenticado: ${userId}`);

    // Buscar personagens do usuário
    const characters = await prisma.character.findMany({
      where: {
        userId: userId
      },
      select: {
        id: true,
        nome: true,
        titulo: true,
        pseudonimo: true,
        classe: true,
        raca: true,
        nivel: true,
        pontos_vida_atuais: true,
        pontos_vida_maximos: true,
        avatar_url: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📋 Encontrados ${characters.length} personagens para o usuário`);

    return NextResponse.json(characters);

  } catch (error) {
    console.error('❌ Erro ao buscar personagens:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
