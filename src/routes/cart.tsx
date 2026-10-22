
import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useCart } from '../contexts/CartContext'
import { validateCoupon } from '../lib/coupons'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

const COUPON_STORAGE_KEY = 'kurio-applied-coupon'

function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart()

  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string
    discountPercent: number
    discountAmount: number
  } | null>(null)
  const [couponMessage, setCouponMessage] = useState('')
  const [couponError, setCouponError] = useState(false)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  )

  const discount = appliedCoupon
    ? subtotal * appliedCoupon.discountPercent / 100
    : 0

  const total = Math.max(0, subtotal - discount)

  async function handleApplyCoupon() {
    if (!couponCode.trim()) {
      setAppliedCoupon(null)
      setCouponError(true)
      setCouponMessage('Digite um código de cupom.')
      return
    }

    setIsValidatingCoupon(true)
    setCouponMessage('')
    setCouponError(false)

    try {
      const result = await validateCoupon(couponCode, subtotal)

      setAppliedCoupon(result)
setCouponCode(result.code)

localStorage.setItem(
  COUPON_STORAGE_KEY,
  JSON.stringify({
    code: result.code,
    discountPercent: result.discountPercent,
  }),
)

setCouponMessage(
  `Cupom ${result.code} aplicado: ${result.discountPercent}% de desconto.`,
)
    } catch (error) {
      setAppliedCoupon(null)
      localStorage.removeItem(COUPON_STORAGE_KEY)
      setCouponError(true)

      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof error.response === 'object' &&
        error.response !== null &&
        'data' in error.response &&
        typeof error.response.data === 'object' &&
        error.response.data !== null &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
          ? error.response.data.message
          : 'Não foi possível validar o cupom. Tente novamente.'

      setCouponMessage(message)
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  function handleRemoveCoupon() {
  setAppliedCoupon(null)
  setCouponCode('')
  setCouponMessage('Cupom removido.')
  setCouponError(false)
  localStorage.removeItem(COUPON_STORAGE_KEY)
}

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
              <div className="mb-6 border-b border-[#493024] pb-6">
                <label
                  htmlFor="coupon-code"
                  className="mb-2 block font-semibold"
                >
                  Cupom de desconto
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="coupon-code"
                    type="text"
                    value={couponCode}
                    onChange={(event) => {
                      setCouponCode(event.target.value)
                      if (appliedCoupon) {
                          setAppliedCoupon(null)
                          localStorage.removeItem(COUPON_STORAGE_KEY)
                        }
                      setCouponMessage('')
                      setCouponError(false)
                    }}
                    placeholder="Ex.: KURIO10"
                    disabled={isValidatingCoupon}
                    className="min-w-0 flex-1 rounded-lg border border-[#493024] bg-[#17100D] px-4 py-3 text-[#F5E8D8] placeholder:text-[#9F8977]"
                  />

                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isValidatingCoupon}
                    className="rounded-lg bg-[#D99045] px-5 py-3 font-semibold text-[#21140C] transition hover:bg-[#F0AA5B] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isValidatingCoupon ? 'Validando...' : 'Aplicar cupom'}
                  </button>

                  {appliedCoupon && (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      disabled={isValidatingCoupon}
                      className="rounded-lg border border-[#493024] px-4 py-3 text-sm hover:border-[#A86C35]"
                    >
                      Remover cupom
                    </button>
                  )}
                </div>

                {couponMessage && (
                  <p
                    role="status"
                    aria-live="polite"
                    className={`mt-3 text-sm ${
                      couponError ? 'text-red-300' : 'text-green-300'
                    }`}
                  >
                    {couponMessage}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#C9B6A2]">Subtotal</span>
                  <span>{subtotal.toFixed(4)} ETH</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#C9B6A2]">Desconto</span>
                  <span className="text-green-300">
                    −{discount.toFixed(4)} ETH
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-[#493024] pt-4">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold">
                    {total.toFixed(4)} ETH
                  </span>
                </div>
              </div>

              <p className="mt-3 text-xs text-[#9F8977]">
                Valores demonstrativos. Taxas de rede e cotação não estão incluídas.
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
