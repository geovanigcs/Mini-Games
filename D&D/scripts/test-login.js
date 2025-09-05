const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testLogin() {
  try {
    console.log('🔍 Iniciando teste de login...\n');

    // Primeiro, listar todos os usuários
    console.log('📊 Usuários no banco:');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        senha: true,
        createdAt: true,
      }
    });

    console.log(JSON.stringify(users, null, 2));

    if (users.length === 0) {
      console.log('❌ Nenhum usuário encontrado!');
      return;
    }

    // Testar login com o primeiro usuário
    const testUser = users[0];
    console.log(`\n🧪 Testando login com: ${testUser.email}`);

    // Verificar se a senha está hasheada
    console.log('🔐 Hash da senha no banco:');
    console.log(testUser.senha);
    console.log('Comprimento:', testUser.senha.length);
    console.log('Começa com $2:', testUser.senha.startsWith('$2'));

    // Tentar fazer hash de uma senha padrão para comparar
    const senhaPlana = '123456';
    const novoHash = await bcrypt.hash(senhaPlana, 10);
    console.log('\n🆕 Novo hash para "123456":');
    console.log(novoHash);
    
    // Testar comparação
    const senhaCorreta = await bcrypt.compare(senhaPlana, testUser.senha);
    console.log(`\n✅ Senha "${senhaPlana}" confere? ${senhaCorreta}`);

    // Testar outras senhas comuns
    const senhasComuns = ['password', 'admin', 'test', 'user'];
    for (const senha of senhasComuns) {
      const confere = await bcrypt.compare(senha, testUser.senha);
      console.log(`🔑 Senha "${senha}" confere? ${confere}`);
    }

    console.log('\n🏁 Teste concluído!');

  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
