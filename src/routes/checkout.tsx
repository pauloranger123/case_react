
import { useEffect, useState, type FormEvent } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useCart } from '../contexts/CartContext'
import { createOrder } from '../lib/checkout'


type Wallet = {
  id: string
  displayName: string
  nickname: string
  network: string
  profileName: string
  address: string
  secondaryWallet: string
  walletType: string
  referralCode: string
  email: string
  ensName: string
  role: 'principal' | 'secundaria'
}

type AppliedCoupon = {
  code: string
  discountPercent: number
}


export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})

function CheckoutPage() {
  const { items, clearCart } = useCart()  
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [selectedWalletId, setSelectedWalletId] = useState('')
  const [checkoutError, setCheckoutError] = useState('')
const [isSubmitting, setIsSubmitting] = useState(false)

  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
  null,
)

useEffect(() => {
  try {
    const savedCoupon = localStorage.getItem('kurio-applied-coupon')

    if (savedCoupon) {
      const parsedCoupon = JSON.parse(savedCoupon) as AppliedCoupon

      if (
        typeof parsedCoupon.code === 'string' &&
        typeof parsedCoupon.discountPercent === 'number' &&
        Number.isFinite(parsedCoupon.discountPercent) &&
        parsedCoupon.discountPercent >= 0 &&
        parsedCoupon.discountPercent <= 100
      ) {
        setAppliedCoupon(parsedCoupon)
      }
    }
  } catch {
    localStorage.removeItem('kurio-applied-coupon')
  }
}, [])

  useEffect(() => {
    try {
      const savedWallets = localStorage.getItem('kurio-wallets')
      const parsedWallets = savedWallets
        ? (JSON.parse(savedWallets) as Wallet[])
        : []

      setWallets(parsedWallets)
    } catch {
      setWallets([])
    }
  }, [])


  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [confirmedOrder, setConfirmedOrder] = useState<{
    number: string
    name: string
    email: string
    items: typeof items
    total: number
    walletName: string
    walletAddress: string
    walletNetwork: string
  } | null>(null)

  const subtotal = items.reduce(
  (sum, item) => sum + Number(item.price) * item.quantity,
  0,
)

const discount = appliedCoupon
  ? subtotal * (appliedCoupon.discountPercent / 100)
  : 0

const total = Math.max(0, subtotal - discount)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()

  if (items.length === 0 || isSubmitting) return

  const selectedWallet = wallets.find(
    (wallet) => wallet.id === selectedWalletId,
  )

  if (!selectedWallet) {
    setCheckoutError('Selecione uma carteira para continuar.')
    return
  }

  setCheckoutError('')
  setIsSubmitting(true)

  try {    

    const idempotencyKey = crypto.randomUUID()

    const order = await createOrder({
        idempotencyKey,
        items: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: String(item.price),
        })),
        couponCode: appliedCoupon?.code,
        name,
        email,
        walletName: selectedWallet.displayName,
        walletAddress: selectedWallet.address,
        walletNetwork: selectedWallet.network
        
      })

clearCart()
localStorage.removeItem('kurio-applied-coupon')
setAppliedCoupon(null)

