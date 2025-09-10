import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// GET - Buscar habilidades de um personagem
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const characterId = searchParams.get('characterId')

    if (!characterId) {
      return NextResponse.json(
        { error: 'ID do personagem é obrigatório' },
        { status: 400 }
      )
    }

    const characterSkills = await prisma.characterSkill.findMany({
      where: { characterId },
      include: {
        skill: true
      },
      orderBy: [
        { skill: { categoria: 'asc' } },
        { maestria: 'desc' }
      ]
    })

    return NextResponse.json(characterSkills)
  } catch (error) {
    console.error('Erro ao buscar habilidades do personagem:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Adicionar habilidade a um personagem
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticação necessário' },
        { status: 401 }
      )
    }

    let userId
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      userId = decoded.userId
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const { characterId, skillId, maestria = 1 } = await request.json()

    if (!characterId || !skillId) {
      return NextResponse.json(
        { error: 'ID do personagem e da habilidade são obrigatórios' },
        { status: 400 }
      )
    }

    if (maestria < 1 || maestria > 100) {
      return NextResponse.json(
        { error: 'Maestria deve estar entre 1 e 100' },
        { status: 400 }
      )
    }

    // Verificar se o personagem pertence ao usuário
    const character = await prisma.character.findFirst({
      where: {
        id: characterId,
        userId: userId
      }
    })

    if (!character) {
      return NextResponse.json(
        { error: 'Personagem não encontrado ou sem permissão' },
        { status: 404 }
      )
    }

    // Verificar se a habilidade existe
    const skill = await prisma.skill.findUnique({
      where: { id: skillId }
    })

    if (!skill) {
      return NextResponse.json(
        { error: 'Habilidade não encontrada' },
        { status: 404 }
      )
    }

    // Criar ou atualizar a habilidade do personagem
    const characterSkill = await prisma.characterSkill.upsert({
      where: {
        characterId_skillId: {
          characterId,
          skillId
        }
      },
      update: {
        maestria,
        experiencia: maestria * 10 // Experiência baseada na maestria
      },
      create: {
        characterId,
        skillId,
        maestria,
        experiencia: maestria * 10
      },
      include: {
        skill: true
      }
    })

    return NextResponse.json(characterSkill)
  } catch (error) {
    console.error('Erro ao adicionar habilidade:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar maestria de uma habilidade
export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticação necessário' },
        { status: 401 }
      )
    }

    let userId
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      userId = decoded.userId
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const { characterSkillId, maestria, experiencia } = await request.json()

    if (!characterSkillId) {
      return NextResponse.json(
        { error: 'ID da habilidade do personagem é obrigatório' },
        { status: 400 }
      )
    }

    if (maestria && (maestria < 1 || maestria > 100)) {
      return NextResponse.json(
        { error: 'Maestria deve estar entre 1 e 100' },
        { status: 400 }
      )
    }

    // Verificar se a habilidade pertence a um personagem do usuário
    const characterSkill = await prisma.characterSkill.findUnique({
      where: { id: characterSkillId },
      include: {
        character: true,
        skill: true
      }
    })

    if (!characterSkill || characterSkill.character.userId !== userId) {
      return NextResponse.json(
        { error: 'Habilidade não encontrada ou sem permissão' },
        { status: 404 }
      )
    }

    const updatedCharacterSkill = await prisma.characterSkill.update({
      where: { id: characterSkillId },
      data: {
        ...(maestria && { maestria }),
        ...(experiencia && { experiencia })
      },
      include: {
        skill: true
      }
    })

    return NextResponse.json(updatedCharacterSkill)
  } catch (error) {
    console.error('Erro ao atualizar habilidade:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Remover habilidade de um personagem
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticação necessário' },
        { status: 401 }
      )
    }

    let userId
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      userId = decoded.userId
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const characterSkillId = searchParams.get('characterSkillId')

    if (!characterSkillId) {
      return NextResponse.json(
        { error: 'ID da habilidade do personagem é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a habilidade pertence a um personagem do usuário
    const characterSkill = await prisma.characterSkill.findUnique({
      where: { id: characterSkillId },
      include: {
        character: true
      }
    })

    if (!characterSkill || characterSkill.character.userId !== userId) {
      return NextResponse.json(
        { error: 'Habilidade não encontrada ou sem permissão' },
        { status: 404 }
      )
    }

    await prisma.characterSkill.delete({
      where: { id: characterSkillId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao remover habilidade:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
