
import { useState, type FormEvent } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const { login, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(email.trim(), password)
      await navigate({ to: '/' })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Não foi possível entrar.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#17100D] text-white">
        Verificando sessão...
      </main>
    )
  }

  if (isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#17100D] px-5 text-white">
        <h1 className="text-2xl font-bold">Você já está conectado!</h1>
        <Link to="/" className="text-amber-400 underline">
          Voltar ao marketplace
        </Link>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#17100D] px-5 py-10 text-white">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-[#211813] p-8 shadow-xl">
        <Link
          to="/"
          className="mb-8 inline-block text-sm text-amber-400 hover:text-amber-300"
        >
          ← Voltar ao marketplace
        </Link>

        <h1 className="text-3xl font-bold">Entrar na Kurio</h1>
        <p className="mt-2 text-sm text-white/60">
          Acesse sua conta para continuar.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-white/15 bg-[#17100D] px-4 py-3 text-white outline-none focus:border-amber-400"
              placeholder="voce@exemplo.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-white/15 bg-[#17100D] px-4 py-3 text-white outline-none focus:border-amber-400"
              placeholder="Sua senha"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-amber-400 px-4 py-3 font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/70">
          Ainda não tem uma conta?{' '}
          <Link
            to="/register"
            className="font-medium text-amber-400 hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </section>
    </main>
  )
}
