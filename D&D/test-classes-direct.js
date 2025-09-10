const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testClasses() {
  try {
    console.log('🧪 Testando consulta direta ao banco...')
    
    const classes = await prisma.characterClass.findMany({
      orderBy: { nome: 'asc' },
    })
    
    console.log(`✅ Encontradas ${classes.length} classes`)
    console.log('Primeira classe:', classes[0])
    
    // Testar parsing dos campos JSON
    if (classes.length > 0) {
      const firstClass = classes[0]
      console.log('🔍 Testando parsing JSON...')
      
      try {
        const habilidades = JSON.parse(firstClass.habilidades_iniciais || '[]')
        console.log('✅ Habilidades parseadas:', habilidades)
      } catch (e) {
        console.error('❌ Erro ao fazer parse de habilidades_iniciais:', e.message)
        console.error('Valor bruto:', firstClass.habilidades_iniciais)
      }
      
      try {
        const armas = JSON.parse(firstClass.armas_permitidas || '[]')
        console.log('✅ Armas parseadas:', armas)
      } catch (e) {
        console.error('❌ Erro ao fazer parse de armas_permitidas:', e.message)
        console.error('Valor bruto:', firstClass.armas_permitidas)
      }
    }
    
  } catch (error) {
    console.error('💥 Erro na consulta:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testClasses()
