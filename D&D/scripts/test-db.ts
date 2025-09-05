import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

async function testDatabase() {
  try {
    console.log('🔍 Testando conexão com o banco...');
    
    // Testar conexão
    await prisma.$connect();
    console.log('✅ Conexão com banco estabelecida');
    
    // Verificar se existem usuários
    const userCount = await prisma.user.count();
    console.log(`👥 Usuários no banco: ${userCount}`);
    
    // Verificar raças
    const raceCount = await prisma.race.count();
    console.log(`🧝‍♂️ Raças no banco: ${raceCount}`);
    
    // Verificar classes
    const classCount = await prisma.characterClass.count();
    console.log(`⚔️ Classes no banco: ${classCount}`);
    
    // Se não há usuários, criar um de teste
    if (userCount === 0) {
      const hashedPassword = await hashPassword('123456');
      const testUser = await prisma.user.create({
        data: {
          nome: 'Aventureiro Teste',
          nickname: 'TestHero',
          email: 'teste@terramedia.com',
          senha: hashedPassword,
        },
      });
      console.log('👤 Usuário de teste criado:', testUser.email);
    }
    
    console.log('✅ Teste do banco concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste do banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
