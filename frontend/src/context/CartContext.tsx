import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Product } from '../types'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  total: number
  addToCart: (product: Product) => void
  updateQuantity: (productId: number, quantity: number) => void
  removeFromCart: (productId: number) => void
  clearCart: () => void
}

const CART_STORAGE_KEY = 'shiv-creations-cart'
const CartContext = createContext<CartContextValue | undefined>(undefined)

function readStoredCart(): CartItem[] {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY)
  if (!storedCart) return []

  try {
    const parsedCart: unknown = JSON.parse(storedCart)
    if (!Array.isArray(parsedCart)) return []

    return parsedCart.filter(
      (item): item is CartItem =>
        typeof item === 'object' &&
        item !== null &&
        'product' in item &&
        'quantity' in item &&
        typeof item.quantity === 'number' &&
        item.quantity > 0,
    )
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredCart)

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((count, item) => count + item.quantity, 0)
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    return {
      items,
      itemCount,
      total,
      addToCart: (product) => {
        setItems((currentItems) => {
          const existingItem = currentItems.find((item) => item.product.id === product.id)
          if (existingItem) {
            return currentItems.map((item) =>
              item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
            )
          }
          return [...currentItems, { product, quantity: 1 }]
        })
      },
      updateQuantity: (productId, quantity) => {
        setItems((currentItems) =>
          quantity > 0
            ? currentItems.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item,
              )
            : currentItems.filter((item) => item.product.id !== productId),
        )
      },
      removeFromCart: (productId) => {
        setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId))
      },
      clearCart: () => setItems([]),
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// The provider and hook intentionally share one module so consumers have a single cart import.
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
