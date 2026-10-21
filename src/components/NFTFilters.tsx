

import PriceRange from './PriceRange'
import { useEffect, useState } from 'react'



type NFTFiltersProps = {
  category: string
  setCategory: (value: string) => void
  minPrice: string
  setMinPrice: (value: string) => void
  maxPrice: string
  setMaxPrice: (value: string) => void
  blockchain: string
  setBlockchain: (value: string) => void
  onReset: () => void
}

const categories = [
  { label: 'Arte digital', value: 'art', count: 120 },
  { label: 'Colecionáveis', value: 'collectibles', count: 86 },
  { label: 'Personagens', value: 'characters', count: 42 },
  { label: 'Ilustrações', value: 'illustrations', count: 31 },
  { label: 'Fotografia', value: 'photography', count: 18 },
  { label: 'Animações', value: 'animations', count: 12 },
]

export default function NFTFilters({
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  blockchain,
  setBlockchain,
  onReset,
}: NFTFiltersProps) {
  const [draftMin, setDraftMin] = useState(minPrice || '0')
  const [draftMax, setDraftMax] = useState(maxPrice || '1')

  useEffect(() => {
  setDraftMin(minPrice || '0')
  setDraftMax(maxPrice || '1')
}, [minPrice, maxPrice])

  function applyPrice() {
    setMinPrice(draftMin === '0' ? '' : draftMin)
    setMaxPrice(draftMax === '1' ? '' : draftMax)
  }

  function reset() {
    setDraftMin('0')
    setDraftMax('1')
    onReset()
  }

  return (
    <aside className="h-fit rounded-md border border-[#39251B] bg-[#1E140F] p-3 text-[#E8D7C4]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#F5E9D8]">
          Filtros
        </h3>

        <button
          type="button"
          onClick={reset}
          className="text-[10px] text-[#E7A04B] hover:text-[#FFD09A]"
        >
          Limpar
        </button>
      </div>

      <fieldset>
        <legend className="mb-2 text-[11px] font-semibold text-[#F5E9D8]">
          Categorias
        </legend>

        <div className="space-y-1">
  <button
    type="button"
    onClick={() => setCategory('all')}
    className={`flex w-full items-center justify-between py-1 text-left text-[10px] transition ${
      category === 'all'
        ? 'text-[#E7A04B]'
        : 'text-[#C9B6A2] hover:text-[#F5E9D8]'
    }`}
  >
    <span>Todas as categorias</span>
    <span className="text-[#A88D73]">264</span>
  </button>

  {categories.map((item) => (
    <button
      key={item.value}
      type="button"
      onClick={() => setCategory(item.value)}
      className={`flex w-full items-center justify-between py-1 text-left text-[10px] transition ${
        category === item.value
          ? 'text-[#E7A04B]'
          : 'text-[#C9B6A2] hover:text-[#F5E9D8]'
      }`}
    >
      <span>{item.label}</span>
      <span className="text-[#A88D73]">{item.count}</span>
    </button>
  ))}
</div>
      </fieldset>

      <div className="my-3 border-t border-[#39251B]" />

      
<fieldset>
  <legend className="mb-2 text-[11px] font-semibold text-[#F5E9D8]">
    Faixa de preço
  </legend>

  <PriceRange
    min={draftMin}
    max={draftMax}
    onMinChange={setDraftMin}
    onMaxChange={setDraftMax}
  />

  <button
    type="button"
    onClick={applyPrice}
    className="mt-3 rounded-sm bg-[#D99045] px-3 py-1.5 text-[10px] font-semibold text-[#21140C] transition hover:bg-[#F0AA5B]"
  >
    Aplicar
  </button>
</fieldset>


      <div className="my-3 border-t border-[#39251B]" />

      
<fieldset>
  <legend className="mb-2 text-[11px] font-semibold text-[#F5E9D8]">
    Rede
  </legend>

  <div className="space-y-1">
    {[
      { label: 'Ethereum', value: 'ethereum', count: 119 },
      { label: 'Polygon', value: 'polygon', count: 78 },
      { label: 'Solana', value: 'solana', count: 86 },
    ].map((item) => (
      <button
        key={item.value}
        type="button"
        onClick={() =>
          setBlockchain(
            blockchain === item.value ? 'all' : item.value,
          )
        }
        aria-pressed={blockchain === item.value}
        className={`flex w-full items-center justify-between py-1 text-left text-[10px] transition ${
          blockchain === item.value
            ? 'text-[#E7A04B]'
            : 'text-[#C9B6A2] hover:text-[#F5E9D8]'
        }`}
      >
        <span>{item.label}</span>
        <span className="text-[#A88D73]">({item.count})</span>
      </button>
    ))}
  </div>
</fieldset>      
    </aside>
  )
}
