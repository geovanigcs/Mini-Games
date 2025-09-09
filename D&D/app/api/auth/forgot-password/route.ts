import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { z } from 'zod';
import crypto from 'crypto';

const forgotPasswordSchema = z.object({
  emailOrNickname: z.string().min(1, 'Email ou usuário é obrigatório'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = forgotPasswordSchema.parse(body);
    
    const isEmail = validatedData.emailOrNickname.includes('@');
    const whereClause = isEmail 
      ? { email: validatedData.emailOrNickname }
      : { nickname: validatedData.emailOrNickname };
    
    const user = await prisma.user.findUnique({
      where: whereClause,
      select: {
        id: true,
        nome: true,
        email: true,
        nickname: true,
      }
    });

    if (!user) {
      return NextResponse.json({
        message: 'Se o email/usuário existir, você receberá instruções para redefinir sua senha.'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000);
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry,
      }
    });

    const emailResult = await sendPasswordResetEmail(user.email, resetToken, user.nome);

    if (emailResult.success) {
      return NextResponse.json({
        message: `🔄 Instruções de redefinição enviadas! Por favor, verifique seu email ${user.email}.`,
        ...(process.env.NODE_ENV === 'development' && { 
          resetToken,
          resetUrl: `/reset-password?token=${resetToken}`
        })
      });
    } else {
      console.error('Falha no envio do email:', emailResult.error);
      
      return NextResponse.json({
        message: `🔄 Solicitação processada! Se o email existir, você receberá instruções para redefinir sua senha.`,
        ...(process.env.NODE_ENV === 'development' && { 
          resetToken,
          resetUrl: `/reset-password?token=${resetToken}`,
          emailError: 'Falha no envio do email (modo desenvolvimento)'
        })
      });
    }

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
