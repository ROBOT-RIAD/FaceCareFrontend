import { useState } from "react"
import { Link } from "react-router"
import { Heart, ShoppingBag, Trash2, ArrowLeft, Check, ArrowRight } from "lucide-react"
import { useShop } from "@/hooke/ShopContext"
import type { Product } from "@/hooke/ShopContext"

export default function FavoritePage() {
  const { favorites, removeFromFavorites, moveFavoriteToCart, addToCart, clearFavorites } = useShop()
  const [notification, setNotification] = useState<string | null>(null)

  const handleMoveToCart = (product: Product) => {
    moveFavoriteToCart(product)
    setNotification(`"${product.title}" moved to your cart!`)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleAddToCartOnly = (product: Product) => {
    addToCart(product, 1)
    setNotification(`"${product.title}" added to your cart!`)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Continue Shopping</span>
        </Link>

        {favorites.length > 0 && (
          <button
            type="button"
            onClick={clearFavorites}
            className="text-xs text-stone-500 hover:text-rose-600 dark:text-stone-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
          >
            Clear All Favorites
          </button>
        )}
      </div>

      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-stone-900 dark:text-stone-100">
            My Favorites
          </h1>
          <span className="flex items-center justify-center size-7 rounded-full bg-stone-100 dark:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300">
            {favorites.length}
          </span>
        </div>
        <p className="mt-2 text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-xl">
          Your saved skincare formulations. All stored locally on your device without needing to sign in.
        </p>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="mb-6 flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-2">
          <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="text-center py-16 sm:py-24 px-4 rounded-3xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800 max-w-lg mx-auto">
          <div className="size-16 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-500 flex items-center justify-center mx-auto mb-5 shadow-xs">
            <Heart className="size-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-900 dark:text-stone-100">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-2 max-w-sm mx-auto leading-relaxed">
            Explore our curated dermatological formulations and tap the heart icon on any product to save it here.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-[#2b2e32] hover:bg-[#1b1c1e] text-white text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-95"
            >
              Explore Products
            </Link>
            <Link
              to="/cart"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-medium transition-all"
            >
              Go to Cart
            </Link>
          </div>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {favorites.map((product) => {
            const price = parseFloat(product.price || "0").toFixed(2)
            const inStock = product.is_available && (product.stock ?? 0) > 0

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
              >
                {/* Top Image Showcase */}
                <div className="relative aspect-square w-full bg-[#f8f9fa] dark:bg-stone-800/60 p-6 flex items-center justify-center overflow-hidden">
                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 z-10 bg-[#2b2e32] text-white text-[10px] sm:text-xs font-medium px-3 py-1 rounded-full shadow-xs capitalize">
                    {product.category_name || "Skincare"}
                  </span>

                  {/* Remove from Wishlist Button */}
                  <button
                    type="button"
                    onClick={() => removeFromFavorites(product.id)}
                    className="absolute top-3 right-3 z-10 size-8 rounded-full bg-white/90 dark:bg-stone-800/90 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-stone-400 hover:text-rose-500 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                    aria-label="Remove from favorites"
                    title="Remove from favorites"
                  >
                    <Trash2 className="size-4" />
                  </button>

                  {/* Product Image */}
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-[85%] max-w-[85%] object-contain transition-transform duration-500 group-hover:scale-105 select-none"
                    loading="lazy"
                  />
                </div>

                {/* Details & Actions */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Skin Type & Size */}
                    <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1.5">
                      <span className="capitalize">{product.skin_type || "All Skin Types"}</span>
                      {product.size && <span>{product.size}ml</span>}
                    </div>

                    {/* Title */}
                    <h3 className="font-serif font-medium text-stone-900 dark:text-stone-100 text-base leading-snug line-clamp-1 mb-1">
                      {product.title}
                    </h3>

                    {/* Subtitle / Key benefits */}
                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed min-h-[32px] mb-3 font-light">
                      {product.key_benefits || product.sub_title || product.description}
                    </p>

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                          ${price}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-medium ${
                          inStock ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"
                        }`}
                      >
                        {inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons: Move to Cart & Add to Cart */}
                  <div className="pt-4 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleMoveToCart(product)}
                      disabled={!inStock}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#2b2e32] hover:bg-[#1a1c1e] text-white text-xs sm:text-sm font-medium transition-all shadow-xs active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ShoppingBag className="size-4" />
                      <span>{inStock ? "Move to Cart" : "Out of Stock"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddToCartOnly(product)}
                      disabled={!inStock}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <span>Add to Cart & Keep in Favorites</span>
                      <ArrowRight className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
