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
    console.log('🔄 Solicitação de redefinição de senha recebida');
    
    const body = await request.json();
    console.log('📨 Dados recebidos:', { token: body.token ? '***' : 'não informado' });
    
    // Validar dados de entrada
    const validatedData = resetPasswordSchema.parse(body);
    console.log('✅ Dados validados com sucesso');
    
    // Buscar usuário pelo token
    console.log('🔍 Buscando usuário pelo token...');
    const user = await prisma.user.findFirst({
      where: {
        reset_token: validatedData.token,
        reset_token_expiry: {
          gte: new Date(), // Token ainda válido
        },
      },
      select: {
        id: true,
        nome: true,
        email: true,
      }
    });

    if (!user) {
      console.log('❌ Token inválido ou expirado');
      return NextResponse.json(
        { error: 'Token inválido ou expirado. Solicite uma nova redefinição de senha.' },
        { status: 400 }
      );
    }
    
    console.log('👤 Usuário encontrado:', { id: user.id, nome: user.nome });

    // Hash da nova senha
    console.log('🔐 Gerando hash da nova senha...');
    const hashedPassword = await hashPassword(validatedData.newPassword);

    // Atualizar senha e limpar token
    console.log('💾 Atualizando senha no banco...');
    await prisma.user.update({
      where: { id: user.id },
      data: {
        senha: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
        updatedAt: new Date(),
      }
    });

    console.log('✅ Senha redefinida com sucesso!');

    return NextResponse.json({
      message: `🎉 Senha redefinida com sucesso, ${user.nome}! Agora você pode fazer login com sua nova senha.`
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('❌ Erro de validação:', error.issues[0].message);
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('❌ Erro na redefinição de senha:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
