import { Link } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import ProfileFavorites from './ProfileFavorites'
import ProfileWallets from './ProfileWallets'

const sections = [
  { label: 'Dados do perfil', to: '/profile', icon: '◉' },
  { label: 'Carteiras', to: '/profile', icon: '▣' },
  { label: 'Atividade', to: '/profile', icon: '↗' },
  { label: 'Lista de interesse', to: '/profile', icon: '♡' },
  { label: 'Ofertas', to: '/profile', icon: '◇' },
  { label: 'Arquivos baixados', to: '/profile', icon: '↓' },
  { label: 'Suporte', to: '/profile', icon: '?' },
] as const

export default function ProfileLayout() {
  const { user, isLoading } = useAuth()

  const [activeSection, setActiveSection] = useState('Dados do perfil')

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#17100D] text-[#F5E9D8]">
        <p>Carregando sua conta...</p>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#17100D] px-5 text-[#F5E9D8]">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold">Entre na sua conta</h1>
          <p className="mt-3 text-[#D4C1AD]">
            Você precisa estar conectado para acessar sua área pessoal.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex rounded-md bg-[#D99045] px-5 py-3 font-semibold text-[#21140C] transition hover:bg-[#F0AA5B]"
          >
            Entrar
          </Link>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-[#17100D] text-[#F5E9D8]">
      <header className="border-b border-[#39251B]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link
            to="/"
            className="text-2xl font-black tracking-[0.2em] text-[#E7A04B]"
          >
            KURIO
          </Link>
          <span className="text-sm text-[#D4C1AD]">
            Área do usuário
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-8">
          <p className="text-sm text-[#E7A04B]">MINHA CONTA</p>
          <h1 className="mt-2 text-3xl font-bold">Olá, {user.name}</h1>
          <p className="mt-2 text-[#D4C1AD]">
            Gerencie seu perfil e suas atividades na Kurio.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="h-fit rounded-xl border border-[#39251B] bg-[#211813] p-3">
            <nav aria-label="Navegação da área do usuário" className="space-y-1">
              {sections.map((section) => {
  const active = activeSection === section.label

  return (
    <Link
      key={section.label}
      to={section.to}
      onClick={() => setActiveSection(section.label)}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
        active
          ? 'bg-[#39251B] font-semibold text-[#E7A04B]'
          : 'text-[#D4C1AD] hover:bg-[#2B1D15] hover:text-white'
      }`}
    >
      <span aria-hidden="true" className="w-5 text-center text-lg">
        {section.icon}
      </span>
      {section.label}
    </Link>
  )
})}
            </nav>
          </aside>

          <section className="min-w-0 rounded-xl border border-[#39251B] bg-[#211813] p-6 md:p-8">
                {activeSection === 'Lista de interesse' ? (
  <ProfileFavorites />
) : activeSection === 'Carteiras' ? (
  <ProfileWallets />
) : (
  <div>
    <h2 className="text-2xl font-bold text-[#F5E9D8]">
      {activeSection}
    </h2>
    <p className="mt-2 text-sm text-[#BDAA97]">
      Esta seção será implementada nas próximas etapas.
    </p>
  </div>
)}
                </section>
        </div>
      </main>
    </div>
  )
}