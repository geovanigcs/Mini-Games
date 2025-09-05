import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  nickname: z.string().min(3, 'Nickname deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados de entrada
    const validatedData = registerSchema.parse(body);
    
    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está em uso' },
        { status: 400 }
      );
    }

    // Verificar se nickname já existe
    const existingNickname = await prisma.user.findFirst({
      where: { nickname: validatedData.nickname }
    });

    if (existingNickname) {
      return NextResponse.json(
        { error: 'Este nickname já está em uso' },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = await hashPassword(validatedData.senha);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        nome: validatedData.nome,
        nickname: validatedData.nickname,
        email: validatedData.email,
        senha: hashedPassword,
        ultimo_login: new Date(),
      },
      select: {
        id: true,
        nome: true,
        nickname: true,
        email: true,
        nivel_usuario: true,
        experiencia_total: true,
        createdAt: true,
      }
    });

    // Gerar token JWT
    const token = generateToken(user.id);

    return NextResponse.json({
      message: '🎉 Conta criada com sucesso! Bem-vindo ao D&D dos Pirangueiros!',
      user,
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
