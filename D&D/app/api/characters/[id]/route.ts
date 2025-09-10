import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'seu_jwt_secret_aqui';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;
    const characterId = params.id;

    // Buscar personagem específico do usuário
    const character = await prisma.character.findFirst({
      where: {
        id: characterId,
        userId: userId
      }
    });

    if (!character) {
      return NextResponse.json(
        { error: 'Personagem não encontrado' },
        { status: 404 }
      );
    }

    console.log(`📖 Personagem ${character.nome} visualizado pelo usuário ${userId}`);

    return NextResponse.json(character);

  } catch (error) {
    console.error('❌ Erro ao buscar personagem:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
