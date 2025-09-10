const bcrypt = require('bcryptjs');

async function testAuth() {
  console.log('🔐 Testando sistema de autenticação...\n');

  // Teste 1: Hash e comparação de senha
  const password = 'test123';
  console.log('1. Testando hash de senha...');
  console.log('Senha original:', password);
  
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log('Senha hasheada:', hashedPassword);
  
  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log('Comparação senha correta:', isMatch);
  
  const wrongMatch = await bcrypt.compare('wrongpassword', hashedPassword);
  console.log('Comparação senha incorreta:', wrongMatch);
  
  console.log('\n2. Testando registro via API...');
  
  try {
    const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Test User',
        nickname: 'testuser' + Date.now(),
        email: 'test' + Date.now() + '@test.com',
        senha: password
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('Status registro:', registerResponse.status);
    console.log('Resposta registro:', registerData);
    
    if (registerResponse.ok) {
      console.log('\n3. Testando login via API...');
      
      const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrNickname: registerData.user.nickname,
          senha: password
        })
      });
      
      const loginData = await loginResponse.json();
      console.log('Status login:', loginResponse.status);
      console.log('Resposta login:', loginData);
    }
    
  } catch (error) {
    console.error('Erro no teste:', error.message);
  }
}

testAuth();
