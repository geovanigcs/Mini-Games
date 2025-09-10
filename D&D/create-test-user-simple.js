#!/usr/bin/env node

async function createTestUser() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Teste Usuario',
        nickname: 'teste',
        email: 'teste@teste.com',
        senha: '123456'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Usuário de teste criado com sucesso!');
      console.log('📝 Use estas credenciais para testar:');
      console.log('   Nickname: teste');
      console.log('   Senha: 123456');
    } else {
      console.log('ℹ️ Resposta:', data.error || data.message);
    }
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
}

createTestUser();
