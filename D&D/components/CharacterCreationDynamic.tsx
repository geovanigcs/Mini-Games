'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Crown, Sword, Shield, Sparkles, Target, Heart, 
  Music, Zap, Leaf, Bolt, Hand, Eye, ChevronLeft, ChevronRight,
  Dice6, Star, BookOpen, Palette, Scroll, Swords, Users,
  Wand2, ShieldCheck, Activity, Brain, Eye as EyeIcon
} from 'lucide-react';

interface Race {
  id: string;
  nome: string;
  descricao: string;
  emoji: string;
  habilidades_especiais: string[];
  attribute_bonuses: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  altura_media_cm: number;
  peso_medio_kg: number;
  expectativa_vida: number;
}

interface CharacterClass {
  id: string;
  nome: string;
  descricao: string;
  emoji: string;
  icon_name: string;
  primary_attribute: string;
  starting_skills: string[];
  hit_die: number;
}

interface CharacterCreationProps {
  onBack: () => void;
  onComplete: (character: any) => void;
  user: any;
}

const iconMap = {
  sword: Sword,
  target: Target,
  sparkles: Sparkles,
  'eye-off': Eye,
  heart: Heart,
  shield: Shield,
  music: Music,
  zap: Zap,
  leaf: Leaf,
  bolt: Bolt,
  hand: Hand
};

const attributeIcons = {
  forca: Activity,
  destreza: Zap,
  constituicao: ShieldCheck,
  inteligencia: Brain,
  sabedoria: EyeIcon,
  carisma: Star
};

const attributeNames = {
  forca: 'Força',
  destreza: 'Destreza',
  constituicao: 'Constituição',
  inteligencia: 'Inteligência',
  sabedoria: 'Sabedoria',
  carisma: 'Carisma'
};

const alinhamentos = [
  { id: 'leal_bom', nome: 'Leal e Bom', emoji: '😇', cor: 'text-blue-400' },
  { id: 'neutro_bom', nome: 'Neutro e Bom', emoji: '😊', cor: 'text-green-400' },
  { id: 'caotico_bom', nome: 'Caótico e Bom', emoji: '😄', cor: 'text-yellow-400' },
  { id: 'leal_neutro', nome: 'Leal e Neutro', emoji: '🤖', cor: 'text-gray-400' },
  { id: 'neutro_puro', nome: 'Neutro Puro', emoji: '😐', cor: 'text-stone-400' },
  { id: 'caotico_neutro', nome: 'Caótico e Neutro', emoji: '🤪', cor: 'text-purple-400' },
  { id: 'leal_mal', nome: 'Leal e Mal', emoji: '😈', cor: 'text-red-600' },
  { id: 'neutro_mal', nome: 'Neutro e Mal', emoji: '💀', cor: 'text-orange-600' },
  { id: 'caotico_mal', nome: 'Caótico e Mal', emoji: '👹', cor: 'text-red-700' }
];

const coresOlhos = ['Azul', 'Verde', 'Castanho', 'Âmbar', 'Cinza', 'Violeta', 'Dourado', 'Negro'];
const coresCabelo = ['Loiro', 'Castanho', 'Negro', 'Ruivo', 'Grisalho', 'Branco', 'Platinado'];
const coresPele = ['Pálida', 'Clara', 'Morena', 'Escura', 'Bronzeada', 'Dourada', 'Acinzentada'];

