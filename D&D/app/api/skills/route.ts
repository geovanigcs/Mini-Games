import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const type = searchParams.get('type')

    let whereClause: any = {}
    
    if (category) {
      whereClause.categoria = category
    }
    
    if (type) {
      whereClause.tipo = type
    }

    const skills = await prisma.skill.findMany({
      where: whereClause,
      orderBy: [
        { categoria: 'asc' },
        { nome: 'asc' }
      ]
    })

    return NextResponse.json(skills)
  } catch (error) {
    console.error('Erro ao buscar habilidades:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
