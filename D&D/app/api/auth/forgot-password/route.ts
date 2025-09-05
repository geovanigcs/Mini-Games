import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import crypto from 'crypto';

const forgotPasswordSchema = z.object({
  emailOrNickname: z.string().min(1, 'Email ou usuário é obrigatório'),
});

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Solicitação de redefinição de senha recebida');
    
    const body = await request.json();
    console.log('📨 Dados recebidos:', { emailOrNickname: body.emailOrNickname });
    
    // Validar dados de entrada
    const validatedData = forgotPasswordSchema.parse(body);
    console.log('✅ Dados validados com sucesso');
    
    // Verificar se é email ou nickname
    const isEmail = validatedData.emailOrNickname.includes('@');
    const whereClause = isEmail 
      ? { email: validatedData.emailOrNickname }
      : { nickname: validatedData.emailOrNickname };
    
    // Buscar usuário
    console.log(`🔍 Buscando usuário: ${validatedData.emailOrNickname}`);
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
      console.log('❌ Usuário não encontrado, mas retornando sucesso por segurança');
      // Por segurança, sempre retornar sucesso mesmo que o usuário não exista
      return NextResponse.json({
        message: 'Se o email/usuário existir, você receberá instruções para redefinir sua senha.'
      });
    }
    
    console.log('👤 Usuário encontrado:', { id: user.id, nome: user.nome });

    // Gerar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    console.log('🔑 Gerando token de reset...');
    
    // Salvar token no banco
    await prisma.user.update({
      where: { id: user.id },
      data: {
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry,
      }
    });

    console.log('✅ Token de reset salvo no banco');

    // Aqui você integraria com um serviço de email real
    // Por enquanto, vamos simular o envio
    console.log('📧 Simulando envio de email...');
    console.log(`Reset Token: ${resetToken}`);
    console.log(`Reset URL: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`);

    return NextResponse.json({
      message: `🔄 Instruções de redefinição enviadas! Por favor, verifique seu email ${user.email}.`,
      // Em desenvolvimento, incluir o token para facilitar testes
      ...(process.env.NODE_ENV === 'development' && { 
        resetToken,
        resetUrl: `/reset-password?token=${resetToken}`
      })
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('❌ Erro de validação:', error.issues[0].message);
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('❌ Erro na solicitação de reset:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
