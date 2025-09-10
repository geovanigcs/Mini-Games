'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AvatarEditor from '@/components/AvatarEditor';

interface Character {
  id: string;
  nome: string;
  titulo?: string;
  pseudonimo?: string;
  familia?: string;
  apelido?: string;
  classe: string;
  raca: string;
  // Atributos
  forca: number;
  destreza: number;
  constituicao: number;
  inteligencia: number;
  sabedoria: number;
  carisma: number;
  // Características físicas
  idade: number;
  altura: number;
  peso: number;
  corOlhos: string;
  corCabelo: string;
  corPele: string;
  estilo: string;
  // Sistema de jogo
  nivel: number;
  experiencia: number;
  pontos_vida_atuais: number;
  pontos_vida_maximos: number;
  // Financeiro
  dinheiro_cobre: number;
  dinheiro_prata: number;
  dinheiro_ouro: number;
  // História e personalidade
  alinhamento: string;
  origem: string;
  motivacao: string;
  traumas?: string;
  inimigos?: string;
  segredo?: string;
  personalidade?: string;
  tracos?: string;
  ideais?: string;
  vinculos?: string;
  defeitos?: string;
  // Equipamentos
  armas?: string;
  armadura?: string;
  itensEspeciais?: string;
  proficiencias?: string;
  magias?: string;
  poderes?: string;
  idiomas?: string;
  conhecimentos?: string;
  // Meta
  avatar_url?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CharacterDetailsPage({ params }: { params: { id: string } }) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCharacter();
  }, []);

  const fetchCharacter = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/characters/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Personagem não encontrado');
        }
        throw new Error('Erro ao carregar personagem');
      }

      const data = await response.json();
      setCharacter(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const getAttributeModifier = (attribute: number) => {
    const modifier = Math.floor((attribute - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const handleAvatarSave = async (newAvatarUrl: string) => {
    if (!character) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/characters/${character.id}/avatar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatar_url: newAvatarUrl })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar avatar');
      }

      const result = await response.json();
      
      // Atualizar estado local
      setCharacter(prev => prev ? { ...prev, avatar_url: newAvatarUrl } : prev);
      setShowAvatarEditor(false);
      
      // Feedback visual
      alert('✅ Avatar atualizado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao atualizar avatar:', error);
      alert('❌ Erro ao atualizar avatar. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-amber-200 text-lg">Carregando personagem...</p>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-200 mb-2">Erro</h2>
          <p className="text-red-300 mb-6">{error}</p>
          <Link
            href="/characters"
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            ← Voltar aos Personagens
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/characters"
            className="inline-flex items-center text-amber-300 hover:text-amber-200 mb-4"
          >
            ← Voltar aos Personagens
          </Link>
          
          <div className="flex justify-center mb-4 relative">
            <div className="relative group">
              {character.avatar_url ? (
                <img
                  src={character.avatar_url}
                  alt={character.nome}
                  className="w-32 h-32 rounded-full object-cover border-4 border-amber-400 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-5xl border-4 border-amber-400 shadow-lg">
                  ⚔️
                </div>
              )}
              
              {/* Botão de editar avatar */}
              <button
                onClick={() => setShowAvatarEditor(true)}
                className="absolute -bottom-2 -right-2 bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 opacity-0 group-hover:opacity-100"
                title="Editar Avatar"
              >
                ✏️
              </button>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-amber-200 mb-2">{character.nome}</h1>
          {character.titulo && (
            <p className="text-xl text-amber-300 mb-1">📜 {character.titulo}</p>
          )}
          {character.pseudonimo && (
            <p className="text-lg text-amber-400">🎭 "{character.pseudonimo}"</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-amber-500/30 p-6">
            <h2 className="text-2xl font-bold text-amber-200 mb-4 flex items-center gap-2">
              📋 Informações Básicas
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-amber-400 font-semibold">Raça:</span>
                  <p className="text-amber-200 capitalize">{character.raca}</p>
                </div>
                <div>
                  <span className="text-amber-400 font-semibold">Classe:</span>
                  <p className="text-amber-200 capitalize">{character.classe}</p>
                </div>
              </div>
              
              {character.familia && (
                <div>
                  <span className="text-amber-400 font-semibold">Família:</span>
                  <p className="text-amber-200">{character.familia}</p>
                </div>
              )}
              
              {character.apelido && (
                <div>
                  <span className="text-amber-400 font-semibold">Apelido:</span>
                  <p className="text-amber-200">{character.apelido}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-amber-400 font-semibold">Idade:</span>
                  <p className="text-amber-200">{character.idade} anos</p>
                </div>
                <div>
                  <span className="text-amber-400 font-semibold">Alinhamento:</span>
                  <p className="text-amber-200">{character.alinhamento}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Atributos */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-amber-500/30 p-6">
            <h2 className="text-2xl font-bold text-amber-200 mb-4 flex items-center gap-2">
              💪 Atributos
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 rounded-lg p-3 text-center">
                <div className="text-red-400 font-bold text-lg">Força</div>
                <div className="text-red-200 text-xl">{character.forca}</div>
                <div className="text-red-300 text-sm">{getAttributeModifier(character.forca)}</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3 text-center">
                <div className="text-green-400 font-bold text-lg">Destreza</div>
                <div className="text-green-200 text-xl">{character.destreza}</div>
                <div className="text-green-300 text-sm">{getAttributeModifier(character.destreza)}</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3 text-center">
                <div className="text-orange-400 font-bold text-lg">Constituição</div>
                <div className="text-orange-200 text-xl">{character.constituicao}</div>
                <div className="text-orange-300 text-sm">{getAttributeModifier(character.constituicao)}</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3 text-center">
                <div className="text-blue-400 font-bold text-lg">Inteligência</div>
                <div className="text-blue-200 text-xl">{character.inteligencia}</div>
                <div className="text-blue-300 text-sm">{getAttributeModifier(character.inteligencia)}</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3 text-center">
                <div className="text-purple-400 font-bold text-lg">Sabedoria</div>
                <div className="text-purple-200 text-xl">{character.sabedoria}</div>
                <div className="text-purple-300 text-sm">{getAttributeModifier(character.sabedoria)}</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3 text-center">
                <div className="text-pink-400 font-bold text-lg">Carisma</div>
                <div className="text-pink-200 text-xl">{character.carisma}</div>
                <div className="text-pink-300 text-sm">{getAttributeModifier(character.carisma)}</div>
              </div>
            </div>
          </div>

          {/* Status de Jogo */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-amber-500/30 p-6">
            <h2 className="text-2xl font-bold text-amber-200 mb-4 flex items-center gap-2">
              ⚡ Status de Jogo
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 rounded-lg p-3 text-center">
                  <div className="text-yellow-400 font-bold">Nível</div>
                  <div className="text-yellow-200 text-2xl">{character.nivel}</div>
                </div>
                <div className="bg-black/20 rounded-lg p-3 text-center">
                  <div className="text-blue-400 font-bold">Experiência</div>
                  <div className="text-blue-200 text-xl">{character.experiencia}</div>
                </div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-red-400 font-bold mb-2">Pontos de Vida</div>
                <div className="flex items-center justify-between">
                  <span className="text-red-200 text-xl">
                    {character.pontos_vida_atuais} / {character.pontos_vida_maximos}
                  </span>
                  <div className="w-32 bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-red-500 h-3 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.max(0, (character.pontos_vida_atuais / character.pontos_vida_maximos) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-amber-400 font-bold mb-2">💰 Dinheiro</div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-yellow-600/20 rounded p-2 text-center">
                    <div className="text-yellow-400">Ouro</div>
                    <div className="text-yellow-200 font-bold">{character.dinheiro_ouro}</div>
                  </div>
                  <div className="bg-gray-600/20 rounded p-2 text-center">
                    <div className="text-gray-400">Prata</div>
                    <div className="text-gray-200 font-bold">{character.dinheiro_prata}</div>
                  </div>
                  <div className="bg-orange-600/20 rounded p-2 text-center">
                    <div className="text-orange-400">Cobre</div>
                    <div className="text-orange-200 font-bold">{character.dinheiro_cobre}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Características Físicas */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-amber-500/30 p-6">
            <h2 className="text-2xl font-bold text-amber-200 mb-4 flex items-center gap-2">
              👤 Aparência
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-amber-400 font-semibold">Altura:</span>
                  <p className="text-amber-200">{character.altura} cm</p>
                </div>
                <div>
                  <span className="text-amber-400 font-semibold">Peso:</span>
                  <p className="text-amber-200">{character.peso} kg</p>
                </div>
              </div>
              
              <div>
                <span className="text-amber-400 font-semibold">Olhos:</span>
                <p className="text-amber-200">{character.corOlhos}</p>
              </div>
              
              <div>
                <span className="text-amber-400 font-semibold">Cabelo:</span>
                <p className="text-amber-200">{character.corCabelo}</p>
              </div>
              
              <div>
                <span className="text-amber-400 font-semibold">Pele:</span>
                <p className="text-amber-200">{character.corPele}</p>
              </div>
              
              <div>
                <span className="text-amber-400 font-semibold">Estilo:</span>
                <p className="text-amber-200">{character.estilo}</p>
              </div>
            </div>
          </div>
        </div>

        {/* História e Personalidade - Width completo */}
        <div className="mt-6 bg-black/30 backdrop-blur-sm rounded-xl border border-amber-500/30 p-6">
          <h2 className="text-2xl font-bold text-amber-200 mb-4 flex items-center gap-2">
            📚 História e Personalidade
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {character.origem && (
              <div>
                <span className="text-amber-400 font-semibold">Origem:</span>
                <p className="text-amber-200 mt-1">{character.origem}</p>
              </div>
            )}
            
            {character.motivacao && (
              <div>
                <span className="text-amber-400 font-semibold">Motivação:</span>
                <p className="text-amber-200 mt-1">{character.motivacao}</p>
              </div>
            )}
            
            {character.personalidade && (
              <div>
                <span className="text-amber-400 font-semibold">Personalidade:</span>
                <p className="text-amber-200 mt-1">{character.personalidade}</p>
              </div>
            )}
            
            {character.ideais && (
              <div>
                <span className="text-amber-400 font-semibold">Ideais:</span>
                <p className="text-amber-200 mt-1">{character.ideais}</p>
              </div>
            )}
            
            {character.vinculos && (
              <div>
                <span className="text-amber-400 font-semibold">Vínculos:</span>
                <p className="text-amber-200 mt-1">{character.vinculos}</p>
              </div>
            )}
            
            {character.defeitos && (
              <div>
                <span className="text-amber-400 font-semibold">Defeitos:</span>
                <p className="text-amber-200 mt-1">{character.defeitos}</p>
              </div>
            )}

            {character.segredo && (
              <div>
                <span className="text-red-400 font-semibold">🤫 Segredo:</span>
                <p className="text-red-200 mt-1">{character.segredo}</p>
              </div>
            )}
          </div>
        </div>

        {/* Equipamentos e Habilidades */}
        {(character.armas || character.armadura || character.magias || character.proficiencias) && (
          <div className="mt-6 bg-black/30 backdrop-blur-sm rounded-xl border border-amber-500/30 p-6">
            <h2 className="text-2xl font-bold text-amber-200 mb-4 flex items-center gap-2">
              ⚔️ Equipamentos e Habilidades
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {character.armas && (
                <div>
                  <span className="text-amber-400 font-semibold">Armas:</span>
                  <p className="text-amber-200 mt-1">{character.armas}</p>
                </div>
              )}
              
              {character.armadura && (
                <div>
                  <span className="text-amber-400 font-semibold">Armadura:</span>
                  <p className="text-amber-200 mt-1">{character.armadura}</p>
                </div>
              )}
              
              {character.magias && (
                <div>
                  <span className="text-purple-400 font-semibold">Magias:</span>
                  <p className="text-purple-200 mt-1">{character.magias}</p>
                </div>
              )}
              
              {character.proficiencias && (
                <div>
                  <span className="text-green-400 font-semibold">Proficiências:</span>
                  <p className="text-green-200 mt-1">{character.proficiencias}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Data de criação */}
        <div className="mt-6 text-center text-amber-400 text-sm">
          Personagem criado em {new Date(character.createdAt).toLocaleDateString('pt-BR')} às {new Date(character.createdAt).toLocaleTimeString('pt-BR')}
        </div>

        {/* Avatar Editor Modal */}
        {showAvatarEditor && (
          <AvatarEditor
            currentAvatarUrl={character.avatar_url || ''}
            characterName={character.nome}
            onSave={handleAvatarSave}
            onCancel={() => setShowAvatarEditor(false)}
            isCreation={false}
          />
        )}
      </div>
    </div>
  );
}
