const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function testCharacterCreation() {
  try {
    console.log('🧪 Testando criação de personagem...\n');

    // Obter usuário de teste
    const user = await prisma.user.findUnique({
      where: { email: 'teste@rpg.com' }
    });

    if (!user) {
      console.log('❌ Usuário de teste não encontrado');
      return;
    }

    console.log('👤 Usuário:', user.nome, user.email);

    // Gerar token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'sua-chave-secreta-super-segura',
      { expiresIn: '7d' }
    );

    // Dados do personagem de teste
    const characterData = {
      nome: 'Aragorn',
      apelido: 'O Montanhês',
      raca: 'humano',
      classe: 'guerreiro',
      forca: 15,
      destreza: 13,
      constituicao: 14,
      inteligencia: 12,
      sabedoria: 13,
      carisma: 15,
      idade: 35,
      altura: 185,
      peso: 80,
      corOlhos: 'Cinza',
      corCabelo: 'Castanho',
      corPele: 'Clara',
      alinhamento: 'leal_bom',
      origem: 'Criado nas terras selvagens do Norte, Aragorn aprendeu desde cedo a sobreviver em ambientes hostis.',
      motivacao: 'Restaurar a paz na Terra Média',
      personalidade: 'Corajoso e leal'
    };

    console.log('\n📡 Testando API de criação via HTTP...');
    
    try {
      const response = await fetch('http://localhost:3000/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(characterData)
      });

      const result = await response.json();
      
      console.log('📡 Status:', response.status);
      console.log('📥 Resposta:', JSON.stringify(result, null, 2));

      if (response.ok) {
        console.log('✅ Personagem criado com sucesso!');
        
        // Verificar se o personagem foi salvo no banco
        const savedCharacter = await prisma.character.findFirst({
          where: { userId: user.id },
          include: { user: true }
        });

        if (savedCharacter) {
          console.log('🎭 Personagem no banco:', savedCharacter.nome);
        }
      } else {
        console.log('❌ Erro na criação:', result.error);
      }

    } catch (fetchError) {
      console.log('❌ Erro na requisição:', fetchError.message);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCharacterCreation();
