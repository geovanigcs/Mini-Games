// 🏔️ Middle Earth RPG - Game Data

import { CharacterRace, CharacterClass } from '@/types'

export const RACES: CharacterRace[] = [
  {
    id: 'human',
    name: 'Human',
    description: 'Versatile and ambitious, humans adapt quickly to any situation. Their determination and courage make them natural leaders in the fight against darkness.',
    attributeBonus: { strength: 1, agility: 1, intelligence: 1, wisdom: 1, luck: 1, resistance: 1 },
    specialAbilities: ['Leadership', 'Quick Learning', 'Adaptability'],
    emoji: '👨‍⚔️'
  },
  {
    id: 'elf',
    name: 'Elf',
    description: 'Ancient and wise, elves possess otherworldly grace and deep connection to magic. Their keen senses and agility make them formidable archers and mages.',
    attributeBonus: { agility: 3, wisdom: 2, intelligence: 2 },
    specialAbilities: ['Enhanced Perception', 'Natural Magic', 'Immortal Wisdom'],
    emoji: '🧝‍♂️'
  },
  {
    id: 'dwarf',
    name: 'Dwarf',
    description: 'Stout and steadfast, dwarves are master craftsmen and fierce warriors. Their resilience and strength are legendary throughout Middle Earth.',
    attributeBonus: { strength: 3, resistance: 3, wisdom: 1 },
    specialAbilities: ['Master Crafting', 'Stone Sense', 'Tactical Combat'],
    emoji: '🧙‍♂️'
  },
  {
    id: 'halfling',
    name: 'Halfling',
    description: 'Small in stature but great in heart, halflings possess remarkable luck and stealth. Their courage often surprises those who underestimate them.',
    attributeBonus: { luck: 4, agility: 2, wisdom: 1 },
    specialAbilities: ['Exceptional Luck', 'Silent Movement', 'Brave Heart'],
    emoji: '🧚‍♂️'
  },
  {
    id: 'orc',
    name: 'Orc (Redeemed)',
    description: 'Once servants of darkness, some orcs have broken free from evil\'s influence. They bring raw strength and battle experience to the forces of good.',
    attributeBonus: { strength: 4, resistance: 2, agility: 1 },
    specialAbilities: ['Berserker Rage', 'Battle Instincts', 'Dark Resistance'],
    emoji: '👹'
  },
  {
    id: 'ent',
    name: 'Ent',
    description: 'Ancient tree shepherds awakened to defend nature. Their connection to the earth grants them incredible strength and wisdom of ages.',
    attributeBonus: { resistance: 4, wisdom: 3 },
    specialAbilities: ['Nature Command', 'Ancient Wisdom', 'Bark Skin'],
    emoji: '🌳'
  }
]

export const CLASSES: CharacterClass[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'Masters of melee combat, warriors charge into battle with sword and shield. They are the stalwart defenders and frontline fighters.',
    primaryAttribute: 'strength',
    startingSkills: ['Sword Mastery', 'Shield Defense', 'Battle Charge'],
    emoji: '⚔️',
    iconName: 'Sword'
  },
  {
    id: 'mage',
    name: 'Mage',
    description: 'Wielders of ancient arcane knowledge, mages command the very forces of creation and destruction. Their spells can turn the tide of battle.',
    primaryAttribute: 'intelligence',
    startingSkills: ['Fireball', 'Magic Shield', 'Arcane Missile'],
    emoji: '🔮',
    iconName: 'Wand2'
  },
  {
    id: 'ranger',
    name: 'Ranger',
    description: 'Masters of wilderness and bow, rangers are skilled hunters and trackers. They excel at ranged combat and nature magic.',
    primaryAttribute: 'agility',
    startingSkills: ['Precise Shot', 'Animal Companion', 'Track'],
    emoji: '🏹',
    iconName: 'Bow'
  },
  {
    id: 'paladin',
    name: 'Paladin',
    description: 'Holy warriors blessed with divine power, paladins are beacons of hope in dark times. They heal allies and smite evil.',
    primaryAttribute: 'wisdom',
    startingSkills: ['Divine Strike', 'Heal', 'Protection Aura'],
    emoji: '🛡️',
    iconName: 'Shield'
  },
  {
    id: 'rogue',
    name: 'Rogue',
    description: 'Masters of stealth and cunning, rogues strike from the shadows. Their agility and luck make them deadly assassins.',
    primaryAttribute: 'agility',
    startingSkills: ['Stealth', 'Backstab', 'Lock Picking'],
    emoji: '🗡️',
    iconName: 'Zap'
  },
  {
    id: 'necromancer',
    name: 'Necromancer',
    description: 'Dark mages who command death itself, necromancers use forbidden magic. They can raise the dead and drain life force.',
    primaryAttribute: 'intelligence',
    startingSkills: ['Raise Skeleton', 'Life Drain', 'Fear'],
    emoji: '💀',
    iconName: 'Skull'
  }
]

export const ADVENTURE_QUOTES = [
  "⚔️ 'Not all those who wander are lost' - J.R.R. Tolkien",
  "🗡️ 'Courage is not the absence of fear, but acting in spite of it'",
  "🏰 'Even the smallest person can change the course of the future'",
  "🔥 'The way is shut. It was made by those who are Dead, and the Dead keep it'",
  "⭐ 'All we have to decide is what to do with the time that is given us'",
  "🌟 'There is some good in this world, and it's worth fighting for'",
]

export const LOCATION_NAMES = [
  "🏔️ Misty Mountains",
  "🌲 Fangorn Forest", 
  "🏰 Minas Tirith",
  "🌋 Mount Doom",
  "🏛️ Rivendell",
  "🗻 Helm's Deep",
  "🌊 Grey Havens",
  "⛰️ Lonely Mountain",
]
