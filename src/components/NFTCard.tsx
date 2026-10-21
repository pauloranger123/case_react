import { useState } from 'react'
import { Link } from '@tanstack/react-router'

type NFTCardProps = {
  id: number
  image: string
  name: string
  creator: string
  price: string
}

export default function NFTCard({
  id,
  image,
  name,
  creator,
  price,
}: NFTCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <article className="group overflow-hidden rounded-xl border border-[#3D2B20] bg-[#211711] transition duration-300 hover:-translate-y-1 hover:border-[#A86C35]">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <button
          type="button"
          onClick={() => setIsFavorite(!isFavorite)}
          aria-label={
            isFavorite
              ? `Remover ${name} dos favoritos`
              : `Adicionar ${name} aos favoritos`
          }
          aria-pressed={isFavorite}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#17100D]/80 text-lg text-white backdrop-blur transition hover:bg-[#D99045] hover:text-[#21140C]"
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="truncate font-semibold text-[#F5E9D8]">
            {name}
          </h3>

          <p className="mt-1 text-sm text-[#BDAA97]">
            por {creator}
          </p>
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-[#3D2B20] pt-3">
          <div>
            <p className="text-xs text-[#BDAA97]">Preço atual</p>
            <p className="mt-1 font-bold text-[#E7A04B]">
              {price} ETH
            </p>
          </div>

          <Link
            to="/nft/$nftId"
            params={{ nftId: String(id) }}
            className="rounded-md border border-[#A86C35] px-3 py-2 text-xs font-semibold text-[#E7A04B] transition hover:bg-[#D99045] hover:text-[#21140C]"
            >
            Ver NFT
            </Link>
        </div>
      </div>
    </article>
  )
}
