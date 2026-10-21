
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type CartItem = {
  id: number
  image: string
  name: string
  creator: string
  price: string
  blockchain: string
  available: number
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'kurio-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) as CartItem[] : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])
  
  useEffect(() => {
  console.log('Carrinho atualizado:', items)
}, [items])

  function addItem(item: Omit<CartItem, 'quantity'>) {
    console.log('NFT recebido pelo contexto:', item)
    setItems((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id)

      if (existing) {
        if (existing.quantity >= existing.available) {
          return current
        }

        return current.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }

      if (item.available <= 0) {
        return current
      }

      return [...current, { ...item, quantity: 1 }]
    })
  }

  function removeItem(id: number) {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  function updateQuantity(id: number, quantity: number) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, Math.min(item.available, Math.floor(quantity))),
            }
          : item
      )
    )
  }

  function clearCart() {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart precisa ser usado dentro de CartProvider')
  }

  return context
}
