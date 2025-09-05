// 🏔️ Middle Earth RPG - Type Definitions

export interface User {
  id: string
  username: string
  email: string
  createdAt: string
  isActive: boolean
}

export interface Character {
  id: string
  userId: string
  name: string
  race: CharacterRace
  class: CharacterClass
  level: number
  experience: number
  attributes: CharacterAttributes
  inventory: InventoryItem[]
  location: string
  createdAt: string
  updatedAt: string
}

export interface CharacterAttributes {
  strength: number      // 💪 Physical power for melee combat
  agility: number       // 🏃 Speed, dexterity, and ranged accuracy  
  intelligence: number  // 🧠 Magical power and mana pool
  wisdom: number        // 🔮 Magical defense and perception
  luck: number         // 🍀 Critical hit chance and rare loot
  resistance: number   // 🛡️ Physical and magical defense
}

export interface CharacterRace {
  id: 'human' | 'elf' | 'dwarf' | 'halfling' | 'orc' | 'ent'
  name: string
  description: string
  attributeBonus: Partial<CharacterAttributes>
  specialAbilities: string[]
  emoji: string
}

export interface CharacterClass {
  id: 'warrior' | 'mage' | 'ranger' | 'paladin' | 'rogue' | 'necromancer'
  name: string
  description: string
  primaryAttribute: keyof CharacterAttributes
  startingSkills: string[]
  emoji: string
  iconName: string
}

export interface InventoryItem {
  id: string
  name: string
  type: 'weapon' | 'armor' | 'consumable' | 'quest' | 'treasure'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  description: string
  quantity: number
  value: number
  emoji: string
}

export interface GameLocation {
  id: string
  name: string
  description: string
  type: 'town' | 'dungeon' | 'wilderness' | 'castle' | 'ruins'
  level: number
  connectedLocations: string[]
  npcs: NPC[]
  monsters: Monster[]
  emoji: string
}

export interface NPC {
  id: string
  name: string
  type: 'merchant' | 'questgiver' | 'guard' | 'citizen'
  dialogue: string[]
  quests?: Quest[]
  items?: InventoryItem[]
  emoji: string
}

export interface Monster {
  id: string
  name: string
  level: number
  attributes: CharacterAttributes
  health: number
  loot: InventoryItem[]
  experience: number
  emoji: string
}

export interface Quest {
  id: string
  title: string
  description: string
  type: 'main' | 'side' | 'daily'
  difficulty: 'easy' | 'medium' | 'hard' | 'nightmare'
  rewards: {
    experience: number
    gold: number
    items: InventoryItem[]
  }
  requirements?: {
    level?: number
    completedQuests?: string[]
    items?: string[]
  }
  status: 'available' | 'active' | 'completed' | 'failed'
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface CreateCharacterRequest {
  name: string
  raceId: string
  classId: string
  userId: string
}
