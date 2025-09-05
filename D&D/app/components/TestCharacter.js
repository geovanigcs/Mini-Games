'use client'

export default function TestCharacter({ user, onBack }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gold mb-4">Teste Character Creation</h1>
        <p className="text-gray-300 mb-8">Usuário: {user?.username || 'N/A'}</p>
        <button 
          onClick={onBack}
          className="px-6 py-2 bg-gold text-black font-bold rounded hover:bg-yellow-600"
        >
          Voltar ao Login
        </button>
      </div>
    </div>
  )
}
