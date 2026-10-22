import { useState, type FormEvent } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext'

export const Route = createFileRoute('/register')({
  component: Register,
})

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.')
      return
    }

    setIsSubmitting(true)

    try {
      await register(name.trim(), email.trim(), password)
      await navigate({ to: '/' })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível criar sua conta.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#17100D] px-5 py-10 text-white">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-[#211813] p-8 shadow-xl">
        <Link
          to="/"
          className="text-sm text-amber-400 transition hover:text-amber-300"
        >
          ← Voltar para a loja
        </Link>

        <div className="mb-8 mt-6">
          <h1 className="text-3xl font-bold">Crie sua conta</h1>
          <p className="mt-2 text-sm text-white/60">
            Entre para o universo de colecionáveis da Kurio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Nome completo
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Seu nome"
              className="w-full rounded-lg border border-white/10 bg-[#17100D] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-amber-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@exemplo.com"
              className="w-full rounded-lg border border-white/10 bg-[#17100D] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-amber-400"
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
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mínimo de 8 caracteres"
              className="w-full rounded-lg border border-white/10 bg-[#17100D] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-amber-400"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium"
            >
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Digite a senha novamente"
              className="w-full rounded-lg border border-white/10 bg-[#17100D] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-amber-400"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-amber-400 px-4 py-3 font-semibold text-[#17100D] transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          Já tem uma conta?{' '}
          <Link
            to="/login"
            className="font-medium text-amber-400 hover:text-amber-300"
          >
            Entrar
          </Link>
        </p>
      </section>
    </main>
  )
}