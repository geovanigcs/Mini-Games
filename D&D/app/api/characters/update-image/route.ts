import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const updateImageSchema = z.object({
  characterId: z.string().uuid(),
  imageUrl: z.string().url(),
});

export async function PATCH(request: NextRequest) {
  try {
    // Verificar autenticação
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
    const { characterId, imageUrl } = updateImageSchema.parse(body);

    // Verificar se o personagem pertence ao usuário
    const character = await prisma.character.findFirst({
      where: {
        id: characterId,
        userId: decoded.userId
      }
    });

    if (!character) {
      return NextResponse.json(
        { error: 'Personagem não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    // Atualizar a imagem do personagem
    const updatedCharacter = await prisma.character.update({
      where: { id: characterId },
      data: { imagem_url: imageUrl },
      include: {
        user: {
          select: {
            nome: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      message: '🖼️ Imagem do personagem atualizada com sucesso!',
      character: updatedCharacter
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Erro ao atualizar imagem do personagem:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
