'use client'

import { useRouter } from 'next/navigation'
import AdventureIntro from '@/components/AdventureIntro'
import FloatingParticles from '@/components/FloatingParticles'

export default function HomePage() {
  const router = useRouter()

  const handleStartJourney = () => {
    router.push('/auth')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <FloatingParticles />
      
      <main className="relative z-10 min-h-screen">
        <AdventureIntro onStartJourney={handleStartJourney} />
      </main>
    </div>
  )
}
