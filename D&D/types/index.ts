// =============================================================================
// USER TYPES
// =============================================================================
export interface User {
  id: string
  nome: string
  nickname: string
  email: string
  nivel_usuario: number
  experiencia_total: number
  conquistas?: string
  preferencias?: string
  ultimo_login?: string
  createdAt: string
  updatedAt: string
}

// =============================================================================
// CHARACTER TYPES
// =============================================================================
export interface Character {
  id: string
  userId: string
  nome: string
  titulo?: string
  pseudonimo?: string
  familia?: string
  apelido?: string
  raca: string
  classe: string
  
  // Atributos básicos
  forca: number
  destreza: number
  constituicao: number
  inteligencia: number
  sabedoria: number
  carisma: number
  
  // Características físicas
  idade: number
  altura: number
  peso: number
  corOlhos: string
  corCabelo: string
  corPele: string
  estilo: string
  
  // História e personalidade
  alinhamento: string
  origem: string
  motivacao: string
  traumas?: string
  inimigos?: string
  segredo?: string
  personalidade?: string
  tracos?: string
  ideais?: string
  vinculos?: string
  defeitos?: string
  
  // Sistema de jogo
  nivel: number
  experiencia: number
  pontos_vida_atuais: number
  pontos_vida_maximos: number
  
  // Inventário e equipamentos
  dinheiro_cobre: number
  dinheiro_prata: number
  dinheiro_ouro: number
  armas?: string
  armadura?: string
  itensEspeciais?: string
  
  // Habilidades e conhecimentos
  proficiencias?: string
  magias?: string
  poderes?: string
  idiomas?: string
  conhecimentos?: string
  
  // Meta
  avatar_url?: string
  imagem_url?: string
  createdAt: string
  updatedAt: string
}

// =============================================================================
// GAME DATA TYPES
// =============================================================================
export interface Race {
  id: string
  nome: string
  descricao: string
  emoji: string
  habilidades_especiais: string
  altura_media_cm: number
  peso_medio_kg: number
  expectativa_vida: number
  bonus_forca: number
  bonus_destreza: number
  bonus_constituicao: number
  bonus_inteligencia: number
  bonus_sabedoria: number
  bonus_carisma: number
  criado_em: string
  atualizado_em: string
}

export interface CharacterClass {
  id: string
  nome: string
  descricao: string
  emoji: string
  icone_nome: string
  atributo_principal: string
  dado_vida: number
  habilidades_iniciais: string
  tipo_armadura?: string
  armas_permitidas?: string
  escolas_magia?: string
  criado_em: string
  atualizado_em: string
}

export interface Skill {
  id: string
  nome: string
  descricao: string
  emoji: string
  categoria: string
  atributo_base: string
  tipo: string
  criado_em: string
  atualizado_em: string
}

// =============================================================================
// CHARACTER SKILL TYPES  
// =============================================================================
export interface CharacterSkill {
  id: string
  characterId: string
  skillId: string
  maestria: number
  experiencia: number
  criado_em: string
  atualizado_em: string
  skill?: Skill
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// =============================================================================
// UTILITY TYPES
// =============================================================================
export type WithTimestamps<T> = T & {
  criado_em: string
  atualizado_em: string
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

export interface ForgotPasswordRequest {
  emailOrNickname: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
  confirmPassword: string
}
