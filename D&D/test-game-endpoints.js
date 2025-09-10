// Teste completo dos endpoints de dados do jogo

async function testarEndpoints() {
  console.log('🧪 === TESTE DOS ENDPOINTS DE DADOS ===\n');

  // Teste 1: Raças
  console.log('1️⃣ Testando endpoint das raças...');
  try {
    const racesResponse = await fetch('http://localhost:3000/api/races');
    if (racesResponse.ok) {
      const races = await racesResponse.json();
      console.log(`✅ Raças carregadas: ${races.length} encontradas`);
      races.forEach(race => console.log(`   ${race.emoji} ${race.nome}`));
    } else {
      console.error('❌ Erro ao carregar raças:', racesResponse.status);
    }
  } catch (error) {
    console.error('💥 Erro de rede nas raças:', error.message);
  }

  console.log('\n2️⃣ Testando endpoint das classes...');
  try {
    const classesResponse = await fetch('http://localhost:3000/api/classes');
    if (classesResponse.ok) {
      const classes = await classesResponse.json();
      console.log(`✅ Classes carregadas: ${classes.length} encontradas`);
      classes.slice(0, 5).forEach(cls => console.log(`   ${cls.emoji} ${cls.nome}`));
      if (classes.length > 5) console.log(`   ... e mais ${classes.length - 5} classes`);
    } else {
      console.error('❌ Erro ao carregar classes:', classesResponse.status);
    }
  } catch (error) {
    console.error('💥 Erro de rede nas classes:', error.message);
  }

  console.log('\n3️⃣ Testando endpoint das habilidades...');
  try {
    const skillsResponse = await fetch('http://localhost:3000/api/skills');
    if (skillsResponse.ok) {
      const skills = await skillsResponse.json();
      console.log(`✅ Habilidades carregadas: ${skills.length} encontradas`);
    } else {
      console.error('❌ Erro ao carregar habilidades:', skillsResponse.status);
    }
  } catch (error) {
    console.error('💥 Erro de rede nas habilidades:', error.message);
  }

  console.log('\n🎉 Teste dos endpoints concluído!');
}

testarEndpoints();
