'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Character {
  id: string;
  nome: string;
  titulo?: string;
  pseudonimo?: string;
  classe: string;
  raca: string;
  nivel: number;
  pontos_vida_atuais: number;
  pontos_vida_maximos: number;
  avatar_url?: string;
  createdAt: string;
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/characters', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar personagens');
      }

      const data = await response.json();
      setCharacters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const getClassEmoji = (classe: string) => {
    const classEmojis: Record<string, string> = {
      'guerreiro': '⚔️',
      'mago': '🔮',
      'ladino': '🗡️',
      'clerigo': '✝️',
      'bardo': '🎵',
      'ranger': '🏹',
      'paladino': '🛡️',
      'feiticeiro': '✨',
      'bruxo': '🌙',
      'druida': '🌿',
      'barbaro': '🪓',
      'monge': '👊'
    };
    return classEmojis[classe] || '⚔️';
  };

  const getRaceEmoji = (raca: string) => {
    const raceEmojis: Record<string, string> = {
      'humano': '👤',
      'elfo': '🧝',
      'anao': '🧔',
      'halfling': '🍀',
      'orc': '👹'
    };
    return raceEmojis[raca] || '👤';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-amber-200 text-lg">Carregando personagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 p-4">
      <div className="max-w-6xl mx-auto">

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Link
            href="/character/create-steps"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            ➕ Criar Novo Personagem
          </Link>
          <Link
            href="/"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            🏠 Voltar ao Início
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            <p>❌ {error}</p>
          </div>
        )}

        {/* Characters Grid */}
        {characters.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🗡️</div>
            <h2 className="text-2xl font-bold text-amber-200 mb-2">
              Nenhum personagem criado ainda
            </h2>
            <p className="text-amber-300 mb-6">
              Que tal criar seu primeiro herói para começar sua jornada?
            </p>
            <Link
              href="/character/create-steps"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg inline-block"
            >
              ✨ Criar Primeiro Personagem
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <div
                key={character.id}
                className="bg-black/30 backdrop-blur-sm rounded-xl border border-amber-500/30 p-6 hover:border-amber-400/50 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  {character.avatar_url ? (
                    <img
                      src={character.avatar_url}
                      alt={character.nome}
                      className="w-20 h-20 rounded-full object-cover border-2 border-amber-400"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl">
                      {getClassEmoji(character.classe)}
                    </div>
                  )}
                </div>

                {/* Character Info */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-amber-200 mb-1">
                    {character.nome}
                  </h3>
                  
                  {character.titulo && (
                    <p className="text-amber-300 text-sm mb-1">
                      📜 {character.titulo}
                    </p>
                  )}
                  
                  {character.pseudonimo && (
                    <p className="text-amber-300 text-sm mb-3">
                      🎭 "{character.pseudonimo}"
                    </p>
                  )}

                  <div className="flex justify-center items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-xl">{getRaceEmoji(character.raca)}</span>
                      <span className="text-amber-300 text-sm capitalize">{character.raca}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xl">{getClassEmoji(character.classe)}</span>
                      <span className="text-amber-300 text-sm capitalize">{character.classe}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="bg-black/30 rounded-lg p-2">
                      <div className="text-amber-400 font-semibold">Nível</div>
                      <div className="text-amber-200">{character.nivel}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-2">
                      <div className="text-red-400 font-semibold">HP</div>
                      <div className="text-red-200">
                        {character.pontos_vida_atuais}/{character.pontos_vida_maximos}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-amber-400 mb-4">
                    Criado em {new Date(character.createdAt).toLocaleDateString('pt-BR')}
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/characters/${character.id}`}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-md inline-block text-center"
                  >
                    👁️ Ver Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