export default function CharacterCreation({ onBack, onComplete, user }: CharacterCreationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [races, setRaces] = useState<Race[]>([]);
  const [classes, setClasses] = useState<CharacterClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [character, setCharacter] = useState({
    nome: '',
    apelido: '',
    raca: '',
    classe: '',
    forca: 10,
    destreza: 10,
    constituicao: 10,
    inteligencia: 10,
    sabedoria: 10,
    carisma: 10,
    idade: 25,
    altura: 175,
    peso: 70,
    corOlhos: '',
    corCabelo: '',
    corPele: '',
    estilo: '',
    alinhamento: '',
    origem: '',
    motivacao: '',
    traumas: '',
    inimigos: '',
    segredo: '',
    armas: '',
    armadura: '',
    itensEspeciais: '',
    proficiencias: '',
    magias: '',
    poderes: '',
    idiomas: '',
    conhecimentos: '',
    personalidade: '',
    tracos: '',
    ideais: '',
    vinculos: '',
    defeitos: ''
  });

  const [availablePoints, setAvailablePoints] = useState(27);

  const etapas = [
    { nome: 'Identidade', icone: User, descricao: 'Nome e origem' },
    { nome: 'Raça & Classe', icone: Users, descricao: 'Escolha seu tipo' },
    { nome: 'Atributos', icone: Activity, descricao: 'Distribua pontos' },
    { nome: 'Aparência', icone: Palette, descricao: 'Como você parece' },
    { nome: 'Personalidade', icone: Heart, descricao: 'Quem você é' },
    { nome: 'História', icone: BookOpen, descricao: 'Sua jornada' },
    { nome: 'Equipamentos', icone: Swords, descricao: 'Suas posses' },
    { nome: 'Finalizar', icone: Star, descricao: 'Revisar tudo' }
  ];

  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    try {
      setLoading(true);
      
      const [racesResponse, classesResponse] = await Promise.all([
        fetch('/api/races'),
        fetch('/api/classes')
      ]);

      if (!racesResponse.ok || !classesResponse.ok) {
        throw new Error('Erro ao carregar dados');
      }

      const racesData = await racesResponse.json();
      const classesData = await classesResponse.json();
      
      setRaces(racesData);
      setClasses(classesData);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar dados do jogo. Verifique a conexão.');
      setLoading(false);
    }
  };

  const selectedRace = races.find(r => r.id === character.raca);
  const selectedClass = classes.find(c => c.id === character.classe);

  const rollAttributes = () => {
    const rollStat = () => {
      const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
      rolls.sort((a, b) => b - a);
      return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
    };

    setCharacter(prev => ({
      ...prev,
      forca: rollStat(),
      destreza: rollStat(),
      constituicao: rollStat(),
      inteligencia: rollStat(),
      sabedoria: rollStat(),
      carisma: rollStat()
    }));
    
    setAvailablePoints(0); // Reset points when rolling
  };

  const updateAttribute = (attribute: string, value: number) => {
    const currentValue = character[attribute as keyof typeof character] as number;
    const diff = value - currentValue;
    
    if (availablePoints - diff >= 0 && value >= 8 && value <= 15) {
      setCharacter(prev => ({ ...prev, [attribute]: value }));
      setAvailablePoints(prev => prev - diff);
    }
  };

  const createCharacter = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token de autorização não encontrado');
        return;
      }

      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(character),
      });

      if (response.ok) {
        const result = await response.json();
        onComplete(result.character);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao criar personagem');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    } finally {
      setIsCreating(false);
    }
  };

  const nextStep = () => {
    if (currentStep < etapas.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
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
          <motion.p 
            className="text-amber-200 text-xl font-cinzel"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨ Invocando os dados dos reinos...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-900 to-stone-800 text-amber-100">
      {/* Header épico */}
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
            <ChevronLeft className="h-5 w-5" />
            <span className="font-semibold">Voltar</span>
          </motion.button>
          
          <motion.div 
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-cinzel text-amber-300 flex items-center gap-3 justify-center">
              🎭 Forje seu Destino
            </h1>
            <p className="text-amber-200/80">Olá, <span className="font-bold text-amber-300">{user?.nome}</span>!</p>
          </motion.div>
          
          <div className="text-right">
            <div className="text-sm font-semibold text-amber-300">
              Etapa {currentStep + 1} de {etapas.length}
            </div>
            <div className="text-xs text-amber-400">
              {etapas[currentStep].descricao}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Barra de progresso animada */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          {etapas.map((etapa, index) => {
            const IconComponent = etapa.icone;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <motion.div 
                key={index} 
                className="flex flex-col items-center relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div 
                  className={`
                    w-14 h-14 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-500
                    ${isCompleted 
                      ? 'bg-green-600 border-green-500 text-white' 
                      : isActive 
                        ? 'bg-amber-600 border-amber-500 text-white animate-pulse' 
                        : 'bg-stone-800 border-stone-600 text-stone-400'
                    }
                  `}
                  whileHover={{ scale: 1.1 }}
                  animate={isActive ? { 
                    boxShadow: ["0 0 0 0 rgba(245, 158, 11, 0.7)", "0 0 0 20px rgba(245, 158, 11, 0)"],
                  } : {}}
                  transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                >
                  <IconComponent className="h-6 w-6" />
                </motion.div>
                <div className={`
                  text-xs font-medium text-center max-w-16
                  ${isActive ? 'text-amber-200' : isCompleted ? 'text-green-300' : 'text-stone-500'}
                `}>
                  {etapa.nome}
                </div>
                
                {index < etapas.length - 1 && (
                  <motion.div 
                    className={`
                      absolute top-7 left-16 w-20 h-1 
                      ${isCompleted ? 'bg-green-500' : 'bg-stone-700'}
                    `}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Conteúdo da etapa */}
      <div className="max-w-6xl mx-auto px-6 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100, rotateY: 45 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -100, rotateY: -45 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="bg-gradient-to-br from-stone-900/90 to-amber-900/30 border border-amber-600/40 rounded-2xl p-8 backdrop-blur-md shadow-2xl"
          >
            {/* Etapa 0: Identidade */}
            {currentStep === 0 && (
              <div className="space-y-8">
                <motion.h2 
                  className="text-4xl font-cinzel text-amber-300 mb-8 text-center flex items-center justify-center gap-3"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <User className="h-10 w-10 animate-pulse" />
                  Quem é Você?
                </motion.h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="flex text-amber-200 mb-3 font-bold text-lg items-center gap-2">
                      <Crown className="h-5 w-5" />
                      Nome do Herói *
                    </label>
                    <input
                      type="text"
                      value={character.nome}
                      onChange={(e) => setCharacter(prev => ({ ...prev, nome: e.target.value }))}
                      className="w-full p-4 bg-stone-800/80 border-2 border-stone-600 rounded-xl text-amber-100 focus:border-amber-500 focus:outline-none transition-all duration-300 text-lg font-semibold"
                      placeholder="Ex: Aragorn, Legolas, Galadriel..."
                    />
                    <p className="text-amber-300/70 text-sm mt-2">O nome que ecoará pelos reinos...</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="flex text-amber-200 mb-3 font-bold text-lg items-center gap-2">
                      <Scroll className="h-5 w-5" />
                      Título ou Apelido
                    </label>
                    <input
                      type="text"
                      value={character.apelido}
                      onChange={(e) => setCharacter(prev => ({ ...prev, apelido: e.target.value }))}
                      className="w-full p-4 bg-stone-800/80 border-2 border-stone-600 rounded-xl text-amber-100 focus:border-amber-500 focus:outline-none transition-all duration-300 text-lg"
                      placeholder="Ex: O Montanhês, Senhor dos Cavalos..."
                    />
                    <p className="text-amber-300/70 text-sm mt-2">Como você será conhecido?</p>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="flex text-amber-200 mb-3 font-bold text-lg items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Origem *
                  </label>
                  <textarea
                    value={character.origem}
                    onChange={(e) => setCharacter(prev => ({ ...prev, origem: e.target.value }))}
                    className="w-full p-4 bg-stone-800/80 border-2 border-stone-600 rounded-xl text-amber-100 focus:border-amber-500 focus:outline-none transition-all duration-300 min-h-24 resize-none"
                    placeholder="De onde você vem? Uma vila pacata, uma fortaleza majestosa, ou talvez das profundezas de uma floresta antiga..."
                  />
                </motion.div>
              </div>
            )}

            {/* Etapa 1: Raça & Classe */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <motion.h2 
                  className="text-4xl font-cinzel text-amber-300 text-center flex items-center justify-center gap-3"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Users className="h-10 w-10 animate-bounce" />
                  Escolha sua Essência
                </motion.h2>
                
                {/* Seleção de Raça */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-amber-200 mb-6 flex items-center gap-2">
                    <span className="text-3xl">🧬</span>
                    Raças do D&D dos Pirangueiros
                  </h3>
                  <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {races.map((race, index) => (
                      <motion.div
                        key={race.id}
                        initial={{ scale: 0, rotateY: 180 }}
                        animate={{ scale: 1, rotateY: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ 
                          scale: 1.08, 
                          rotateY: 10,
                          boxShadow: "0 20px 40px rgba(245, 158, 11, 0.3)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCharacter(prev => ({ ...prev, raca: race.id }))}
                        className={`
                          relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-500 transform-gpu
                          ${character.raca === race.id 
                            ? 'bg-gradient-to-br from-amber-600/30 to-orange-600/20 border-amber-400 shadow-xl shadow-amber-500/30' 
                            : 'bg-stone-800/60 border-stone-600 hover:border-amber-500/70 hover:bg-amber-600/10'
                          }
                        `}
                      >
                        <motion.div 
                          className="text-6xl mb-4 text-center"
                          animate={character.raca === race.id ? { 
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0] 
                          } : {}}
                          transition={{ duration: 2, repeat: character.raca === race.id ? Infinity : 0 }}
                        >
                          {race.emoji}
                        </motion.div>
                        <h4 className="font-bold text-amber-200 text-center text-lg mb-2">{race.nome}</h4>
                        <p className="text-sm text-stone-300 text-center mb-3 line-clamp-2">{race.descricao}</p>
                        <div className="text-xs text-amber-400 text-center">
                          <div>Vida: {race.expectativa_vida} anos</div>
                          <div className="mt-1 text-xs">
                            {race.habilidades_especiais?.slice(0, 2).join(', ')}
                          </div>
                        </div>
                        
                        {character.raca === race.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            ✓
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Seleção de Classe */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-2xl font-bold text-amber-200 mb-6 flex items-center gap-2">
                    <span className="text-3xl">⚔️</span>
                    Caminhos de Poder
                  </h3>
                  <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {classes.map((charClass, index) => {
                      const IconComponent = iconMap[charClass.icon_name as keyof typeof iconMap] || Sword;
                      return (
                        <motion.div
                          key={charClass.id}
                          initial={{ scale: 0, rotateX: 180 }}
                          animate={{ scale: 1, rotateX: 0 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                          whileHover={{ 
                            scale: 1.08, 
                            rotateX: 10,
                            boxShadow: "0 20px 40px rgba(245, 158, 11, 0.3)"
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCharacter(prev => ({ ...prev, classe: charClass.id }))}
                          className={`
                            relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-500 transform-gpu
                            ${character.classe === charClass.id 
                              ? 'bg-gradient-to-br from-amber-600/30 to-orange-600/20 border-amber-400 shadow-xl shadow-amber-500/30' 
                              : 'bg-stone-800/60 border-stone-600 hover:border-amber-500/70 hover:bg-amber-600/10'
                            }
                          `}
                        >
                          <motion.div 
                            className="flex items-center justify-center gap-2 mb-4"
                            animate={character.classe === charClass.id ? { 
                              rotateY: [0, 360],
                            } : {}}
                            transition={{ duration: 3, repeat: character.classe === charClass.id ? Infinity : 0 }}
                          >
                            <span className="text-4xl">{charClass.emoji}</span>
                            <IconComponent className="h-8 w-8 text-amber-400" />
                          </motion.div>
                          <h4 className="font-bold text-amber-200 text-center text-lg mb-2">{charClass.nome}</h4>
                          <p className="text-sm text-stone-300 text-center mb-3 line-clamp-2">{charClass.descricao}</p>
                          <div className="text-xs text-amber-400 text-center">
                            <div>Dado de Vida: d{charClass.hit_die}</div>
                            <div>Atributo: {attributeNames[charClass.primary_attribute as keyof typeof attributeNames]}</div>
                          </div>
                          
                          {character.classe === charClass.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                            >
                              ✓
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Etapa 2: Atributos */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <motion.h2 
                    className="text-4xl font-cinzel text-amber-300 flex items-center gap-3"
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Activity className="h-10 w-10 animate-pulse" />
                    Forje seus Atributos
                  </motion.h2>
                  <div className="flex items-center gap-6">
                    <motion.div 
                      className="text-amber-200 text-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="text-sm font-semibold">Pontos Restantes</div>
                      <div className="text-3xl font-bold text-amber-400">{availablePoints}</div>
                    </motion.div>
                    <motion.button 
                      onClick={rollAttributes}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      whileTap={{ scale: 0.95, rotate: -5 }}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl transition-all duration-300 font-bold"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatType: "loop" }}
                      >
                        <Dice6 className="h-5 w-5" />
                      </motion.div>
                      Rolar Dados
                    </motion.button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'].map((attr, index) => {
                    const value = character[attr as keyof typeof character] as number;
                    const bonus = selectedRace?.attribute_bonuses?.[attr === 'forca' ? 'strength' : 
                                  attr === 'destreza' ? 'dexterity' :
                                  attr === 'constituicao' ? 'constitution' :
                                  attr === 'inteligencia' ? 'intelligence' :
                                  attr === 'sabedoria' ? 'wisdom' : 'charisma'] || 0;
                    const finalValue = value + bonus;
                    const modifier = Math.floor((finalValue - 10) / 2);
                    const IconComponent = attributeIcons[attr as keyof typeof attributeIcons];
                    
                    return (
                      <motion.div 
                        key={attr} 
                        className="bg-gradient-to-br from-stone-800/60 to-amber-800/20 border-2 border-stone-600 rounded-2xl p-6 hover:border-amber-500/50 transition-all duration-300"
                        initial={{ scale: 0, rotateZ: 45 }}
                        animate={{ scale: 1, rotateZ: 0 }}
                        transition={{ delay: index * 0.1, type: "spring" }}
                        whileHover={{ scale: 1.02, y: -5 }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-8 w-8 text-amber-400" />
                            <label className="text-amber-200 font-bold text-lg">
                              {attributeNames[attr as keyof typeof attributeNames]}
                            </label>
                          </div>
                          <motion.div 
                            className="text-right"
                            animate={{ scale: value >= 15 ? [1, 1.2, 1] : 1 }}
                            transition={{ duration: 1, repeat: value >= 15 ? Infinity : 0 }}
                          >
                            <div className="text-3xl font-bold text-amber-400">
                              {finalValue}
                            </div>
                            <div className="text-sm text-stone-400">
                              {modifier >= 0 ? '+' : ''}{modifier}
                            </div>
                          </motion.div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => updateAttribute(attr, Math.max(8, value - 1))}
                              className="w-10 h-10 bg-stone-700 hover:bg-red-600 rounded-full text-amber-200 font-bold text-xl transition-colors duration-200"
                            >
                              -
                            </button>
                            <div className="flex-1">
                              <input
                                type="range"
                                min="8"
                                max="15"
                                value={value}
                                onChange={(e) => updateAttribute(attr, parseInt(e.target.value))}
                                className="w-full h-3 bg-stone-700 rounded-lg appearance-none cursor-pointer slider"
                              />
                            </div>
                            <button 
                              onClick={() => updateAttribute(attr, Math.min(15, value + 1))}
                              className="w-10 h-10 bg-stone-700 hover:bg-green-600 rounded-full text-amber-200 font-bold text-xl transition-colors duration-200"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-center text-sm text-stone-400">
                            Base: <span className="text-amber-300 font-semibold">{value}</span>
                            {bonus !== 0 && <span className="text-green-400"> + {bonus} (raça)</span>}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {selectedRace && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/50 rounded-xl p-6"
                  >
                    <h4 className="text-lg font-bold text-amber-200 mb-3 flex items-center gap-2">
                      {selectedRace.emoji} Bônus Racial: {selectedRace.nome}
                    </h4>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-sm">
                      {Object.entries(selectedRace.attribute_bonuses).map(([attr, bonus]) => (
                        <div key={attr} className={`text-center p-2 rounded-lg ${bonus > 0 ? 'bg-green-600/30 text-green-300' : bonus < 0 ? 'bg-red-600/30 text-red-300' : 'bg-stone-600/30 text-stone-400'}`}>
                          <div className="font-semibold">
                            {attributeNames[attr === 'strength' ? 'forca' :
                             attr === 'dexterity' ? 'destreza' :
                             attr === 'constitution' ? 'constituicao' :
                             attr === 'intelligence' ? 'inteligencia' :
                             attr === 'wisdom' ? 'sabedoria' : 'carisma' as keyof typeof attributeNames]}
                          </div>
                          <div className="text-lg font-bold">
                            {bonus > 0 ? '+' : ''}{bonus}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Etapa 3: Aparência */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <motion.h2 
                  className="text-4xl font-cinzel text-amber-300 text-center flex items-center justify-center gap-3"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Palette className="h-10 w-10 animate-spin" style={{ animationDuration: '3s' }} />
                  Forje sua Aparência
                </motion.h2>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Características Físicas */}
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Idade */}
                    <div>
                      <label className="flex text-amber-200 mb-3 font-bold text-lg items-center gap-2">
                        <span className="text-2xl">🕰️</span>
                        Idade: {character.idade} anos
                      </label>
                      <input
                        type="range"
                        min={selectedRace ? Math.floor(selectedRace.expectativa_vida * 0.15) : 15}
                        max={selectedRace ? Math.floor(selectedRace.expectativa_vida * 0.8) : 80}
                        value={character.idade}
                        onChange={(e) => setCharacter(prev => ({ ...prev, idade: parseInt(e.target.value) }))}
                        className="w-full h-4 bg-stone-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-sm text-stone-400 mt-2">
                        {selectedRace && `Expectativa de vida: ${selectedRace.expectativa_vida} anos`}
                      </div>
                    </div>

                    {/* Altura */}
                    <div>
                      <label className="flex text-amber-200 mb-3 font-bold text-lg items-center gap-2">
                        <span className="text-2xl">📏</span>
                        Altura: {character.altura} cm
                      </label>
                      <input
                        type="range"
                        min={selectedRace ? selectedRace.altura_media_cm - 30 : 150}
                        max={selectedRace ? selectedRace.altura_media_cm + 30 : 200}
                        value={character.altura}
                        onChange={(e) => setCharacter(prev => ({ ...prev, altura: parseInt(e.target.value) }))}
                        className="w-full h-4 bg-stone-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-sm text-stone-400 mt-2">
                        {selectedRace && `Altura média da raça: ${selectedRace.altura_media_cm} cm`}
                      </div>
                    </div>

                    {/* Peso */}
                    <div>
                      <label className="flex text-amber-200 mb-3 font-bold text-lg items-center gap-2">
                        <span className="text-2xl">⚖️</span>
                        Peso: {character.peso} kg
                      </label>
                      <input
                        type="range"
                        min={selectedRace ? selectedRace.peso_medio_kg - 20 : 50}
                        max={selectedRace ? selectedRace.peso_medio_kg + 40 : 120}
                        value={character.peso}
                        onChange={(e) => setCharacter(prev => ({ ...prev, peso: parseInt(e.target.value) }))}
                        className="w-full h-4 bg-stone-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-sm text-stone-400 mt-2">
                        {selectedRace && `Peso médio da raça: ${selectedRace.peso_medio_kg} kg`}
                      </div>
                    </div>
                  </motion.div>

                  {/* Características Visuais */}
                  <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-6"
                  >
                    {/* Cor dos Olhos */}
                    <div>
                      <label className="flex text-amber-200 mb-4 font-bold text-lg items-center gap-2">
                        <span className="text-2xl">👁️</span>
                        Cor dos Olhos
                      </label>
                      <div className="grid grid-cols-4 gap-3">
                        {coresOlhos.map((cor, index) => (
                          <motion.button
                            key={cor}
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCharacter(prev => ({ ...prev, corOlhos: cor }))}
                            className={`
                              p-3 rounded-xl border-2 transition-all duration-300 font-semibold
                              ${character.corOlhos === cor
                                ? 'bg-amber-600/40 border-amber-400 text-amber-200'
                                : 'bg-stone-800/60 border-stone-600 text-stone-300 hover:border-amber-500/50'
                              }
                            `}
                          >
                            {cor}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Cor do Cabelo */}
                    <div>
                      <label className="flex text-amber-200 mb-4 font-bold text-lg items-center gap-2">
                        <span className="text-2xl">💇‍♀️</span>
                        Cor do Cabelo
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {coresCabelo.map((cor, index) => (
                          <motion.button
                            key={cor}
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCharacter(prev => ({ ...prev, corCabelo: cor }))}
                            className={`
                              p-3 rounded-xl border-2 transition-all duration-300 font-semibold
                              ${character.corCabelo === cor
                                ? 'bg-amber-600/40 border-amber-400 text-amber-200'
                                : 'bg-stone-800/60 border-stone-600 text-stone-300 hover:border-amber-500/50'
                              }
                            `}
                          >
                            {cor}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Cor da Pele */}
                    <div>
                      <label className="flex text-amber-200 mb-4 font-bold text-lg items-center gap-2">
                        <span className="text-2xl">🎨</span>
                        Tom de Pele
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {coresPele.map((cor, index) => (
                          <motion.button
                            key={cor}
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: index * 0.1 + 0.4 }}
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCharacter(prev => ({ ...prev, corPele: cor }))}
                            className={`
                              p-3 rounded-xl border-2 transition-all duration-300 font-semibold
                              ${character.corPele === cor
                                ? 'bg-amber-600/40 border-amber-400 text-amber-200'
                                : 'bg-stone-800/60 border-stone-600 text-stone-300 hover:border-amber-500/50'
                              }
                            `}
                          >
                            {cor}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Etapa 4: Personalidade */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <motion.h2 
                  className="text-4xl font-cinzel text-amber-300 text-center flex items-center justify-center gap-3"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Heart className="h-10 w-10 animate-pulse text-red-400" />
                  Alma do Personagem
                </motion.h2>

                <div className="grid lg:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="flex text-amber-200 mb-4 font-bold text-lg items-center gap-2">
                      <span className="text-2xl">⚖️</span>
                      Alinhamento Moral
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {alinhamentos.map((align, index) => (
                        <motion.button
                          key={align.id}
                          initial={{ scale: 0, rotate: 360 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCharacter(prev => ({ ...prev, alinhamento: align.id }))}
                          className={`
                            p-4 rounded-xl border-2 transition-all duration-300 text-center
                            ${character.alinhamento === align.id
                              ? 'bg-amber-600/40 border-amber-400 text-amber-200 shadow-lg'
                              : 'bg-stone-800/60 border-stone-600 text-stone-300 hover:border-amber-500/50'
                            }
                          `}
                        >
                          <div className="text-3xl mb-2">{align.emoji}</div>
                          <div className={`text-sm font-bold ${align.cor}`}>
                            {align.nome}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="flex text-amber-200 mb-3 font-bold text-lg items-center gap-2">
                        <span className="text-2xl">🎭</span>
                        Personalidade
                      </label>
                      <textarea
                        value={character.personalidade}
                        onChange={(e) => setCharacter(prev => ({ ...prev, personalidade: e.target.value }))}
                        className="w-full p-4 bg-stone-800/80 border-2 border-stone-600 rounded-xl text-amber-100 focus:border-amber-500 focus:outline-none transition-all duration-300 min-h-20 resize-none"
                        placeholder="Como você age? É corajoso, cauteloso, engraçado, sério?"
                      />
                    </div>

                    <div>
                      <label className="flex text-amber-200 mb-3 font-bold text-lg items-center gap-2">
                        <span className="text-2xl">💎</span>
                        Ideais
                      </label>
                      <textarea
                        value={character.ideais}
                        onChange={(e) => setCharacter(prev => ({ ...prev, ideais: e.target.value }))}
                        className="w-full p-4 bg-stone-800/80 border-2 border-stone-600 rounded-xl text-amber-100 focus:border-amber-500 focus:outline-none transition-all duration-300 min-h-20 resize-none"
                        placeholder="Quais princípios guiam suas ações?"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Etapa 5: História */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <motion.h2 
                  className="text-4xl font-cinzel text-amber-300 text-center flex items-center justify-center gap-3"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <BookOpen className="h-10 w-10 animate-bounce" />
                  Crônicas do Passado
                </motion.h2>

                <div className="grid lg:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="flex text-amber-200 mb-3 font-bold text-lg items-center gap-2">
                        <span className="text-2xl">🎯</span>
                        Motivação
                      </label>
                      <textarea
                        value={character.motivacao}
                        onChange={(e) => setCharacter(prev => ({ ...prev, motivacao: e.target.value }))}
                        className="w-full p-4 bg-stone-800/80 border-2 border-stone-600 rounded-xl text-amber-100 focus:border-amber-500 focus:outline-none transition-all duration-300 min-h-24 resize-none"
                        placeholder="O que move você? Busca por vingança, proteção da família, sede de conhecimento..."
                      />
                    </div>

                    <div>
                      <label className="flex text-amber-200 mb-3 font-bold text-lg items-center gap-2">
                        <span className="text-2xl">💔</span>
                        Traumas ou Medos
                      </label>
                      <textarea
                        value={character.traumas}
                        onChange={(e) => setCharacter(prev => ({ ...prev, traumas: e.target.value }))}
                        className="w-full p-4 bg-stone-800/80 border-2 border-stone-600 rounded-xl text-amber-100 focus:border-amber-500 focus:outline-none transition-all duration-300 min-h-24 resize-none"
                        placeholder="Que sombras assombram seu passado?"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="flex text-amber-200 mb-3 font-bold text-lg items-center gap-2">
                        <span className="text-2xl">🗡️</span>
                        Inimigos
                      </label>
                      <textarea
                        value={character.inimigos}
                        onChange={(e) => setCharacter(prev => ({ ...prev, inimigos: e.target.value }))}
                        className="w-full p-4 bg-stone-800/80 border-2 border-stone-600 rounded-xl text-amber-100 focus:border-amber-500 focus:outline-none transition-all duration-300 min-h-24 resize-none"
                        placeholder="Quem quer sua ruína? Rivais, organizações, criaturas das trevas..."
                      />
                    </div>

                    <div>
                      <label className="flex text-amber-200 mb-3 font-bold text-lg items-center gap-2">
                        <span className="text-2xl">🤫</span>
                        Segredo Oculto
                      </label>
                      <textarea
                        value={character.segredo}
                        onChange={(e) => setCharacter(prev => ({ ...prev, segredo: e.target.value }))}
                        className="w-full p-4 bg-stone-800/80 border-2 border-stone-600 rounded-xl text-amber-100 focus:border-amber-500 focus:outline-none transition-all duration-300 min-h-24 resize-none"
                        placeholder="Que verdade você esconde do mundo?"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Etapa 6: Equipamentos */}
            {currentStep === 6 && (
              <div className="space-y-8">
                <motion.h2 
                  className="text-4xl font-cinzel text-amber-300 text-center flex items-center justify-center gap-3"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Swords className="h-10 w-10 animate-pulse" />
                  Arsenal do Aventureiro
                </motion.h2>

                <div className="grid lg:grid-cols-3 gap-8">
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="flex text-amber-200 mb-3 font-bold text-lg items-center gap-2">
                      <Sword className="h-6 w-6" />
                      Armas
                    </label>
                    <textarea
                      value={character.armas}
                      onChange={(e) => setCharacter(prev => ({ ...prev, armas: e.target.value }))}
                      className="w-full p-4 bg-stone-800/80 border-2 border-stone-600 rounded-xl text-amber-100 focus:border-amber-500 focus:outline-none transition-all duration-300 min-h-32 resize-none"
                      placeholder="Espada élfica, arco longo, adaga envenenada..."
                    />
                  </motion.div>

                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="flex text-amber-200 mb-3 font-bold text-lg items-center gap-2">
                      <Shield className="h-6 w-6" />
                      Armadura
                    </label>
                    <textarea
                      value={character.armadura}
                      onChange={(e) => setCharacter(prev => ({ ...prev, armadura: e.target.value }))}
                      className="w-full p-4 bg-stone-800/80 border-2 border-stone-600 rounded-xl text-amber-100 focus:border-amber-500 focus:outline-none transition-all duration-300 min-h-32 resize-none"
                      placeholder="Cota de malha, armadura de couro, manto élfico..."
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="flex text-amber-200 mb-3 font-bold text-lg items-center gap-2">
                      <Sparkles className="h-6 w-6" />
                      Itens Especiais
                    </label>
                    <textarea
                      value={character.itensEspeciais}
                      onChange={(e) => setCharacter(prev => ({ ...prev, itensEspeciais: e.target.value }))}
                      className="w-full p-4 bg-stone-800/80 border-2 border-stone-600 rounded-xl text-amber-100 focus:border-amber-500 focus:outline-none transition-all duration-300 min-h-32 resize-none"
                      placeholder="Anel mágico, poção de cura, mapa antigo..."
                    />
                  </motion.div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="flex text-amber-200 mb-3 font-bold text-lg items-center gap-2">
                      <Wand2 className="h-6 w-6" />
                      Magias & Poderes
                    </label>
                    <textarea
                      value={character.magias}
                      onChange={(e) => setCharacter(prev => ({ ...prev, magias: e.target.value }))}
                      className="w-full p-4 bg-stone-800/80 border-2 border-stone-600 rounded-xl text-amber-100 focus:border-amber-500 focus:outline-none transition-all duration-300 min-h-24 resize-none"
                      placeholder="Bola de fogo, cura, invisibilidade..."
                    />
                  </motion.div>

                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label className="flex text-amber-200 mb-3 font-bold text-lg items-center gap-2">
                      <Target className="h-6 w-6" />
                      Proficiências
                    </label>
                    <textarea
                      value={character.proficiencias}
                      onChange={(e) => setCharacter(prev => ({ ...prev, proficiencias: e.target.value }))}
                      className="w-full p-4 bg-stone-800/80 border-2 border-stone-600 rounded-xl text-amber-100 focus:border-amber-500 focus:outline-none transition-all duration-300 min-h-24 resize-none"
                      placeholder="Furtividade, persuasão, medicina, história..."
                    />
                  </motion.div>
                </div>
              </div>
            )}

            {/* Etapa 7: Finalizar */}
            {currentStep === 7 && (
              <div className="space-y-8">
                <motion.h2 
                  className="text-4xl font-cinzel text-amber-300 text-center flex items-center justify-center gap-3"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Star className="h-10 w-10 animate-spin text-amber-400" style={{ animationDuration: '2s' }} />
                  Sua Lenda Está Pronta!
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/50 rounded-2xl p-8"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-amber-200 mb-2">
                      {character.nome} {character.apelido && `"${character.apelido}"`}
                    </h3>
                    <p className="text-xl text-amber-300">
                      {selectedRace?.nome} {selectedClass?.nome}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                    <div className="bg-stone-800/60 rounded-xl p-4">
                      <h4 className="font-bold text-amber-200 mb-2 flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Atributos
                      </h4>
                      <div className="space-y-1">
                        {['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'].map(attr => {
                          const value = character[attr as keyof typeof character] as number;
                          const bonus = selectedRace?.attribute_bonuses?.[attr === 'forca' ? 'strength' : 
                                        attr === 'destreza' ? 'dexterity' :
                                        attr === 'constituicao' ? 'constitution' :
                                        attr === 'inteligencia' ? 'intelligence' :
                                        attr === 'sabedoria' ? 'wisdom' : 'charisma'] || 0;
                          const total = value + bonus;
                          return (
                            <div key={attr} className="flex justify-between">
                              <span>{attributeNames[attr as keyof typeof attributeNames]}:</span>
                              <span className="font-bold text-amber-300">{total}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-stone-800/60 rounded-xl p-4">
                      <h4 className="font-bold text-amber-200 mb-2 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Física
                      </h4>
                      <div className="space-y-1">
                        <div>Idade: {character.idade} anos</div>
                        <div>Altura: {character.altura} cm</div>
                        <div>Peso: {character.peso} kg</div>
                        <div>Olhos: {character.corOlhos}</div>
                        <div>Cabelo: {character.corCabelo}</div>
                        <div>Pele: {character.corPele}</div>
                      </div>
                    </div>

                    <div className="bg-stone-800/60 rounded-xl p-4">
                      <h4 className="font-bold text-amber-200 mb-2 flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        Essência
                      </h4>
                      <div className="space-y-1">
                        <div>Alinhamento: {alinhamentos.find(a => a.id === character.alinhamento)?.nome}</div>
                        <div className="text-xs text-stone-400 mt-2">
                          {character.origem && `Origem: ${character.origem.slice(0, 50)}...`}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
            <motion.div 
              className="flex justify-between mt-10 pt-8 border-t border-amber-600/30"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                onClick={prevStep}
                disabled={currentStep === 0}
                whileHover={currentStep > 0 ? { scale: 1.05, x: -5 } : {}}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 bg-stone-700/80 hover:bg-stone-600 disabled:bg-stone-800/50 disabled:text-stone-500 rounded-xl transition-all duration-300 font-bold disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
                Anterior
              </motion.button>
              
              {currentStep < etapas.length - 1 ? (
                <motion.button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 0 && (!character.nome || !character.origem)) ||
                    (currentStep === 1 && (!character.raca || !character.classe))
                  }
                  whileHover={
                    !((currentStep === 0 && (!character.nome || !character.origem)) ||
                      (currentStep === 1 && (!character.raca || !character.classe))) 
                      ? { scale: 1.05, x: 5 } : {}
                  }
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-stone-600 disabled:to-stone-700 disabled:text-stone-400 rounded-xl transition-all duration-300 font-bold disabled:cursor-not-allowed"
                >
                  Próximo
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={createCharacter}
                  disabled={isCreating || !character.nome || !character.raca || !character.classe}
                  whileHover={!isCreating ? { 
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(34, 197, 94, 0.5)"
                  } : {}}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-stone-600 disabled:to-stone-700 rounded-xl transition-all duration-300 font-bold disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-5 w-5" />
                      </motion.div>
                      Forjando Herói...
                    </>
                  ) : (
                    <>
                      <Star className="h-5 w-5" />
                      Criar Personagem
                    </>
                  )}
                </motion.button>
              )}
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-red-900/50 border border-red-600 rounded-xl text-red-300 text-center"
              >
                ❌ {error}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-400/30 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
