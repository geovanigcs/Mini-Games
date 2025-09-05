const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function fullLoginTest() {
  try {
    console.log('🔍 Teste completo de login...\n');

    // 1. Verificar usuários existentes
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        characters: true
      }
    });

    console.log('👥 Usuários no banco:', users.length);
    users.forEach(user => {
      console.log(`- ${user.nome} (${user.email}) - ${user.characters.length} personagens`);
    });

    // 2. Testar login via fetch (simular frontend)
    console.log('\n🌐 Testando login via HTTP...');
    
    const loginData = {
      email: 'teste@rpg.com',
      senha: '123456'
    };

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      const result = await response.json();
      
      console.log('📡 Status:', response.status);
      console.log('📥 Resposta:', result);

      if (response.ok) {
        console.log('✅ Login HTTP bem-sucedido!');
        
        // Verificar token
        if (result.token) {
          console.log('🔑 Token JWT recebido (primeiros 50 chars):', result.token.substring(0, 50) + '...');
        }
      } else {
        console.log('❌ Erro HTTP:', result.error);
      }

    } catch (fetchError) {
      console.log('❌ Erro na requisição HTTP:', fetchError.message);
      console.log('💡 Servidor pode não estar rodando. Execute: npm run dev');
    }

    console.log('\n🏁 Teste concluído!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fullLoginTest();
