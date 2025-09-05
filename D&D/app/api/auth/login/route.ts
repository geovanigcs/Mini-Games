import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePasswords, generateToken } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  emailOrNickname: z.string().min(1, 'Email ou usuário é obrigatório'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);
    
    const isEmail = validatedData.emailOrNickname.includes('@');
    const whereClause = isEmail 
      ? { email: validatedData.emailOrNickname }
      : { nickname: validatedData.emailOrNickname };
    
    const user = await prisma.user.findUnique({
      where: whereClause,
      select: {
        id: true,
        nome: true,
        nickname: true,
        email: true,
        senha: true,
        nivel_usuario: true,
        experiencia_total: true,
        createdAt: true,
        characters: {
          select: {
            id: true,
            nome: true,
            raca: true,
            classe: true,
            nivel: true,
          },
        },
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Email/usuário ou senha incorretos' },
        { status: 401 }
      );
    }

    const passwordMatch = await comparePasswords(validatedData.senha, user.senha);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Email/usuário ou senha incorretos' },
        { status: 401 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { ultimo_login: new Date() }
    });

    const token = generateToken(user.id);
    const { senha, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: `🏰 Bem-vindo de volta, ${user.nome}! O D&D dos Pirangueiros aguarda!`,
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
