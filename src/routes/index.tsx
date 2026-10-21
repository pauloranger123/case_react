
import {
  createFileRoute,
  type SearchSchemaInput,
} from '@tanstack/react-router'
import Header from '../components/Header'
import Hero from '../components/Hero'
import NFTCatalog from '../components/NFTCatalog'

const categories = [
  'all',
  'art',
  'collectibles',
  'characters',
  'illustrations',
  'photography',
  'animations',
  'music',
  '3d',
  'generative',
  'games',
  'subscriptions',
  'utility',
] as const

const blockchains = ['all', 'ethereum', 'polygon', 'solana'] as const
const sortOptions = ['newest', 'price-asc', 'price-desc', 'name'] as const

function validPrice(value: unknown): string {
  if (typeof value !== 'string' || value.trim() === '') return ''

  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? String(number) : ''
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown> & SearchSchemaInput) => ({
    q: typeof search.q === 'string' ? search.q.slice(0, 100) : '',
    category: categories.includes(search.category as (typeof categories)[number])
      ? (search.category as (typeof categories)[number])
      : 'all',
    minPrice: validPrice(search.minPrice),
    maxPrice: validPrice(search.maxPrice),
    blockchain: blockchains.includes(search.blockchain as (typeof blockchains)[number])
      ? (search.blockchain as (typeof blockchains)[number])
      : 'all',
    sort: sortOptions.includes(search.sort as (typeof sortOptions)[number])
      ? (search.sort as (typeof sortOptions)[number])
      : 'newest',
    page: Math.max(1, Math.floor(Number(search.page) || 1)),
  }),
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen bg-[#17100D]">
      <Header />
      <main className="mx-auto max-w-7xl px-5">
        <Hero />
        <NFTCatalog />
      </main>
    </div>
  )
}
