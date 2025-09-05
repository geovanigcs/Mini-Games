const testAuth = async () => {
  console.log('🧪 Iniciando testes de autenticação...\n');
  
  // Teste 1: Tentar registro
  console.log('📝 Teste 1: Criando novo usuário...');
  try {
    const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'João Aventureiro',
        nickname: 'joao_heroi',
        email: 'joao@exemplo.com',
        senha: '123456'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('✅ Registro:', registerData.message || registerData.error);
  } catch (error) {
    console.log('❌ Erro no registro:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Teste 2: Login com email
  console.log('🔐 Teste 2: Login com email...');
  try {
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrNickname: 'joao@exemplo.com',
        senha: '123456'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login email:', loginData.message || loginData.error);
    
    if (loginData.token) {
      console.log('🎫 Token recebido!');
    }
  } catch (error) {
    console.log('❌ Erro no login:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Teste 3: Login com nickname
  console.log('👤 Teste 3: Login com nickname...');
  try {
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrNickname: 'joao_heroi',
        senha: '123456'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login nickname:', loginData.message || loginData.error);
  } catch (error) {
    console.log('❌ Erro no login:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Teste 4: Recuperação de senha
  console.log('🔄 Teste 4: Recuperação de senha...');
  try {
    const forgotResponse = await fetch('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrNickname: 'joao@exemplo.com'
      })
    });
    
    const forgotData = await forgotResponse.json();
    console.log('✅ Recuperação:', forgotData.message || forgotData.error);
    
    if (forgotData.resetToken) {
      console.log('🔑 Token de reset:', forgotData.resetToken);
      
      // Teste 5: Reset da senha
      console.log('\n🔄 Teste 5: Resetando senha...');
      const resetResponse = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: forgotData.resetToken,
          newPassword: 'nova123456',
          confirmPassword: 'nova123456'
        })
      });
      
      const resetData = await resetResponse.json();
      console.log('✅ Reset senha:', resetData.message || resetData.error);
    }
  } catch (error) {
    console.log('❌ Erro na recuperação:', error.message);
  }
  
  console.log('\n🎉 Testes de autenticação concluídos!');
};

testAuth();
