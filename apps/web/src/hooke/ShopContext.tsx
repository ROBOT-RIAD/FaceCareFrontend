import React, { createContext, useContext, useState, useEffect } from "react"

export interface Product {
  id: number
  category?: number
  title: string
  sub_title?: string
  description?: string
  key_ingredients?: string
  size?: string
  price: string
  discount?: string
  stock: number
  reserved_stock?: number
  is_available: boolean
  skin_type?: string
  key_benefits?: string
  how_to_use?: string
  image: string
  cloudinary_public_id?: string
  sku?: string
  created_at?: string
  updated_at?: string
  category_name?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface ShopContextType {
  favorites: Product[]
  cartItems: CartItem[]
  totalFavorites: number
  totalCartItems: number
  totalCartPrice: number
  isFavorite: (productId: number) => boolean
  toggleFavorite: (product: Product) => void
  addToFavorites: (product: Product) => void
  removeFromFavorites: (productId: number) => void
  clearFavorites: () => void
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: number) => void
  updateCartQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  moveFavoriteToCart: (product: Product, quantity?: number) => void
}

const ShopContext = createContext<ShopContextType | undefined>(undefined)

const FAVORITES_STORAGE_KEY = "glowmi_favorites"
const CART_STORAGE_KEY = "glowmi_cart"

export function ShopProvider({ children }: { children: React.ReactNode }) {
  // Initialize favorites from localStorage
  const [favorites, setFavorites] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Initialize cart from localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
    } catch (e) {
      console.error("Failed to save favorites to localStorage", e)
    }
  }, [favorites])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
    } catch (e) {
      console.error("Failed to save cart to localStorage", e)
    }
  }, [cartItems])

  // Favorites helpers
  const isFavorite = (productId: number) => {
    return favorites.some((item) => item.id === productId)
  }

  const addToFavorites = (product: Product) => {
    setFavorites((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev
      return [product, ...prev]
    })
  }

  const removeFromFavorites = (productId: number) => {
    setFavorites((prev) => prev.filter((item) => item.id !== productId))
  }

  const toggleFavorite = (product: Product) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === product.id)
      if (exists) {
        return prev.filter((item) => item.id !== product.id)
      } else {
        return [product, ...prev]
      }
    })
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  // Cart helpers
  const addToCart = (product: Product, quantity = 1) => {
    const qtyToAdd = Math.max(1, quantity)
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id)
      if (existingIndex > -1) {
        const updated = [...prev]
        const maxStock = product.stock || 99
        const newQty = Math.min(maxStock, updated[existingIndex].quantity + qtyToAdd)
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        }
        return updated
      } else {
        return [...prev, { product, quantity: qtyToAdd }]
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.stock || 99
          return {
            ...item,
            quantity: Math.min(maxStock, quantity),
          }
        }
        return item
      })
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  // Requirement: Add to cart from Favorite page, and remove from Favorite page
  const moveFavoriteToCart = (product: Product, quantity = 1) => {
    addToCart(product, quantity)
    removeFromFavorites(product.id)
  }

  // Derived counts
  const totalFavorites = favorites.length

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const totalCartPrice = cartItems.reduce((sum, item) => {
    const priceNum = parseFloat(item.product.price || "0")
    return sum + (isNaN(priceNum) ? 0 : priceNum * item.quantity)
  }, 0)

  return (
    <ShopContext.Provider
      value={{
        favorites,
        cartItems,
        totalFavorites,
        totalCartItems,
        totalCartPrice,
        isFavorite,
        toggleFavorite,
        addToFavorites,
        removeFromFavorites,
        clearFavorites,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        moveFavoriteToCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider")
  }
  return context
}

export default useShop
