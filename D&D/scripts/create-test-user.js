const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🧪 Criando usuário de teste...\n');

    const testEmail = 'teste@rpg.com';
    const testPassword = '123456';
    const hashedPassword = await bcrypt.hash(testPassword, 12);

    // Primeiro deletar se existir
    try {
      await prisma.user.delete({
        where: { email: testEmail }
      });
      console.log('🗑️ Usuário de teste anterior removido');
    } catch (e) {
      // Usuário não existe, tudo bem
    }

    // Criar novo usuário de teste
    const user = await prisma.user.create({
      data: {
        nome: 'Usuário Teste',
        nickname: 'Teste',
        email: testEmail,
        senha: hashedPassword,
      }
    });

    console.log('✅ Usuário de teste criado:');
    console.log(`📧 Email: ${testEmail}`);
    console.log(`🔐 Senha: ${testPassword}`);
    console.log(`🆔 ID: ${user.id}`);
    
    // Testar a comparação de senha
    const passwordMatch = await bcrypt.compare(testPassword, hashedPassword);
    console.log(`\n🔍 Verificação de senha: ${passwordMatch ? '✅ OK' : '❌ FALHOU'}`);

    console.log('\n🎉 Pronto! Use essas credenciais para testar o login.');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
