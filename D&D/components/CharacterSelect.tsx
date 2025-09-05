'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Crown, Sword, Shield, Sparkles, Target, Heart, 
  Plus, Eye, ChevronRight, Star, Users, Play,
  Swords, BookOpen, Activity, Settings
} from 'lucide-react';

interface Character {
  id: string;
  nome: string;
  apelido?: string;
  raca: string;
  classe: string;
  nivel: number;
  forca: number;
  destreza: number;
  constituicao: number;
  inteligencia: number;
  sabedoria: number;
  carisma: number;
  idade: number;
  altura: number;
  peso: number;
  corOlhos: string;
  corCabelo: string;
  corPele: string;
  alinhamento: string;
  pontos_vida_atuais: number;
  pontos_vida_maximos: number;
  experiencia: number;
  dinheiro_cobre: number;
  dinheiro_prata: number;
  dinheiro_ouro: number;
  createdAt: string;
  updatedAt: string;
  Race?: {
    nome: string;
    emoji: string;
    bonus_forca?: number;
    bonus_destreza?: number;
    bonus_constituicao?: number;
    bonus_inteligencia?: number;
    bonus_sabedoria?: number;
    bonus_carisma?: number;
  };
  CharacterClass?: {
    nome: string;
    emoji: string;
    icone_nome: string;
    dice_vida: string;
  };
}

interface CharacterSelectProps {
  onBack: () => void;
  onCreateNew: () => void;
  onSelectCharacter: (character: Character) => void;
  user: any;
}

// Sistema completo de raças e classes do D&D dos Pirangueiros
const racesEmojis: { [key: string]: string } = {
  // Povos Livres
  'hobbit': '�',
  'homem': '👤',
  'elfo': '🧝',
  'anao': '🧔',
  'ent': '🌳',
  'dunedain': '🗡️',
  'rohirrim': '🐎',
  'gondoriano': '🏰',
  'beornida': '🐻',
  'homem_do_lago': '🚣',

  // Seres de Luz
  'maiar': '✨',
  'valar': '⭐',
  'istari': '�',

  // Criaturas Sombrias Redimidas
  'orc_redimido': '⚔️',
  'uruk_redimido': '🛡️',

  // Seres Místicos
  'linhagem_draconica': '🐉',
  'elemental_terra': '🗿',
  'elemental_agua': '🌊',
  'elemental_fogo': '�'
};

const classesEmojis: { [key: string]: string } = {
  // Classes de Combate
  'guerreiro': '⚔️',
  'cavaleiro': '🏇',
  'ranger': '🏹',
  'barbaro': '🪓',
  'paladino': '🛡️',

  // Classes Arcanas
  'mago': '🧙',
  'feiticeiro': '✨',
  'bruxo': '🔮',

  // Classes Furtivas
  'ladrao': '🗡️',
  'assassino': '💀',
  'batedor': '👁️',

  // Classes Divinas
  'clerigo': '⛪',
  'druida': '🌿',
  'monk': '🧘',

  // Classes Híbridas
  'bardo': '🎵',
  'artificer': '⚙️',
  'caçador': '🎯',

  // Classes Únicas
  'guardiao': '🏛️',
  'istari': '�',
  'portador': '💍'
};

