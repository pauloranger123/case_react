
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useCart } from '../contexts/CartContext'
import { api } from '../lib/api'
import type { NFT } from '../data/nfts'
import { useState } from 'react'

export const Route = createFileRoute('/nft/$nftId')({
  component: NFTDetails,
})

function NFTDetails() {
  const { addItem } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)
  const { nftId } = Route.useParams()

  const {
    data: nft,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['nfts', nftId],
    queryFn: async () => {
      const response = await api.get<NFT>(`/nfts/${nftId}`)
      return response.data
    },
    retry: false,
  })

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#17100D] px-5 text-[#C9B6A2]">
        Carregando NFT...
      </main>
    )
  }

  if (isError || !nft) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#17100D] px-5 text-center">
        <h1 className="text-3xl font-bold text-[#F5E8D8]">
          NFT não encontrado
        </h1>
        <p className="mt-3 text-[#C9B6A2]">
          Esse NFT não existe ou não está disponível.
        </p>
        <Link
          to="/"
          className="mt-6 rounded-lg bg-[#D99045] px-5 py-3 font-semibold text-[#21140C] transition hover:bg-[#F0AA5B]"
        >
          Voltar ao catálogo
        </Link>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-[#17100D] text-[#F5E8D8]">
      <header className="border-b border-[#493024]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link to="/" className="text-2xl font-bold tracking-wide">
            Kurio<span className="text-[#D99045]">.</span>
          </Link>

          <Link
            to="/"
            className="text-sm text-[#C9B6A2] transition hover:text-[#D99045]"
          >
            ← Voltar ao catálogo
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
          <div className="overflow-hidden rounded-2xl border border-[#493024] bg-[#241811]">
            <img
              src={nft.image}
              alt={nft.name}
              className="aspect-square w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium uppercase tracking-widest text-[#D99045]">
              {nft.category === 'collectibles' ? 'Collectibles' : 'Art'}
            </span>

            <h1 className="mt-3 text-3xl font-bold md:text-5xl">
              {nft.name}
            </h1>

            <p className="mt-3 text-[#C9B6A2]">
              Criado por{' '}
              <span className="font-medium text-[#F5E8D8]">
                {nft.creator}
              </span>
            </p>

            <div className="mt-8 rounded-xl border border-[#493024] bg-[#211610] p-5">
              <p className="text-sm text-[#C9B6A2]">Preço atual</p>
              <p className="mt-2 text-3xl font-bold">
                {nft.price.toFixed(2)} ETH
              </p>
              <p className="mt-3 text-sm text-[#C9B6A2]">
                Rede: {nft.blockchain === 'ethereum' ? 'Ethereum' : 'Polygon'}
              </p>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold">Sobre este NFT</h2>
              <p className="mt-2 leading-7 text-[#C9B6A2]">
                {nft.description}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-lg bg-[#241811] px-4 py-3">
              <span className="text-sm text-[#C9B6A2]">
                Edições disponíveis
              </span>
              <span className="font-semibold">{nft.available}</span>
            </div>

            
    <button
      type="button"
      onClick={() => {
        addItem({
          id: nft.id,
          image: nft.image,
          name: nft.name,
          creator: nft.creator,
          price: nft.price.toFixed(2),
          blockchain: nft.blockchain,
          available: nft.available,
        })
        setAddedToCart(true)
      }}
      className="mt-8 w-full rounded-xl bg-[#D99045] px-6 py-4 font-bold text-[#21140C] transition hover:bg-[#F0AA5B] active:scale-[0.98]"
    >
      {addedToCart ? '✓ NFT adicionada ao carrinho!' : 'Adicionar ao carrinho'}
    </button>

{addedToCart && (
  <p
    role="status"
    className="mt-3 text-center font-medium text-green-400"
  >
    NFT adicionada ao carrinho com sucesso!
    <Link to="/cart" className="ml-2 underline">
      Ver carrinho
    </Link>
  </p>
)}


            <p className="mt-3 text-center text-xs text-[#9F8977]">
              Marketplace demonstrativo. Nenhuma transação real será realizada.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
