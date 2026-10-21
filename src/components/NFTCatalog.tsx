
import { useNavigate, useSearch } from '@tanstack/react-router'
import NFTCard from './NFTCard'
import NFTFilters from './NFTFilters'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { NFT } from '../data/nfts'
import { api } from '../lib/api'

export default function NFTCatalog() {
  const search = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })

    const {
        data: nfts = [],
        isLoading,
        isError,
        } = useQuery({
        queryKey: ['nfts'],
        queryFn: async () => {
            const response = await api.get<{ items: NFT[]; total: number }>('/nfts')
            return response.data.items
        },
        })

 

  function updateSearch(changes: Partial<typeof search>, replace = false) {
  navigate({
    search: (previous) => ({ ...previous, ...changes }),
    replace,
    resetScroll: false,
  })
}

  function resetFilters() {
    updateSearch({
      q: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      blockchain: 'all',
      sort: 'newest',
      page: 1,
    })
  }

  const filteredNFTs = useMemo(() => {
    const query = search.q.trim().toLowerCase()    



    const filtered = nfts.filter((nft) => {
      const matchesQuery =
        query === '' ||
        nft.name.toLowerCase().includes(query) ||
        nft.creator.toLowerCase().includes(query)

      const matchesCategory =
        search.category === 'all' ||
        nft.category === search.category

      const matchesMinPrice =
        search.minPrice === '' ||
        nft.price >= Number(search.minPrice)

      const matchesMaxPrice =
        search.maxPrice === '' ||
        nft.price <= Number(search.maxPrice)

      const matchesBlockchain =
        search.blockchain === 'all' ||
        nft.blockchain === search.blockchain

   

      return (
        matchesQuery &&
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesBlockchain
      )
    })    


    switch (search.sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        filtered.sort((a, b) => b.id - a.id)
    }

    return filtered
  }, [
    nfts,
    search.q,
    search.category,
    search.minPrice,
    search.maxPrice,
    search.blockchain,
    search.sort,
  ])



  const ITEMS_PER_PAGE = 8

    const totalPages = Math.max(
    1,
    Math.ceil(filteredNFTs.length / ITEMS_PER_PAGE)
    )

    const currentPage = Math.min(search.page, totalPages)

    const paginatedNFTs = filteredNFTs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
    )

  return (
    <section id="catalogo" className="pb-20">
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E7A04B]">
          Coleção Kurio
        </p>

        <h2 className="mt-2 text-2xl font-bold text-[#F5E9D8] sm:text-3xl">
          Explore os NFTs
        </h2>

        <p className="mt-2 text-sm text-[#BDAA97]">
          Descubra peças digitais para sua coleção.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <NFTFilters
            category={search.category}
            setCategory={(value) =>
                updateSearch({
                category: value as typeof search.category,
                page: 1,
                })
            }
            minPrice={search.minPrice}
            setMinPrice={(value) =>
                updateSearch({ minPrice: value, page: 1 })
            }
            maxPrice={search.maxPrice}
            setMaxPrice={(value) =>
                updateSearch({ maxPrice: value, page: 1 })
            }
            blockchain={search.blockchain}
            setBlockchain={(value) =>
                updateSearch({
                blockchain: value as typeof search.blockchain,
                page: 1,
                })
            }
            onReset={resetFilters}
            />

        <div className="min-w-0">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex min-w-0 items-center gap-2 rounded-md border border-[#493024] bg-[#211711] px-3 py-2">
              <span className="text-[#D99045]" aria-hidden="true">⌕</span>
              <span className="sr-only">Buscar NFTs</span>
              <input
                type="search"
                value={search.q}
                onChange={(event) =>
                  updateSearch(
                    { q: event.target.value, page: 1 },
                    true,
                  )
                }
                placeholder="Buscar NFT ou criador..."
                className="min-w-0 flex-1 bg-transparent text-sm text-[#F5E9D8] outline-none placeholder:text-[#A88D73]"
              />
            </label>

            <label className="flex items-center gap-3 text-sm text-[#BDAA97]">
              Ordenar por
              <select
                value={search.sort}
                onChange={(event) =>
                  updateSearch({
                    sort: event.target.value as typeof search.sort,
                    page: 1,
                  })
                }
                className="min-w-0 rounded-md border border-[#493024] bg-[#211711] px-3 py-2 text-[#F5E9D8] outline-none focus:border-[#D99045]"
              >
                <option value="newest">Mais recentes</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="name">Nome</option>
              </select>
            </label>
          </div>

          <p className="mb-4 text-sm text-[#BDAA97]" aria-live="polite">
            {filteredNFTs.length}{' '}
            {filteredNFTs.length === 1
              ? 'NFT encontrado'
              : 'NFTs encontrados'}
          </p>

          {isLoading ? (
  <p className="py-10 text-center text-sm text-[#BDAA97]">
    Carregando NFTs...
  </p>
) : isError ? (
  <p role="alert" className="py-10 text-center text-sm text-red-400">
    Não foi possível carregar os NFTs. Tente novamente.
  </p>
) : filteredNFTs.length > 0 ? (
  <>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {paginatedNFTs.map((nft) => (
       <NFTCard
        key={nft.id}
        id={nft.id}
        image={nft.image}
        name={nft.name}
        creator={nft.creator}
        price={nft.price.toFixed(2)}
        />
      ))}
    </div>

    {totalPages > 1 && (
      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => updateSearch({ page: currentPage - 1 })}
          className="rounded-lg border border-[#493024] px-4 py-2 text-sm text-[#F5E8D8] transition hover:border-[#D99045] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Anterior
        </button>

        <span className="text-sm text-[#C9B6A2]">
          Página {currentPage} de {totalPages}
        </span>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => updateSearch({ page: currentPage + 1 })}
          className="rounded-lg border border-[#493024] px-4 py-2 text-sm text-[#F5E8D8] transition hover:border-[#D99045] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Próxima
        </button>
      </div>
    )}
  </>
) : (
  <div className="rounded-xl border border-dashed border-[#493024] px-5 py-14 text-center">
    <h3 className="font-semibold text-[#F5E9D8]">
      Nenhum NFT encontrado
    </h3>
    <p className="mt-2 text-sm text-[#BDAA97]">
      Tente alterar a busca ou os filtros.
    </p>
    <button
      type="button"
      onClick={resetFilters}
      className="mt-5 rounded-md bg-[#D99045] px-4 py-2 text-sm font-semibold text-[#21140C] hover:bg-[#F0AA5B]"
    >
      Limpar busca e filtros
    </button>
  </div>)}
            
            
          
        </div>
        
      </div>
    </section>
  )
}