setConfirmedOrder({
  number: order.number,
  name: order.name,
  email: order.email,
  items: [...items],
  total: order.total,
  walletName: order.walletName,
  walletAddress: order.walletAddress,
  walletNetwork: order.walletNetwork,
})
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error
    ) {
      const response = error.response

      if (
        typeof response === 'object' &&
        response !== null &&
        'data' in response &&
        typeof response.data === 'object' &&
        response.data !== null &&
        'message' in response.data &&
        typeof response.data.message === 'string'
      ) {
        setCheckoutError(response.data.message)
      } else {
        setCheckoutError('Não foi possível validar a compra. Tente novamente.')
      }
    } else {
      setCheckoutError('Não foi possível validar a compra. Tente novamente.')
    }
  } finally {
    setIsSubmitting(false)
  }
}

  if (confirmedOrder) {
    return (
      <main className="min-h-screen bg-[#17100D] px-5 py-12 text-[#F5E8D8]">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#493024] bg-[#211711] p-8 text-center sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D99045]/15 text-3xl text-[#E7A04B]">
            ✓
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            Pedido confirmado!
          </h1>

          <p className="mt-3 text-[#C9B6A2]">
            Obrigado por experimentar o Kurio, {confirmedOrder.name}.
          </p>

          <div className="mt-8 rounded-xl border border-[#493024] p-5 text-left">
            <p className="text-sm text-[#C9B6A2]">Número do pedido</p>
            <p className="mt-1 text-xl font-bold text-[#E7A04B]">
              {confirmedOrder.number}
            </p>

            <p className="mt-5 text-sm text-[#C9B6A2]">
              E-mail informado
            </p>
            <p className="mt-1 break-all">{confirmedOrder.email}</p>

            
<div className="mt-5">
  <p className="text-sm text-[#C9B6A2]">
    Carteira selecionada
  </p>
  <p className="mt-1 font-medium">
    {confirmedOrder.walletName}
  </p>
  <p className="mt-1 break-all text-sm text-[#E7A04B]">
    {confirmedOrder.walletAddress}
  </p>
  <p className="mt-3 text-sm text-[#C9B6A2]">
  Rede utilizada
  </p>
  <p className="mt-1 font-medium">
    {confirmedOrder.walletNetwork || 'Não informada'}
  </p>
</div>


            <div className="my-5 border-t border-[#493024]" />

            <p className="font-semibold">Resumo do pedido</p>

            <div className="mt-4 space-y-4">
              {confirmedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-[#C9B6A2]">
                      Quantidade: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-semibold">
                    {(Number(item.price) * item.quantity).toFixed(2)} ETH
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-between gap-4 border-t border-[#493024] pt-5">
              <span className="text-[#C9B6A2]">Total demonstrativo</span>
              <span className="text-xl font-bold text-[#E7A04B]">
                {confirmedOrder.total.toFixed(4)} ETH
              </span>
            </div>
          </div>

          <p className="mt-5 text-sm text-[#9F8977]">
            Esta é uma compra simulada para demonstração.
            Nenhum pagamento ou transferência de NFT foi realizado.
          </p>

          <Link
            to="/"
            className="mt-8 inline-block rounded-lg bg-[#D99045] px-6 py-3 font-bold text-[#21140C] transition hover:bg-[#F0AA5B]"
          >
            Voltar ao catálogo
          </Link>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#17100D] px-5 py-12 text-[#F5E8D8]">
        <div className="mx-auto max-w-2xl rounded-xl border border-[#493024] p-8 text-center">
          <h1 className="text-2xl font-bold">
            Seu carrinho está vazio
          </h1>

          <p className="mt-3 text-[#C9B6A2]">
            Adicione um NFT antes de continuar para o checkout.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-lg bg-[#D99045] px-5 py-3 font-semibold text-[#21140C]"
          >
            Explorar NFTs
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#17100D] px-5 py-10 text-[#F5E8D8]">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/cart"
          className="text-sm text-[#D99045] hover:text-[#F0AA5B]"
        >
          ← Voltar ao carrinho
        </Link>

        <h1 className="mt-6 text-3xl font-bold">
          Finalizar compra
        </h1>

        <p className="mt-2 text-[#C9B6A2]">
          Confira seu pedido e preencha seus dados para continuar.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_0.85fr]">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-xl border border-[#493024] bg-[#211711] p-6"
          >
            <h2 className="text-xl font-semibold">
              Dados do comprador
            </h2>

            
<div>
  <label
    htmlFor="checkout-wallet"
    className="mb-2 block text-sm text-[#C9B6A2]"
  >
    Carteira para pagamento
  </label>

  <select
    id="checkout-wallet"
    name="wallet"
    required
    value={selectedWalletId}
    onChange={(event) => setSelectedWalletId(event.target.value)}
    className="w-full rounded-lg border border-[#493024] bg-[#17100D] px-4 py-3 text-[#F5E8D8] outline-none focus:border-[#D99045]"
  >
    <option value="">Selecione uma carteira</option>

    {wallets.map((wallet) => (
      <option key={wallet.id} value={wallet.id}>
        {wallet.displayName} — {wallet.role === 'principal' ? 'Principal' : 'Secundária'}
      </option>
    ))}
  </select>

  {wallets.length === 0 && (
    <p className="mt-2 text-sm text-[#E7A04B]">
      Nenhuma carteira cadastrada. Acesse seu perfil para adicionar uma.
    </p>
  )}
</div>


            <div>
              <label
                htmlFor="buyer-name"
                className="mb-2 block text-sm text-[#C9B6A2]"
              >
                Nome completo
              </label>

              <input
                id="buyer-name"
                name="name"
                autoComplete="name"
                required
                maxLength={100}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Digite seu nome"
                className="w-full rounded-lg border border-[#493024] bg-[#17100D] px-4 py-3 outline-none focus:border-[#D99045]"
              />
            </div>

            <div>
              <label
                htmlFor="buyer-email"
                className="mb-2 block text-sm text-[#C9B6A2]"
              >
                E-mail
              </label>

              <input
                id="buyer-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@exemplo.com"
                className="w-full rounded-lg border border-[#493024] bg-[#17100D] px-4 py-3 outline-none focus:border-[#D99045]"
              />
            </div>

            <p className="text-xs leading-5 text-[#9F8977]">
              O Kurio está em modo de demonstração. Esses dados
              são usados somente para exibir a confirmação nesta
              sessão e não são enviados a um serviço de pagamento.
            </p>

            {checkoutError && (
  <p role="alert" className="text-sm text-red-400">
    {checkoutError}
  </p>
)}

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full rounded-lg bg-[#D99045] px-5 py-3 font-bold text-[#21140C] transition hover:bg-[#F0AA5B]"
            >
              
              {isSubmitting ? 'Validando compra...' : 'Confirmar compra simulada'}
            </button>
          </form>

          <section className="h-fit rounded-xl border border-[#493024] bg-[#211711] p-6">
            <h2 className="text-xl font-semibold">
              Resumo do pedido
            </h2>

            <div className="mt-5 space-y-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="mt-1 text-sm text-[#C9B6A2]">
                      Qtd.: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-semibold">
                    {(Number(item.price) * item.quantity).toFixed(2)} ETH
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-[#493024] pt-5">
  <div className="flex items-center justify-between gap-4">
    <span className="text-[#C9B6A2]">Subtotal</span>
    <span>{subtotal.toFixed(4)} ETH</span>
  </div>

  <div className="flex items-center justify-between gap-4">
    <span className="text-[#C9B6A2]">
      Desconto{appliedCoupon ? ` (${appliedCoupon.code})` : ''}
    </span>
    <span className="text-green-300">
      −{discount.toFixed(4)} ETH
    </span>
  </div>

  <div className="flex items-center justify-between gap-4">
    <span className="font-semibold">Total</span>
    <span className="text-2xl font-bold text-[#E7A04B]">
      {total.toFixed(4)} ETH
    </span>
  </div>
</div>

            <p className="mt-3 text-xs text-[#9F8977]">
              Valor fictício para demonstração, sem taxas ou
              transações reais.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
