'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Crown, Sword, Shield, Sparkles, Target, Heart, 
  Music, Zap, Leaf, Bolt, Hand, Eye, ChevronLeft, ChevronRight,
  Dice6, Star, BookOpen, Save
} from 'lucide-react';

// Type definitions
interface Race {
  id: string;
  nome: string;
  descricao: string;
  emoji: string;
  habilidades_especiais: string[];
  attribute_bonuses: {
    forca: number;
    destreza: number;
    constituicao: number;
    inteligencia: number;
    sabedoria: number;
    carisma: number;
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
  icone_nome: string;
  atributo_principal: string;
  habilidades_iniciais: string[];
  dado_vida: number;
}

interface CharacterCreationProps {
  onBack: () => void;
  onComplete: (character: any) => void;
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

export default function CharacterCreation({ onBack, onComplete }: CharacterCreationProps) {
  // State management
  const [currentStep, setCurrentStep] = useState(0);
  const [races, setRaces] = useState<Race[]>([]);
  const [classes, setClasses] = useState<CharacterClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Character data
  const [character, setCharacter] = useState({
    nome: '',
    apelido: '',
    raca: '',
    classe: '',
    forca: 8,
    destreza: 8,
    constituicao: 8,
    inteligencia: 8,
    sabedoria: 8,
    carisma: 8,
    idade: 20,
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

  const [availablePoints, setAvailablePoints] = useState(27); // Point-buy system

  const steps = [
    'Informações Básicas',
    'Raça & Classe', 
    'Atributos',
    'Aparência',
    'Personalidade',
    'História & Equipamentos',
    'Revisão Final'
  ];

  const alignments = [
    { id: 'leal_bom', name: 'Leal e Bom', description: 'Honra e justiça acima de tudo' },
    { id: 'neutro_bom', name: 'Neutro e Bom', description: 'Bondade sem extremismo' },
    { id: 'caotico_bom', name: 'Caótico e Bom', description: 'Liberdade para o bem' },
    { id: 'leal_neutro', name: 'Leal e Neutro', description: 'Ordem e disciplina' },
    { id: 'neutro_verdadeiro', name: 'Neutro', description: 'Equilíbrio em todas as coisas' },
    { id: 'caotico_neutro', name: 'Caótico e Neutro', description: 'Liberdade absoluta' },
    { id: 'leal_mal', name: 'Leal e Mal', description: 'Tirania organizada' },
    { id: 'neutro_mal', name: 'Neutro e Mal', description: 'Egoísmo puro' },
    { id: 'caotico_mal', name: 'Caótico e Mal', description: 'Destruição e caos' }
  ];

  // Load races and classes from backend
  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    try {
      setLoading(true);
      
      // Fetch races
      const racesResponse = await fetch('/api/races');
      if (!racesResponse.ok) throw new Error('Erro ao carregar raças');
      const racesData = await racesResponse.json();
      setRaces(racesData);

      // Fetch classes
      const classesResponse = await fetch('/api/classes');
      if (!classesResponse.ok) throw new Error('Erro ao carregar classes');
      const classesData = await classesResponse.json();
      setClasses(classesData);

      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar dados do jogo. Verifique se o servidor está rodando.');
      setLoading(false);
    }
  };

  const selectedRace = races.find(r => r.id === character.raca);
  const selectedClass = classes.find(c => c.id === character.classe);

  const rollAttributes = () => {
    // Roll 4d6, drop lowest for each attribute
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

    // Reset point buy when rolling
    setAvailablePoints(0);
  };

  const calculateAttributeCost = (value: number) => {
    if (value <= 8) return 0;
    if (value <= 13) return value - 8;
    if (value <= 15) return (value - 13) * 2 + 5;
    return (value - 15) * 3 + 9;
  };

  const updateAttribute = (attribute: string, value: number) => {
    const currentValue = character[attribute as keyof typeof character] as number;
    const currentCost = calculateAttributeCost(currentValue);
    const newCost = calculateAttributeCost(value);
    const costDiff = newCost - currentCost;

    if (availablePoints - costDiff >= 0 && value >= 8 && value <= 15) {
      setCharacter(prev => ({ ...prev, [attribute]: value }));
      setAvailablePoints(prev => prev - costDiff);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const createCharacter = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Você precisa estar logado para criar um personagem');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(character)
      });

      const data = await response.json();

      if (response.ok) {
        onComplete(data.character);
      } else {
        setError(data.error || 'Erro ao criar personagem');
      }
      
      setLoading(false);
    } catch (err) {
      setError('Erro de conexão com o servidor');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-stone-900 to-amber-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-amber-200 text-xl font-cinzel">Carregando dados do reino...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-stone-900 to-amber-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center bg-red-900/50 border border-red-600 rounded-lg p-8 max-w-md">
          <p className="text-red-300 text-xl mb-4">{error}</p>
          <button 
            onClick={loadGameData}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold"
          >
            Tentar Novamente
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-900 to-stone-800 text-amber-100">
      {/* Header */}
      <div className="bg-stone-900/80 border-b border-amber-600/30 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            Voltar
          </button>
          
          <h1 className="text-2xl font-cinzel text-amber-200">
            🎭 Criação de Personagem
          </h1>
          
          <div className="text-sm text-amber-300">
            Etapa {currentStep + 1} de {steps.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-between mb-8 overflow-x-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center min-w-0">
              <div className={`
                w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0
                ${index <= currentStep 
                  ? 'bg-amber-600 border-amber-600 text-white' 
                  : 'bg-stone-800 border-stone-600 text-stone-400'
                }
              `}>
                {index + 1}
              </div>
              <div className={`
                ml-2 text-xs font-medium min-w-0
                ${index <= currentStep ? 'text-amber-200' : 'text-stone-500'}
              `}>
                {step}
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  w-4 h-1 mx-2 flex-shrink-0
                  ${index < currentStep ? 'bg-amber-600' : 'bg-stone-700'}
                `} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-6xl mx-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-stone-900/60 border border-amber-600/30 rounded-xl p-8"
          >
            {/* Step 0: Basic Info */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-cinzel text-amber-300 mb-6">
                  ✨ Informações Básicas
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-amber-200 mb-2 font-semibold">
                      Nome do Personagem *
                    </label>
                    <input
                      type="text"
                      value={character.nome}
                      onChange={(e) => setCharacter(prev => ({ ...prev, nome: e.target.value }))}
                      className="w-full p-3 bg-stone-800 border border-stone-600 rounded-lg text-amber-100 focus:border-amber-500 focus:outline-none"
                      placeholder="Ex: Aragorn, Legolas, Gandalf..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-amber-200 mb-2 font-semibold">
                      Apelido/Título
                    </label>
                    <input
                      type="text"
                      value={character.apelido}
                      onChange={(e) => setCharacter(prev => ({ ...prev, apelido: e.target.value }))}
                      className="w-full p-3 bg-stone-800 border border-stone-600 rounded-lg text-amber-100 focus:border-amber-500 focus:outline-none"
                      placeholder="Ex: Montanhês, Rei de Gondor..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Race & Class */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <h2 className="text-3xl font-cinzel text-amber-300 mb-6">
                  🧝‍♂️ Escolha sua Raça e Classe
                </h2>
                
                {/* Race Selection */}
                <div>
                  <h3 className="text-xl font-semibold text-amber-200 mb-4">Raças Disponíveis</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {races.map((race) => (
                      <motion.div
                        key={race.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCharacter(prev => ({ ...prev, raca: race.id }))}
                        className={`
                          p-4 border rounded-lg cursor-pointer transition-all
                          ${character.raca === race.id 
                            ? 'bg-amber-600/20 border-amber-500' 
                            : 'bg-stone-800/50 border-stone-600 hover:border-amber-600/50'
                          }
                        `}
                      >
                        <div className="text-4xl mb-2">{race.emoji}</div>
                        <h4 className="font-bold text-amber-200">{race.nome}</h4>
                        <p className="text-sm text-stone-300 mt-2">{race.descricao}</p>
                        <div className="mt-3 text-xs text-amber-400">
                          <div>Expectativa: {race.expectativa_vida} anos</div>
                          <div>Habilidades: {race.habilidades_especiais?.slice(0, 2).join(', ')}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Class Selection */}
                <div>
                  <h3 className="text-xl font-semibold text-amber-200 mb-4">Classes Disponíveis</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {classes.map((charClass) => {
                      const IconComponent = iconMap[charClass.icone_nome as keyof typeof iconMap] || Sword;
                      return (
                        <motion.div
                          key={charClass.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setCharacter(prev => ({ ...prev, classe: charClass.id }))}
                          className={`
                            p-4 border rounded-lg cursor-pointer transition-all
                            ${character.classe === charClass.id 
                              ? 'bg-amber-600/20 border-amber-500' 
                              : 'bg-stone-800/50 border-stone-600 hover:border-amber-600/50'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{charClass.emoji}</span>
                            <IconComponent className="h-6 w-6 text-amber-400" />
                          </div>
                          <h4 className="font-bold text-amber-200">{charClass.nome}</h4>
                          <p className="text-sm text-stone-300 mt-2">{charClass.descricao}</p>
                          <div className="mt-3 text-xs text-amber-400">
                            <div>Dado de Vida: d{charClass.dado_vida}</div>
                            <div>Atributo Principal: {charClass.atributo_principal}</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Attributes */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-cinzel text-amber-300">
                    ⚡ Atributos
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="text-amber-200">
                      Pontos Restantes: <span className="font-bold text-2xl text-amber-400">{availablePoints}</span>
                    </div>
                    <button 
                      onClick={rollAttributes}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
                    >
                      <Dice6 className="h-5 w-5" />
                      Rolar Dados
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'].map((attr) => {
                    const value = character[attr as keyof typeof character] as number;
                    const bonus = selectedRace?.attribute_bonuses?.[attr as keyof typeof selectedRace.attribute_bonuses] || 0;
                    const finalValue = value + bonus;
                    const modifier = Math.floor((finalValue - 10) / 2);
                    
                    return (
                      <div key={attr} className="bg-stone-800/30 border border-stone-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-amber-200 font-semibold capitalize">
                            {attr === 'forca' && '💪'} 
                            {attr === 'destreza' && '🏃'} 
                            {attr === 'constituicao' && '🛡️'} 
                            {attr === 'inteligencia' && '🧠'} 
                            {attr === 'sabedoria' && '👁️'} 
                            {attr === 'carisma' && '✨'} 
                            {' '}
                            {attr.charAt(0).toUpperCase() + attr.slice(1)}
                          </label>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-amber-400">
                              {finalValue}
                            </div>
                            <div className="text-sm text-stone-400">
                              {modifier >= 0 ? '+' : ''}{modifier}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateAttribute(attr, Math.max(8, value - 1))}
                            className="w-8 h-8 bg-stone-700 hover:bg-stone-600 rounded text-amber-200"
                          >
                            -
                          </button>
                          <div className="flex-1 text-center">
                            <input
                              type="range"
                              min="8"
                              max="15"
                              value={value}
                              onChange={(e) => updateAttribute(attr, parseInt(e.target.value))}
                              className="w-full"
                            />
                            <div className="text-sm text-stone-400">
                              Base: {value} {bonus !== 0 && `+ ${bonus} (raça)`}
                            </div>
                          </div>
                          <button 
                            onClick={() => updateAttribute(attr, Math.min(15, value + 1))}
                            className="w-8 h-8 bg-stone-700 hover:bg-stone-600 rounded text-amber-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-amber-600/30">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-3 bg-stone-700 hover:bg-stone-600 disabled:bg-stone-800 disabled:text-stone-500 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                Anterior
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 0 && !character.nome) ||
                    (currentStep === 1 && (!character.raca || !character.classe))
                  }
                  className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-600 disabled:text-stone-400 rounded-lg transition-colors"
                >
                  Próximo
                  <ChevronRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={createCharacter}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-stone-600 rounded-lg transition-colors"
                >
                  <Save className="h-5 w-5" />
                  {loading ? 'Criando...' : 'Criar Personagem'}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