export default function CharacterSelect({ onBack, onCreateNew, onSelectCharacter, user }: CharacterSelectProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Token não encontrado');
        return;
      }

      const response = await fetch('/api/characters', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCharacters(data.characters || []);
      } else {
        setError('Erro ao carregar personagens');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-stone-900 via-amber-900 to-stone-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <motion.div 
            className="w-20 h-20 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-amber-200 text-xl font-cinzel">
            🏰 Carregando seus heróis...
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-900 to-stone-800 text-amber-100">
      {/* Header */}
      <motion.div 
        className="bg-stone-900/90 border-b border-amber-600/40 p-6"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.button 
            onClick={onBack}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-stone-800/80 hover:bg-amber-600/20 border border-amber-600/30 rounded-xl transition-all duration-300"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
            Sair
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-3xl font-cinzel text-amber-300 flex items-center gap-3 justify-center">
              <Crown className="h-8 w-8" />
              Seus Heróis
            </h1>
            <p className="text-amber-200/80">Olá, <span className="font-bold text-amber-300">{user?.nome}</span>!</p>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              onClick={onCreateNew}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl transition-all duration-300 font-bold"
            >
              <Plus className="h-5 w-5" />
              Novo Herói
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Conteúdo Principal */}
      <div className="max-w-6xl mx-auto p-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-900/50 border border-red-600 rounded-xl text-red-300 text-center"
          >
            ❌ {error}
          </motion.div>
        )}

        {characters.length === 0 ? (
          /* Nenhum personagem */
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-8xl mb-8"
            >
              🎭
            </motion.div>
            
            <h2 className="text-4xl font-cinzel text-amber-300 mb-4">
              Sua Jornada Aguarda
            </h2>
            
            <p className="text-xl text-amber-200 mb-8 max-w-2xl mx-auto">
              Nos confins do Brasil, heróis nascem das escolhas mais simples. 
              Forje seu destino e deixe sua marca no D&D dos Pirangueiros!
            </p>

            <motion.button
              onClick={onCreateNew}
              whileHover={{ 
                scale: 1.1,
                boxShadow: "0 0 40px rgba(34, 197, 94, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 mx-auto px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-2xl text-xl font-bold transition-all duration-300"
            >
              <Sparkles className="h-6 w-6" />
              Criar Primeiro Herói
              <ChevronRight className="h-6 w-6" />
            </motion.button>
          </motion.div>
        ) : (
          /* Lista de Personagens */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-cinzel text-amber-300 mb-8 text-center flex items-center justify-center gap-3">
              <Users className="h-8 w-8" />
              Escolha Seu Herói ({characters.length})
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((character, index) => (
                <motion.div
                  key={character.id}
                  initial={{ scale: 0, rotateY: 180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  transition={{ delay: index * 0.2, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 10,
                    boxShadow: "0 20px 40px rgba(245, 158, 11, 0.3)"
                  }}
                  className="bg-gradient-to-br from-stone-900/90 to-amber-900/30 border border-amber-600/40 rounded-2xl p-6 backdrop-blur-md shadow-2xl cursor-pointer group"
                  onClick={() => onSelectCharacter(character)}
                >
                  {/* Avatar do Personagem */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <motion.div
                        className="w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center text-3xl overflow-hidden"
                        animate={{ 
                          boxShadow: ["0 0 0 0 rgba(245, 158, 11, 0.7)", "0 0 0 15px rgba(245, 158, 11, 0)"]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {character.Race?.emoji || racesEmojis[character.raca] || '🧑'}
                        {(character.CharacterClass?.emoji || classesEmojis[character.classe]) && (
                          <div className="absolute -bottom-2 -right-2 text-2xl bg-stone-800/90 rounded-full p-1">
                            {character.CharacterClass?.emoji || classesEmojis[character.classe]}
                          </div>
                        )}
                      </motion.div>
                      
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute -top-2 -left-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold w-8 h-6 rounded-full flex items-center justify-center"
                      >
                        Nv{character.nivel}
                      </motion.div>
                    </div>
                  </div>

                  {/* Info do Personagem */}
                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-bold text-amber-200 font-cinzel">
                      {character.nome}
                    </h3>
                    {character.apelido && (
                      <p className="text-sm text-amber-400 italic font-medium">
                        "{character.apelido}"
                      </p>
                    )}
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-stone-300">
                      <span className="capitalize bg-stone-800/60 px-2 py-1 rounded">
                        {character.Race?.nome || character.raca}
                      </span>
                      <span>•</span>
                      <span className="capitalize bg-stone-800/60 px-2 py-1 rounded">
                        {character.CharacterClass?.nome || character.classe}
                      </span>
                    </div>

                    {/* Barras de Vida e XP */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Heart className="h-3 w-3 text-red-400" />
                        <div className="flex-1 bg-stone-800 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${(character.pontos_vida_atuais / character.pontos_vida_maximos) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-amber-300 font-medium min-w-12">
                          {character.pontos_vida_atuais}/{character.pontos_vida_maximos}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs">
                        <Star className="h-3 w-3 text-blue-400" />
                        <div className="flex-1 bg-stone-800 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                            style={{ width: `${Math.min((character.experiencia / (character.nivel * 1000)) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-amber-300 font-medium min-w-12">
                          {character.experiencia} XP
                        </span>
                      </div>
                    </div>

                    {/* Dinheiro */}
                    {(character.dinheiro_ouro > 0 || character.dinheiro_prata > 0 || character.dinheiro_cobre > 0) && (
                      <div className="flex items-center justify-center gap-3 text-xs bg-stone-800/40 p-2 rounded-lg">
                        {character.dinheiro_ouro > 0 && (
                          <span className="flex items-center gap-1 text-yellow-400">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                            {character.dinheiro_ouro}
                          </span>
                        )}
                        {character.dinheiro_prata > 0 && (
                          <span className="flex items-center gap-1 text-gray-300">
                            <div className="w-2 h-2 bg-gray-300 rounded-full" />
                            {character.dinheiro_prata}
                          </span>
                        )}
                        {character.dinheiro_cobre > 0 && (
                          <span className="flex items-center gap-1 text-orange-400">
                            <div className="w-2 h-2 bg-orange-400 rounded-full" />
                            {character.dinheiro_cobre}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Hover Effect */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-amber-600/20 to-transparent rounded-2xl flex items-end justify-center p-6"
                  >
                    <div className="flex items-center gap-2 text-white font-bold bg-amber-600/90 px-4 py-2 rounded-lg">
                      <Play className="h-4 w-4" />
                      Jogar
                    </div>
                  </motion.div>
                </motion.div>
              ))}
              
              {/* Botão Criar Novo Personagem */}
              <motion.div
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ delay: characters.length * 0.2, type: "spring" }}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)"
                }}
                className="bg-gradient-to-br from-green-900/50 to-emerald-900/30 border-2 border-dashed border-green-500/50 rounded-2xl p-6 backdrop-blur-md shadow-2xl cursor-pointer group hover:border-green-400"
                onClick={onCreateNew}
              >
                <div className="flex flex-col items-center justify-center h-full min-h-80 text-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mb-6 text-3xl"
                  >
                    <Plus className="h-10 w-10 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-green-300 mb-2">
                    Novo Herói
                  </h3>
                  
                  <p className="text-green-400/80 mb-4">
                    Forje uma nova lenda
                  </p>
                  
                  <div className="flex items-center gap-2 text-green-300 font-semibold group-hover:text-green-200">
                    <Sparkles className="h-5 w-5" />
                    Criar Personagem
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/20 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
