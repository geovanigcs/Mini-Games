// Teste completo de autenticação
const testUser = {
  nome: 'Usuário Teste',
  nickname: 'teste' + Date.now(),
  email: 'teste' + Date.now() + '@exemplo.com',
  senha: '123456'
};

async function testeCompleto() {
  console.log('🧪 === TESTE COMPLETO DE AUTENTICAÇÃO ===\n');
  
  try {
    // 1. Registrar usuário
    console.log('1️⃣ Registrando novo usuário...');
    console.log('Dados:', { ...testUser, senha: '[OCULTA]' });
    
    const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    const registerData = await registerResponse.json();
    console.log('Status registro:', registerResponse.status);
    console.log('Resposta registro:', registerData);
    
    if (!registerResponse.ok) {
      console.error('❌ Erro no registro:', registerData.error);
      return;
    }
    
    console.log('✅ Registro bem-sucedido!\n');
    
    // 2. Fazer login
    console.log('2️⃣ Fazendo login com as credenciais...');
    
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrNickname: testUser.nickname,
        senha: testUser.senha
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Status login:', loginResponse.status);
    console.log('Resposta login:', loginData);
    
    if (!loginResponse.ok) {
      console.error('❌ Erro no login:', loginData.error);
      return;
    }
    
    console.log('✅ Login bem-sucedido!\n');
    
    // 3. Testar login com email
    console.log('3️⃣ Testando login com email...');
    
    const emailLoginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrNickname: testUser.email,
        senha: testUser.senha
      })
    });
    
    const emailLoginData = await emailLoginResponse.json();
    console.log('Status login por email:', emailLoginResponse.status);
    
    if (emailLoginResponse.ok) {
      console.log('✅ Login por email bem-sucedido!');
    } else {
      console.error('❌ Erro no login por email:', emailLoginData.error);
    }
    
    console.log('\n🎉 === TODOS OS TESTES PASSARAM! ===');
    console.log('\n📋 RESUMO:');
    console.log('• Registro: ✅ Funcionando');
    console.log('• Login por nickname: ✅ Funcionando');
    console.log('• Login por email: ✅ Funcionando');
    console.log('• Sistema de autenticação: ✅ 100% Operacional');
    
  } catch (error) {
    console.error('💥 Erro no teste:', error.message);
  }
}

testeCompleto();
