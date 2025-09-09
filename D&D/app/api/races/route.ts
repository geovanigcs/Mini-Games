import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const races = await prisma.race.findMany({
      orderBy: { nome: 'asc' },
    });


    const racesWithParsedData = races.map((race: any) => ({
      ...race,
      habilidades_especiais: JSON.parse(race.habilidades_especiais || '[]'),
      attribute_bonuses: {
        forca: race.bonus_forca,
        destreza: race.bonus_destreza,
        constituicao: race.bonus_constituicao,
        inteligencia: race.bonus_inteligencia,
        sabedoria: race.bonus_sabedoria,
        carisma: race.bonus_carisma,
      }
    }));

    return NextResponse.json(racesWithParsedData);
  } catch (error) {
    console.error('Erro ao buscar raças:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
