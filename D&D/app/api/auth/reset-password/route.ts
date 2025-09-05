import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resetPasswordSchema.parse(body);
    
    const user = await prisma.user.findFirst({
      where: {
        reset_token: validatedData.token,
        reset_token_expiry: {
          gte: new Date(),
        },
      },
      select: {
        id: true,
        nome: true,
        email: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado. Solicite uma nova redefinição de senha.' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(validatedData.newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        senha: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
        updatedAt: new Date(),
      }
    });

    return NextResponse.json({
      message: `🎉 Senha redefinida com sucesso, ${user.nome}! Agora você pode fazer login com sua nova senha.`
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
