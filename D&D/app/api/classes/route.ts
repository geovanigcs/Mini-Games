import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Buscando classes no banco...')
    const classes = await prisma.characterClass.findMany({
      orderBy: { nome: 'asc' },
    });
    
    console.log(`✅ Encontradas ${classes.length} classes`);


    const classesWithParsedData = classes.map((characterClass: any) => {
      // Função helper para parsing seguro de JSON
      const safeJsonParse = (value: string | null, fallback: any = []) => {
        if (!value) return fallback;
        try {
          return JSON.parse(value);
        } catch {
          // Se não for JSON, tratar como string única ou array de strings
          if (typeof value === 'string') {
            return value.includes(',') ? value.split(',').map(s => s.trim()) : [value];
          }
          return fallback;
        }
      };

      return {
        ...characterClass,
        habilidades_iniciais: safeJsonParse(characterClass.habilidades_iniciais, []),
        armas_permitidas: safeJsonParse(characterClass.armas_permitidas, []),
        escolas_magia: safeJsonParse(characterClass.escolas_magia, []),
        icon_name: characterClass.icone_nome,
        primary_attribute: characterClass.atributo_principal,
        starting_skills: safeJsonParse(characterClass.habilidades_iniciais, []),
        hit_die: characterClass.dado_vida,
        emoji: characterClass.emoji
      };
    });

    return NextResponse.json(classesWithParsedData);
  } catch (error) {
    console.error('Erro ao buscar classes:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
