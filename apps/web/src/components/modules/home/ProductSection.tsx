import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, X, Check, Heart, ShoppingBag } from "lucide-react"
import { axiosPublic } from "@/hooke/useAxiosPublic"
import { useShop } from "@/hooke/ShopContext"
import type { Product } from "@/hooke/ShopContext"

export function ProductSection() {
  const { isFavorite, toggleFavorite, addToCart } = useShop()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [addedFeedback, setAddedFeedback] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [justAddedId, setJustAddedId] = useState<number | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosPublic.get("/api/v1/product/")
      const data = res?.data?.data?.results || res?.data?.results || []
      setProducts(data)
    } catch (err: any) {
      setError(err?.message || "Failed to load products. Please check server.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Check scroll position to enable/disable arrow buttons
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 10)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScroll)
      window.addEventListener("resize", checkScroll)
      return () => {
        container.removeEventListener("scroll", checkScroll)
        window.removeEventListener("resize", checkScroll)
      }
    }
  }, [products])

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const cardWidth = 360
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }

  // Quick action: Add to Cart from card
  const handleQuickAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (!product.is_available || product.stock <= 0) return
    addToCart(product, 1)
    setJustAddedId(product.id)
    setToastMessage(`"${product.title}" added to cart!`)
    setTimeout(() => setJustAddedId(null), 1800)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Quick action: Toggle Favorite with toast feedback
  const handleToggleFavorite = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const currentlyFav = isFavorite(product.id)
    toggleFavorite(product)
    setToastMessage(
      currentlyFav
        ? `"${product.title}" removed from favorites`
        : `"${product.title}" added to favorites!`
    )
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Open modal and fetch full detail if needed
  const handleOpenDetails = async (product: Product) => {
    setSelectedProduct(product)
    setQuantity(1)
    try {
      const res = await axiosPublic.get(`/api/v1/product/${product.id}/`)
      if (res?.data?.data) {
        setSelectedProduct(res.data.data)
      }
    } catch {
      // fallback to existing product data
    }
  }

  // ESC key for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedProduct) {
        setSelectedProduct(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedProduct])

  return (
    <section className="w-full py-12 sm:py-20 bg-white dark:bg-stone-950 transition-colors relative">
      {/* Floating feedback toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[110] flex items-center gap-2.5 px-4 py-3 bg-[#2b2e32] text-white rounded-xl shadow-2xl border border-stone-700 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom-4">
          <Check className="size-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-[40px] font-serif font-normal text-stone-900 dark:text-stone-100 tracking-tight">
            Products
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex flex-col space-y-4">
                <div className="aspect-square bg-stone-100 dark:bg-stone-900 rounded-xl" />
                <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-3/4" />
                <div className="h-3 bg-stone-100 dark:bg-stone-900 rounded w-1/2" />
                <div className="h-10 bg-stone-200 dark:bg-stone-800 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-12 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 max-w-lg mx-auto">
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-6 py-2 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Carousel Slider */}
        {!loading && !error && products.length > 0 && (
          <div className="relative group/slider">
            {/* Left Navigation Arrow */}
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`absolute -left-2 sm:-left-5 top-1/3 -translate-y-1/2 z-20 size-10 sm:size-11 rounded-full bg-white dark:bg-stone-800 shadow-lg border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-800 dark:text-stone-100 hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                !canScrollLeft ? "opacity-30 cursor-not-allowed" : "hover:shadow-xl"
              }`}
              aria-label="Previous products"
            >
              <ChevronLeft className="size-5" />
            </button>

            {/* Right Navigation Arrow */}
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`absolute -right-2 sm:-right-5 top-1/3 -translate-y-1/2 z-20 size-10 sm:size-11 rounded-full bg-white dark:bg-stone-800 shadow-lg border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-800 dark:text-stone-100 hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                !canScrollRight ? "opacity-30 cursor-not-allowed" : "hover:shadow-xl"
              }`}
              aria-label="Next products"
            >
              <ChevronRight className="size-5" />
            </button>

            {/* Horizontal Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex items-stretch gap-6 sm:gap-8 overflow-x-auto scroll-smooth scrollbar-none pb-4 px-1"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {products.map((product) => {
                const categoryLabel = product.category_name || "Skincare"
                const benefitText =
                  product.key_benefits || product.sub_title || product.title
                const skinTypeText =
                  product.skin_type || "All skin types, including sensitive"
                const isItemInStock = product.is_available && (product.stock ?? 0) > 0

                return (
                  <div
                    key={product.id}
                    className="w-[280px] sm:w-[320px] lg:w-[360px] shrink-0 flex flex-col justify-between group"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    {/* Top: Image Card */}
                    <div className="relative aspect-square w-full rounded-xl bg-[#f8f9fa] dark:bg-stone-900/60 overflow-hidden p-6 sm:p-8 flex items-center justify-center transition-all duration-300 group-hover:shadow-sm border border-stone-100 dark:border-stone-800/80">
                      {/* Category Badge Pill */}
                      <span className="absolute top-3.5 left-3.5 z-10 bg-[#2b2e32] text-white text-[11px] sm:text-xs font-medium px-3.5 py-1 rounded-full shadow-xs tracking-wide capitalize">
                        {categoryLabel}
                      </span>

                      {/* Quick Favorite Heart on Card */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleFavorite(product, e)}
                        className="absolute top-3.5 right-3.5 z-10 size-8 rounded-full bg-white/90 dark:bg-stone-800/90 hover:bg-white dark:hover:bg-stone-800 text-stone-400 hover:text-rose-500 flex items-center justify-center shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                        aria-label="Toggle favorite"
                        title={isFavorite(product.id) ? "Remove from favorites" : "Save to favorites"}
                      >
                        <Heart
                          className={`size-4 transition-colors ${
                            isFavorite(product.id)
                              ? "fill-rose-500 text-rose-500"
                              : "text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300"
                          }`}
                        />
                      </button>

                      {/* Product Image */}
                      <img
                        src={product.image}
                        alt={product.title}
                        className="max-h-[85%] max-w-[85%] object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-sm select-none"
                        loading="lazy"
                      />
                    </div>

                    {/* Bottom: Text Content, Price, and Action Buttons */}
                    <div className="flex flex-col flex-1 justify-between pt-4 pb-1">
                      <div>
                        {/* Benefits Headline */}
                        <p className="text-stone-900 dark:text-stone-100 text-sm sm:text-[15px] font-medium leading-snug line-clamp-2 min-h-[42px] mb-1">
                          {benefitText}
                        </p>

                        {/* Skin Type Subtitle */}
                        <p className="text-xs text-stone-500 dark:text-stone-400 mb-2.5 line-clamp-1 capitalize font-normal">
                          {skinTypeText}
                        </p>

                        {/* Price & Stock status */}
                        <div className="flex items-center justify-between mb-3 pt-1 border-t border-stone-100 dark:border-stone-800/80">
                          <span className="text-base sm:text-lg font-semibold text-stone-900 dark:text-stone-100">
                            ${parseFloat(product.price || "0").toFixed(2)}
                          </span>
                          <span
                            className={`text-[11px] font-medium ${
                              isItemInStock
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-500"
                            }`}
                          >
                            {isItemInStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                      </div>

                      {/* Action Row: View Details & Quick Add to Cart */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenDetails(product)}
                          className="flex-1 py-2 sm:py-2.5 border border-stone-800 dark:border-stone-400 text-stone-900 dark:text-stone-100 hover:bg-stone-900 hover:text-white dark:hover:bg-stone-100 dark:hover:text-stone-900 transition-all duration-200 text-xs sm:text-sm font-medium tracking-wide rounded-[2px] cursor-pointer text-center"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleQuickAddToCart(product, e)}
                          disabled={!isItemInStock}
                          className={`size-9 sm:size-10 rounded-[2px] flex items-center justify-center transition-all shadow-xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer ${
                            justAddedId === product.id
                              ? "bg-emerald-600 text-white"
                              : "bg-[#2b2e32] hover:bg-[#1a1c1e] text-white"
                          }`}
                          title={isItemInStock ? "Add to Cart" : "Out of Stock"}
                          aria-label="Add to Cart"
                        >
                          {justAddedId === product.id ? (
                            <Check className="size-4 animate-in zoom-in-50" />
                          ) : (
                            <ShoppingBag className="size-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12 text-stone-500 text-sm">
            No products available at the moment.
          </div>
        )}
      </div>

      {/* ================= Product Details Modal ================= */}
      {selectedProduct &&
        createPortal(
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 pt-28 sm:pt-32 pb-8 bg-black/[0.08] overflow-y-auto animate-in fade-in duration-150"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="relative w-full max-w-2xl bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-2xl shadow-2xl shadow-stone-950/25 overflow-hidden border border-stone-200/90 dark:border-stone-800 max-h-[calc(100vh-9.5rem)] flex flex-col mt-4 sm:mt-6 animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Close Button */}
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 size-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="size-4" />
              </button>

              {/* Modal Body */}
              <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-center">
                  {/* Left: Product Image Showcase */}
                  <div className="relative aspect-square w-full rounded-xl bg-stone-50 dark:bg-stone-800/60 p-6 flex items-center justify-center border border-stone-100 dark:border-stone-800">
                    <span className="absolute top-3 left-3 bg-[#2b2e32] text-white text-[11px] font-medium px-3 py-1 rounded-full capitalize">
                      {selectedProduct.category_name || "Skincare"}
                    </span>
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                      className="max-h-[85%] max-w-[85%] object-contain drop-shadow-md"
                    />
                  </div>

                  {/* Right: Key Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                      {selectedProduct.sku && <span>SKU: {selectedProduct.sku}</span>}
                      {selectedProduct.size && (
                        <>
                          <span>•</span>
                          <span>{selectedProduct.size}ml</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif font-medium leading-tight">
                      {selectedProduct.title}
                    </h3>

                    {selectedProduct.sub_title && (
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                        {selectedProduct.sub_title}
                      </p>
                    )}

                    <div className="flex items-baseline gap-3 pt-1">
                      <span className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
                        ${parseFloat(selectedProduct.price || "0").toFixed(2)}
                      </span>
                      {parseFloat(selectedProduct.discount || "0") > 0 && (
                        <span className="text-xs text-amber-600 font-medium px-2 py-0.5 rounded bg-amber-50">
                          Save ${selectedProduct.discount}
                        </span>
                      )}
                    </div>

                    {/* Stock & Availability */}
                    <div className="flex items-center gap-2 text-xs pt-1">
                      <span
                        className={`size-2 rounded-full ${
                          selectedProduct.is_available && selectedProduct.stock > 0
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="text-stone-600 dark:text-stone-400">
                        {selectedProduct.is_available && selectedProduct.stock > 0
                          ? `In Stock (${selectedProduct.stock} available)`
                          : "Out of Stock"}
                      </span>
                    </div>

                    {/* Skin Type */}
                    {selectedProduct.skin_type && (
                      <div className="pt-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block mb-1">
                          Suitable For
                        </span>
                        <span className="text-xs text-stone-700 dark:text-stone-300 capitalize bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full">
                          {selectedProduct.skin_type}
                        </span>
                      </div>
                    )}

                    {/* Quantity Selector */}
                    <div className="pt-3 flex items-center gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                        Quantity:
                      </span>
                      <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden bg-stone-50 dark:bg-stone-800">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          disabled={quantity <= 1}
                          className="px-3 py-1 text-stone-700 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-stone-700 transition-colors disabled:opacity-40 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs sm:text-sm font-semibold min-w-8 text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity((q) =>
                              Math.min(selectedProduct.stock || 99, q + 1)
                            )
                          }
                          disabled={quantity >= (selectedProduct.stock || 99)}
                          className="px-3 py-1 text-stone-700 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-stone-700 transition-colors disabled:opacity-40 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedProduct.description && (
                  <div className="border-t border-stone-200 dark:border-stone-800 pt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                      Description
                    </h4>
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-light">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}

                {/* Key Benefits */}
                {selectedProduct.key_benefits && (
                  <div className="border-t border-stone-200 dark:border-stone-800 pt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                      Key Benefits
                    </h4>
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-light">
                      {selectedProduct.key_benefits}
                    </p>
                  </div>
                )}

                {/* Key Ingredients */}
                {selectedProduct.key_ingredients && (
                  <div className="border-t border-stone-200 dark:border-stone-800 pt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                      Key Ingredients
                    </h4>
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-light">
                      {selectedProduct.key_ingredients}
                    </p>
                  </div>
                )}

                {/* How to use */}
                {selectedProduct.how_to_use && (
                  <div className="border-t border-stone-200 dark:border-stone-800 pt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                      How To Use
                    </h4>
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-light">
                      {selectedProduct.how_to_use}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer with Favorite & Add to Cart buttons */}
              <div className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 flex flex-wrap sm:flex-nowrap items-center gap-3">
                {/* 1. Favorite Button */}
                <button
                  type="button"
                  onClick={() => handleToggleFavorite(selectedProduct)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all active:scale-95 cursor-pointer ${
                    isFavorite(selectedProduct.id)
                      ? "border-rose-400 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800"
                      : "border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                  }`}
                  aria-label="Add to favorites"
                >
                  <Heart
                    className={`size-4 transition-colors ${
                      isFavorite(selectedProduct.id)
                        ? "fill-rose-500 text-rose-500"
                        : "text-stone-500 dark:text-stone-400"
                    }`}
                  />
                  <span>{isFavorite(selectedProduct.id) ? "Favorited" : "Favorite"}</span>
                </button>

                {/* 2. Add to Cart Button */}
                <button
                  type="button"
                  onClick={() => {
                    addToCart(selectedProduct, quantity)
                    setAddedFeedback(true)
                    setToastMessage(`Added ${quantity} item(s) to your cart!`)
                    setTimeout(() => setAddedFeedback(false), 2200)
                    setTimeout(() => setToastMessage(null), 3000)
                  }}
                  disabled={!selectedProduct.is_available || selectedProduct.stock <= 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    addedFeedback
                      ? "bg-emerald-600 text-white"
                      : "bg-[#2b2e32] hover:bg-[#1a1c1e] text-white shadow-stone-900/10"
                  }`}
                >
                  {addedFeedback ? (
                    <>
                      <Check className="size-4 animate-in zoom-in-50" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="size-4" />
                      <span>
                        {!selectedProduct.is_available || selectedProduct.stock <= 0
                          ? "Out of Stock"
                          : `Add to Cart • $${(
                              parseFloat(selectedProduct.price || "0") * quantity
                            ).toFixed(2)}`}
                      </span>
                    </>
                  )}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  )
}

export default ProductSection
