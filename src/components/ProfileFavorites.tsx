import { Link } from '@tanstack/react-router'
import { useFavorites } from '../contexts/FavoritesContext'

export default function ProfileFavorites() {
  const { favorites, removeFavorite } = useFavorites()

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#E7A04B]">
          Minha coleção
        </p>
        <h2 className="mt-2 text-2xl font-bold text-[#F5E9D8]">
          Lista de interesse
        </h2>
        <p className="mt-2 text-sm text-[#D4C1AD]">
          NFTs que você salvou para acompanhar ou adquirir depois.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#493024] px-5 py-12 text-center">
          <p className="text-4xl text-[#D99045]" aria-hidden="true">
            ♡
          </p>
          <h3 className="mt-4 font-semibold text-[#F5E9D8]">
            Sua lista ainda está vazia
          </h3>
          <p className="mt-2 text-sm text-[#BDAA97]">
            Explore o catálogo e favorite os NFTs que chamarem sua atenção.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex rounded-md bg-[#D99045] px-4 py-2 text-sm font-semibold text-[#21140C] transition hover:bg-[#F0AA5B]"
          >
            Explorar NFTs
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-5 text-sm text-[#BDAA97]">
            {favorites.length} {favorites.length === 1 ? 'NFT salvo' : 'NFTs salvos'}
          </p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.map((nft) => (
              <article
                key={nft.id}
                className="overflow-hidden rounded-xl border border-[#3D2B20] bg-[#17100D]"
              >
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="aspect-square w-full object-cover"
                />

                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="truncate font-semibold text-[#F5E9D8]">
                      {nft.name}
                    </h3>
                    <p className="mt-1 text-sm text-[#BDAA97]">
                      por {nft.creator}
                    </p>
                  </div>

                  <p className="font-bold text-[#E7A04B]">
                    {nft.price} ETH
                  </p>

                  <div className="flex flex-wrap gap-2 border-t border-[#3D2B20] pt-3">
                    <Link
                      to="/nft/$nftId"
                      params={{ nftId: String(nft.id) }}
                      className="flex-1 rounded-md border border-[#A86C35] px-3 py-2 text-center text-sm font-semibold text-[#E7A04B] transition hover:bg-[#D99045] hover:text-[#21140C]"
                    >
                      Ver NFT
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeFavorite(nft.id)}
                      className="rounded-md border border-[#493024] px-3 py-2 text-sm text-[#D4C1AD] transition hover:border-red-500 hover:text-red-400"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  )
}