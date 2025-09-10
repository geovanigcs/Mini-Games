// Teste da criação de personagens

async function testCharacterCreation() {
  console.log('🧪 === TESTE DE CRIAÇÃO DE PERSONAGEM ===\n');

  // Primeiro, fazer login para obter token
  console.log('1️⃣ Fazendo login para obter token...');
  
  try {
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrNickname: 'teste',
        senha: '123456'
      })
    });
    
    if (!loginResponse.ok) {
      console.error('❌ Erro no login:', await loginResponse.text());
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login realizado com sucesso!');
    
    const token = loginData.token;
    
    // Dados de teste do personagem
    const characterData = {
      nome: 'Teste Hero ' + Date.now(),
      titulo: 'Sir' + Date.now(),
      pseudonimo: 'TesteNick' + Date.now(),
      familia: 'TesteFamilia',
      avatar_url: 'https://via.placeholder.com/150',
      apelido: 'Teste',
      raca: 'humano',
      classe: 'guerreiro',
      forca: 15,
      destreza: 12,
      constituicao: 14,
      inteligencia: 10,
      sabedoria: 13,
      carisma: 11,
      idade: 25,
      altura: 180,
      peso: 75,
      corOlhos: 'Azuis',
      corCabelo: 'Castanho',
      corPele: 'Clara',
      estilo: 'Nobre',
      alinhamento: 'Leal Bom',
      origem: 'Reino Central',
      motivacao: 'Proteger os inocentes',
      traumas: 'Nenhum trauma significativo',
      inimigos: 'Bandidos locais',
      segredo: 'Nasceu em família nobre',
      armas: 'Espada longa, escudo',
      armadura: 'Armadura de couro',
      itensEspeciais: 'Anel da família',
      proficiencias: 'Armas simples e marciais',
      magias: 'Nenhuma',
      poderes: 'Ataque Extra',
      idiomas: 'Comum, Élfico',
      conhecimentos: 'História, Nobreza',
      personalidade: 'Corajoso e leal',
      tracos: 'Sempre protege os fracos',
      ideais: 'Justiça acima de tudo',
      vinculos: 'Família e reino',
      defeitos: 'Muito confiante'
    };
    
    console.log('\n2️⃣ Criando personagem...');
    console.log('Dados:', { nome: characterData.nome, classe: characterData.classe, raca: characterData.raca });
    
    const createResponse = await fetch('http://localhost:3000/api/characters', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(characterData)
    });
    
    const result = await createResponse.json();
    
    if (createResponse.ok) {
      console.log('✅ Personagem criado com sucesso!');
      console.log('ID:', result.id);
      console.log('Nome:', result.nome);
    } else {
      console.error('❌ Erro na criação:', result);
      console.error('Status:', createResponse.status);
    }
    
  } catch (error) {
    console.error('💥 Erro no teste:', error.message);
  }
}

testCharacterCreation();
