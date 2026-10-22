import { Link, useNavigate } from '@tanstack/react-router'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { items } = useCart()
  const { user, isLoading, logout } = useAuth()
  const navigate = useNavigate()

  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  )

  async function handleLogout() {
    try {
      await logout()
      await navigate({ to: '/' })
    } catch {
      // O AuthContext já limpa a sessão no finally do logout.
      await navigate({ to: '/' })
    }
  }

  return (
    <header className="border-b border-[#39251B] bg-[#17100D] text-[#F5E9D8]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-5">
        <Link
          to="/"
          className="text-2xl font-black tracking-[0.2em] text-[#E7A04B]"
        >
          KURIO
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-[#D4C1AD] md:flex">
          <Link to="/" className="text-[#E7A04B]">
            Início
          </Link>
          <Link to="/" className="transition hover:text-[#E7A04B]">
            Explorar
          </Link>
          <Link to="/" className="transition hover:text-[#E7A04B]">
            Coleções
          </Link>
          <Link to="/" className="transition hover:text-[#E7A04B]">
            As ofertas
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="flex items-center gap-2 text-sm text-[#D4C1AD] transition hover:text-white"
          >
            Carrinho

            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#D99045] px-1.5 text-xs font-bold text-[#21140C]">
              {cartCount}
            </span>
          </Link>

          {!isLoading && (
            user ? (
              <div className="flex items-center gap-3">
                <span
                  className="hidden max-w-32 truncate text-sm text-[#D4C1AD] sm:inline"
                  title={user.name}
                >
                  Olá, {user.name}
                </span>

                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="rounded-md border border-[#D99045] px-4 py-2 text-sm font-semibold text-[#E7A04B] transition hover:bg-[#39251B]"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-md bg-[#D99045] px-4 py-2 text-sm font-semibold text-[#21140C] transition hover:bg-[#F0AA5B]"
                >
                  Entrar
                </Link>

                <Link
                  to="/register"
                  className="hidden rounded-md border border-[#D99045] px-4 py-2 text-sm font-semibold text-[#E7A04B] transition hover:bg-[#39251B] sm:inline-flex"
                >
                  Criar conta
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  )
}