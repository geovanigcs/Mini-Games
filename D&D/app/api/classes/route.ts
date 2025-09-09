import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const classes = await prisma.characterClass.findMany({
      orderBy: { nome: 'asc' },
    });


    const classesWithParsedData = classes.map((characterClass: any) => ({
      ...characterClass,
      habilidades_iniciais: JSON.parse(characterClass.habilidades_iniciais || '[]'),
      armas_permitidas: JSON.parse(characterClass.armas_permitidas || '[]'),
      escolas_magia: characterClass.escolas_magia ? JSON.parse(characterClass.escolas_magia) : [],
      icon_name: characterClass.icone_nome,
      primary_attribute: characterClass.atributo_principal,
      starting_skills: JSON.parse(characterClass.habilidades_iniciais || '[]'),
      hit_die: characterClass.dado_vida,
    }));

    return NextResponse.json(classesWithParsedData);
  } catch (error) {
    console.error('Erro ao buscar classes:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
