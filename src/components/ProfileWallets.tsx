import { useEffect, useState } from 'react'

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

const emptyWallet: Omit<Wallet, 'id'> = {
  displayName: '',
  nickname: '',
  network: '',
  profileName: '',
  address: '',
  secondaryWallet: '',
  walletType: '',
  referralCode: '',
  email: '',
  ensName: '',
  role: 'principal',
}



const requiredLabel = (label: string) => (
  <label className="mb-2 block text-sm font-medium text-[#F5E9D8]">
    {label} <span className="text-red-400">*</span>
  </label>
)

const inputClass =
  'w-full rounded-md border border-[#493024] bg-[#17100D] px-3 py-3 text-sm text-[#F5E9D8] outline-none placeholder:text-[#8F7967] focus:border-[#D99045]'

export default function ProfileWallets() {
  const [wallets, setWallets] = useState<Wallet[]>(() => {
  try {
    const savedWallets = localStorage.getItem('kurio-wallets')
    return savedWallets ? JSON.parse(savedWallets) as Wallet[] : []
  } catch {
    return []
  }
})
  const [form, setForm] = useState<Omit<Wallet, 'id'>>(emptyWallet)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [sameAsPrimary, setSameAsPrimary] = useState(false)
  const [addingSecondary, setAddingSecondary] = useState(false)
  const primaryWallet = wallets.find(
  (wallet) => wallet.role === 'principal',
)

  useEffect(() => {
  localStorage.setItem('kurio-wallets', JSON.stringify(wallets))
}, [wallets])

  function updateField(field: keyof typeof emptyWallet, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  
function handleSameAsPrimary() {
  if (!primaryWallet) return

  const { id, ...primaryData } = primaryWallet

  setForm({
    ...primaryData,
    role: 'secundaria',
  })

  setEditingId(null)
  setAddingSecondary(true)
  setSameAsPrimary(true)

  document.querySelector('form')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

  

function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()

  if (editingId) {
    setWallets((current) =>
      current.map((wallet) =>
        wallet.id === editingId
          ? {
              ...form,
              id: editingId,
              role: addingSecondary ? 'secundaria' : 'principal',
            }
          : wallet,
      ),
    )
  } else {
    setWallets((current) => {
      const newWallet: Wallet = {
        ...form,
        id: crypto.randomUUID(),
        role: addingSecondary ? 'secundaria' : 'principal',
      }

      if (newWallet.role === 'principal') {
        return [
          ...current.map((wallet) =>
            wallet.role === 'principal'
              ? { ...wallet, role: 'secundaria' as const }
              : wallet,
          ),
          newWallet,
        ]
      }

      return [...current, newWallet]
    })
  }

  setForm(emptyWallet)
  setEditingId(null)
  setAddingSecondary(false)
  setSameAsPrimary(false)
}



  function editWallet(wallet: Wallet) {
    const { id, ...walletData } = wallet
    setForm(walletData)
    setEditingId(id)
    setAddingSecondary(wallet.role === 'secundaria')
    }

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-[#E7A04B]">
        Minha conta
      </p>
      <h2 className="mt-2 text-2xl font-bold text-[#F5E9D8]">Carteiras</h2>
      <p className="mt-2 text-sm text-[#BDAA97]">
        {addingSecondary
            ? 'Cadastro de carteira secundária'
            : 'Cadastro de carteira principal'}
        </p>

      <form
        onSubmit={handleSubmit}
        className="mt-7 space-y-6 rounded-xl border border-[#493024] bg-[#17100D] p-5 sm:p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            {requiredLabel('Nome de exibição')}
            <input
              className={inputClass}
              value={form.displayName}
              onChange={(event) => updateField('displayName', event.target.value)}
              required
              placeholder="Nome de exibição"
            />
          </div>

          <div>
            {requiredLabel('Apelido da carteira')}
            <input
              className={inputClass}
              value={form.nickname}
              onChange={(event) => updateField('nickname', event.target.value)}
              required
              placeholder="Apelido da carteira"
            />
          </div>

          <div>
            {requiredLabel('Rede')}
            <select
              className={inputClass}
              value={form.network}
              onChange={(event) => updateField('network', event.target.value)}
              required
            >
              <option value="">Selecione uma rede</option>
              <option value="Ethereum">Ethereum</option>
              <option value="Polygon">Polygon</option>
              <option value="Arbitrum">Arbitrum</option>
              <option value="Base">Base</option>
            </select>
          </div>

          <div>
            {requiredLabel('Nome do perfil')}
            <input
              className={inputClass}
              value={form.profileName}
              onChange={(event) => updateField('profileName', event.target.value)}
              required
              placeholder="Nome do perfil"
            />
          </div>

          <div className="sm:col-span-2">
            {requiredLabel('Endereço da carteira')}
            <input
              className={inputClass}
              value={form.address}
              onChange={(event) => updateField('address', event.target.value)}
              required
              placeholder="Endereço 0x da carteira"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[#F5E9D8]">
              ENS ou carteira secundária (opcional)
            </label>
            <input
              className={inputClass}
              value={form.secondaryWallet}
              onChange={(event) => updateField('secondaryWallet', event.target.value)}
              placeholder="ENS ou carteira secundária (opcional)"
            />
          </div>

          <div>
            {requiredLabel('Tipo de carteira')}
            <select
              className={inputClass}
              value={form.walletType}
              onChange={(event) => updateField('walletType', event.target.value)}
              required
            >
              <option value="">Selecione uma carteira</option>
              <option value="MetaMask">MetaMask</option>
              <option value="WalletConnect">WalletConnect</option>
              <option value="Coinbase Wallet">Coinbase Wallet</option>
              <option value="Outra">Outra</option>
            </select>
          </div>

          <div>
            {requiredLabel('Código de indicação')}
            <input
              className={inputClass}
              value={form.referralCode}
              onChange={(event) => updateField('referralCode', event.target.value)}
              required
              placeholder="Código de indicação"
            />
          </div>

          <div>
            {requiredLabel('E-mail')}
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div>
            {requiredLabel('Nome ENS')}
            <div className="flex">
              <input
                className={`${inputClass} rounded-r-none`}
                value={form.ensName}
                onChange={(event) => updateField('ensName', event.target.value)}
                required
                placeholder="Seu nome"
              />
              <span className="flex items-center rounded-r-md border border-l-0 border-[#493024] bg-[#39251B] px-3 text-sm text-[#E7A04B]">
                .eth
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-[#39251B] pt-5">
          <button
            type="submit"
            className="rounded-md bg-[#D99045] px-5 py-3 text-sm font-semibold text-[#21140C] transition hover:bg-[#F0AA5B]"
          >
            {editingId ? 'Salvar alterações' : 'Salvar carteira'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm(emptyWallet)
                setEditingId(null)
              }}
              className="rounded-md border border-[#493024] px-5 py-3 text-sm text-[#F5E9D8] transition hover:border-[#D99045]"
            >
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      
<div className="mt-8 rounded-xl border border-[#493024] bg-[#17100D] p-5 sm:p-6">
  <h3 className="text-lg font-semibold text-[#F5E9D8]">
    Carteira secundária
  </h3>

  <p className="mt-2 text-sm text-[#BDAA97]">
    {wallets.some((wallet) => wallet.role === 'secundaria')
      ? 'Você já adicionou uma carteira secundária.'
      : 'Você não adicionou nenhuma carteira secundária.'}
  </p>

  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <label className="flex items-center gap-3 text-sm text-[#F5E9D8]">
      <input
        type="radio"
        name="secondaryWalletOption"
        checked={sameAsPrimary}
        onChange={handleSameAsPrimary}
        disabled={!primaryWallet}
        className="accent-[#D99045] disabled:opacity-50"
        />
      Igual à carteira principal
    </label>

    <button
      type="button"
      onClick={() => {
  setForm({ ...emptyWallet, role: 'secundaria' })
  setEditingId(null)
  setAddingSecondary(true)
  setSameAsPrimary(false)
  document.querySelector('form')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}}
      disabled={wallets.some((wallet) => wallet.role === 'secundaria')}
      className="w-fit rounded-md bg-[#D99045] px-5 py-3 text-sm font-semibold text-[#21140C] transition hover:bg-[#F0AA5B] disabled:cursor-not-allowed disabled:opacity-50"
    >
      Adicionar
    </button>
  </div>
  {sameAsPrimary && primaryWallet && (
  <div className="mt-4 rounded-lg border border-[#493024] p-4">
    <p className="text-sm font-semibold text-[#F5E9D8]">
      Carteira secundária
    </p>
    <p className="mt-1 text-sm text-[#BDAA97]">
      Utilizando a mesma carteira principal: {primaryWallet.displayName}
    </p>
    <p className="mt-1 break-all text-xs text-[#E7A04B]">
      {primaryWallet.address}
    </p>
  </div>
)}
</div>


      <div className="mt-8">
        <h3 className="text-lg font-semibold text-[#F5E9D8]">
          Carteiras cadastradas ({wallets.length})
        </h3>

        {wallets.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-[#493024] p-5 text-sm text-[#BDAA97]">
            Nenhuma carteira cadastrada ainda.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="flex flex-col gap-4 rounded-lg border border-[#493024] bg-[#17100D] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h4 className="font-semibold text-[#F5E9D8]">
                    {wallet.displayName}
                  </h4>
                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      wallet.role === 'principal'
                        ? 'bg-[#D99045]/15 text-[#E7A04B]'
                        : 'bg-[#39251B] text-[#D4C1AD]'
                    }`}
                  >
                    {wallet.role === 'principal' ? 'Principal' : 'Secundária'}
                  </span>
                  <p className="mt-1 text-sm text-[#BDAA97]">
                    {wallet.nickname} · {wallet.network} · {wallet.walletType}
                  </p>
                  <p className="mt-2 break-all text-xs text-[#E7A04B]">
                    {wallet.address}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => editWallet(wallet)}
                  className="w-fit rounded-md border border-[#493024] px-4 py-2 text-sm text-[#F5E9D8] transition hover:border-[#D99045]"
                >
                  Editar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}