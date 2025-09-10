import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'seu_jwt_secret_aqui';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🖼️ PATCH /api/characters/${params.id}/avatar - Atualizando avatar`);
    
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

    // Verificar se o personagem existe e pertence ao usuário
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

    // Obter dados do corpo da requisição
    const body = await request.json();
    const { avatar_url } = body;

    if (typeof avatar_url !== 'string') {
      return NextResponse.json(
        { error: 'URL do avatar deve ser uma string' },
        { status: 400 }
      );
    }

    // Atualizar avatar do personagem
    const updatedCharacter = await prisma.character.update({
      where: {
        id: characterId
      },
      data: {
        avatar_url: avatar_url || null
      },
      select: {
        id: true,
        nome: true,
        avatar_url: true,
        updatedAt: true
      }
    });

    console.log(`✅ Avatar do personagem ${character.nome} atualizado com sucesso`);

    return NextResponse.json({
      success: true,
      message: 'Avatar atualizado com sucesso',
      character: updatedCharacter
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar avatar:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
