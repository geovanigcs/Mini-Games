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
    console.log('🔍 Login API chamada');
    
    const body = await request.json();
    console.log('📨 Dados recebidos:', { emailOrNickname: body.emailOrNickname, senha: '***' });
    
    // Validar dados de entrada
    const validatedData = loginSchema.parse(body);
    console.log('✅ Dados validados com sucesso');
    
    // Buscar usuário
    console.log(`🔍 Buscando usuário: ${validatedData.emailOrNickname}`);
    
    // Verificar se é email ou nickname
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
      console.log('❌ Usuário não encontrado');
      return NextResponse.json(
        { error: 'Email/usuário ou senha incorretos' },
        { status: 401 }
      );
    }
    
    console.log('👤 Usuário encontrado:', { id: user.id, nome: user.nome, email: user.email });

    // Verificar senha
    console.log('🔐 Verificando senha...');
    const passwordMatch = await comparePasswords(validatedData.senha, user.senha);
    console.log(`🔍 Resultado da verificação: ${passwordMatch}`);
    
    if (!passwordMatch) {
      console.log('❌ Senha incorreta');
      return NextResponse.json(
        { error: 'Email/usuário ou senha incorretos' },
        { status: 401 }
      );
    }

    console.log('✅ Senha correta, atualizando último login...');
    // Atualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { ultimo_login: new Date() }
    });

    console.log('🔑 Gerando token JWT...');
    // Gerar token JWT
    const token = generateToken(user.id);

    // Remover senha do retorno
    const { senha, ...userWithoutPassword } = user;

    console.log('🎉 Login realizado com sucesso!');
    return NextResponse.json({
      message: `🏰 Bem-vindo de volta, ${user.nome}! O D&D dos Pirangueiros aguarda!`,
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('❌ Erro de validação:', error.issues[0].message);
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('❌ Erro no login (detalhado):', error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
