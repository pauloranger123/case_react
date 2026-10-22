import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type FavoriteNFT = {
  id: number
  image: string
  name: string
  creator: string
  price: string
}

type FavoritesContextType = {
  favorites: FavoriteNFT[]
  isFavorite: (id: number) => boolean
  toggleFavorite: (nft: FavoriteNFT) => void
  removeFavorite: (id: number) => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
)

const STORAGE_KEY = 'kurio-favorites'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteNFT[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? (JSON.parse(saved) as FavoriteNFT[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  function isFavorite(id: number) {
    return favorites.some((nft) => nft.id === id)
  }

  function toggleFavorite(nft: FavoriteNFT) {
    setFavorites((current) =>
      current.some((item) => item.id === nft.id)
        ? current.filter((item) => item.id !== nft.id)
        : [...current, nft],
    )
  }

  function removeFavorite(id: number) {
    setFavorites((current) => current.filter((nft) => nft.id !== id))
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)

  if (!context) {
    throw new Error('useFavorites precisa ser usado dentro de FavoritesProvider')
  }

  return context
}