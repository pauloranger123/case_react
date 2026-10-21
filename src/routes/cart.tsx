
import { createFileRoute, Link } from '@tanstack/react-router'
import { useCart } from '../contexts/CartContext'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart()

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  )

  return (
    <main className="min-h-screen bg-[#17100D] px-5 py-10 text-[#F5E8D8]">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="text-sm text-[#D99045] hover:text-[#F0AA5B]"
        >
          ← Voltar ao catálogo
        </Link>

        <h1 className="mt-6 text-3xl font-bold">Meu carrinho</h1>

        {items.length === 0 ? (
          <div className="mt-8 rounded-xl border border-[#493024] p-8 text-center">
            <p className="text-[#C9B6A2]">
              Seu carrinho está vazio.
            </p>

            <Link
              to="/"
              className="mt-5 inline-block rounded-lg bg-[#D99045] px-5 py-3 font-semibold text-[#21140C]"
            >
              Explorar NFTs
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl border border-[#493024] bg-[#211711] p-4 sm:flex-row sm:items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="mt-1 text-sm text-[#C9B6A2]">
                      {item.creator} · {item.blockchain}
                    </p>
                    <p className="mt-2 font-bold text-[#E7A04B]">
                      {item.price} ETH
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <label
                      htmlFor={`quantity-${item.id}`}
                      className="text-sm text-[#C9B6A2]"
                    >
                      Qtd.
                    </label>

                    <input
                      id={`quantity-${item.id}`}
                      type="number"
                      min={1}
                      max={item.available}
                      value={item.quantity}
                      onChange={(event) => {
                        const value = Number(event.target.value)
                        if (Number.isFinite(value) && value >= 1) {
                          updateQuantity(item.id, value)
                        }
                      }}
                      className="w-20 rounded-md border border-[#493024] bg-[#17100D] px-2 py-2"
                    />

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-sm text-red-300 hover:text-red-200"
                    >
                      Remover
                    </button>
                  </div>

                  <p className="font-semibold sm:w-28 sm:text-right">
                    {(Number(item.price) * item.quantity).toFixed(2)} ETH
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-[#493024] bg-[#211711] p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#C9B6A2]">Subtotal</span>
                <span className="text-2xl font-bold">
                  {total.toFixed(2)} ETH
                </span>
              </div>

              <p className="mt-2 text-xs text-[#9F8977]">
                Total demonstrativo, sem taxas ou cotação de moeda.
              </p>

              <Link
                to="/checkout"
                className="mt-6 block w-full rounded-lg bg-[#D99045] px-5 py-3 text-center font-bold text-[#21140C] transition hover:bg-[#F0AA5B]"
                >
                Continuar para pagamento
                </Link>

              <button
                type="button"
                onClick={clearCart}
                className="mt-3 w-full rounded-lg border border-[#493024] px-5 py-3 text-sm text-[#C9B6A2] hover:border-[#A86C35]"
              >
                Esvaziar carrinho
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
