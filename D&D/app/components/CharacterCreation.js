'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Dice6 } from 'lucide-react'

const races = [
  { id: 'human', name: 'Humano', description: 'Versátil e adaptável', bonus: '+1 em todos atributos' },
  { id: 'elf', name: 'Elfo', description: 'Ágil e sábio', bonus: '+2 Agilidade, +1 Sabedoria' },
  { id: 'dwarf', name: 'Anão', description: 'Forte e resistente', bonus: '+2 Força, +1 Resistência' },
  { id: 'halfling', name: 'Halfling', description: 'Pequeno mas corajoso', bonus: '+2 Sorte, +1 Agilidade' }
]

const classes = [
  { id: 'warrior', name: 'Guerreiro', description: 'Mestre em combate corpo a corpo' },
  { id: 'mage', name: 'Mago', description: 'Manipulador de magias ancestrais' },
  { id: 'ranger', name: 'Ranger', description: 'Explorador hábil com arco' },
  { id: 'paladin', name: 'Paladino', description: 'Protetor sagrado do reino' }
]

export default function CharacterCreation({ user, onBack }) {
  const [character, setCharacter] = useState({
    name: '',
    race: '',
    class: '',
    attributes: {
      strength: 10,
      agility: 10,
      intelligence: 10,
      wisdom: 10,
      luck: 10,
      resistance: 10
    }
  })

  const [step, setStep] = useState(1)
  const [isCreating, setIsCreating] = useState(false)

  const rollAttributes = () => {
    const rollDice = () => Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 3

    setCharacter(prev => ({
      ...prev,
      attributes: {
        strength: rollDice(),
        agility: rollDice(),
        intelligence: rollDice(),
        wisdom: rollDice(),
        luck: rollDice(),
        resistance: rollDice()
      }
    }))
  }

  const handleCreateCharacter = async () => {
    setIsCreating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const characterData = {
      ...character,
      userId: user.id,
      level: 1,
      createdAt: new Date().toISOString()
    }

    console.log('Personagem criado:', characterData)
    alert('Personagem criado com sucesso! Bem-vindo ao reino!')
    setIsCreating(false)
  }

  const selectedRace = races.find(r => r.id === character.race)
  const selectedClass = classes.find(c => c.id === character.class)

  return (
    <div className="min-h-screen medieval-bg flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-black/40 backdrop-blur-md border-2 border-gold/30 shadow-2xl rounded-lg">
            <div className="text-center p-6 pb-2">
              <h2 className="text-3xl font-bold text-gold font-serif">Criação de Personagem</h2>
              <p className="text-gray-300 mt-2">Bem-vindo, {user.username}! Crie seu herói épico.</p>
            </div>

            <div className="p-6 space-y-8">
              {/* Step Indicator */}
              <div className="flex justify-center space-x-2 mb-8">
                {[1, 2, 3, 4].map((stepNum) => (
                  <div
                    key={stepNum}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step >= stepNum ? 'bg-gold text-black' : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {stepNum}
                  </div>
                ))}
              </div>

              {/* Step 1: Basic Info */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div>
                    <label className="text-gray-200 font-medium block mb-2">Nome do Personagem</label>
                    <input
                      value={character.name}
                      onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Digite o nome do seu herói"
                      className="w-full px-4 py-2 bg-black/20 border border-gold/30 rounded text-white placeholder:text-gray-400 focus:border-gold focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!character.name.trim()}
                    className="w-full py-3 bg-gold hover:bg-yellow-600 text-black font-bold rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Próximo: Escolher Raça
                  </button>
                </motion.div>
              )}

              {/* Step 2: Race Selection */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <h3 className="text-xl font-bold text-gold text-center">Escolha sua Raça</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {races.map((race) => (
                      <button
                        key={race.id}
                        onClick={() => setCharacter(prev => ({ ...prev, race: race.id }))}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          character.race === race.id
                            ? 'border-gold bg-gold/10'
                            : 'border-gray-600 hover:border-gold/50 bg-black/20'
                        }`}
                      >
                        <h4 className="font-bold text-white">{race.name}</h4>
                        <p className="text-gray-300 text-sm">{race.description}</p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs border border-gold/50 text-gold rounded">
                          {race.bonus}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStep(1)} 
                      className="flex-1 py-2 border border-gold/30 text-gold rounded hover:bg-gold/10 transition-all"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!character.race}
                      className="flex-1 py-2 bg-gold hover:bg-yellow-600 text-black font-bold rounded disabled:opacity-50 transition-all"
                    >
                      Próximo: Escolher Classe
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Class Selection */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <h3 className="text-xl font-bold text-gold text-center">Escolha sua Classe</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {classes.map((cls) => (
                      <button
                        key={cls.id}
                        onClick={() => setCharacter(prev => ({ ...prev, class: cls.id }))}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          character.class === cls.id
                            ? 'border-gold bg-gold/10'
                            : 'border-gray-600 hover:border-gold/50 bg-black/20'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-6 h-6 bg-gold rounded-full"></div>
                          <h4 className="font-bold text-white">{cls.name}</h4>
                        </div>
                        <p className="text-gray-300 text-sm">{cls.description}</p>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStep(2)} 
                      className="flex-1 py-2 border border-gold/30 text-gold rounded hover:bg-gold/10 transition-all"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={() => setStep(4)}
                      disabled={!character.class}
                      className="flex-1 py-2 bg-gold hover:bg-yellow-600 text-black font-bold rounded disabled:opacity-50 transition-all"
                    >
                      Próximo: Atributos
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Attributes */}
              {step === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gold mb-4">Atributos do Personagem</h3>
                    <button
                      onClick={rollAttributes}
                      className="px-4 py-2 border border-gold/30 text-gold hover:bg-gold/10 rounded flex items-center gap-2 mx-auto transition-all"
                    >
                      <Dice6 className="w-4 h-4" />
                      Rolar Dados
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(character.attributes).map(([attr, value]) => (
                      <div key={attr} className="bg-black/20 p-4 rounded-lg border border-gold/20">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gold">{value}</div>
                          <div className="text-gray-300 capitalize">
                            {attr === 'resistance' ? 'Resistência' : 
                             attr === 'strength' ? 'Força' : 
                             attr === 'agility' ? 'Agilidade' : 
                             attr === 'intelligence' ? 'Inteligência' : 
                             attr === 'wisdom' ? 'Sabedoria' : 'Sorte'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gold/10 p-4 rounded-lg border border-gold/30">
                    <h4 className="font-bold text-gold mb-2">Resumo do Personagem:</h4>
                    <div className="text-gray-200 space-y-1">
                      <p><strong>Nome:</strong> {character.name}</p>
                      <p><strong>Raça:</strong> {selectedRace?.name}</p>
                      <p><strong>Classe:</strong> {selectedClass?.name}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStep(3)} 
                      className="flex-1 py-2 border border-gold/30 text-gold rounded hover:bg-gold/10 transition-all"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleCreateCharacter}
                      disabled={isCreating}
                      className="flex-1 py-2 bg-gold hover:bg-yellow-600 text-black font-bold rounded disabled:opacity-50 transition-all"
                    >
                      {isCreating ? (
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mx-auto animate-spin" />
                      ) : (
                        "Criar Personagem"
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Back to Login Button */}
              <div className="text-center pt-6 border-t border-gold/20">
                <button
                  onClick={onBack}
                  className="text-gray-300 hover:text-gold flex items-center gap-2 mx-auto px-4 py-2 rounded transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao Login
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
