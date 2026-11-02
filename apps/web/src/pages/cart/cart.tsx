import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router"
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  AlertCircle,
  MapPin,
  Loader2,
  Banknote,
  CreditCard,
} from "lucide-react"
import { useShop } from "@/hooke/ShopContext"
import { useAuth } from "@/hooke/useAuth"
import { axiosPublic } from "@/hooke/useAxiosPublic"
import CartAddressSection from "./CartAddressSection"
import type { UserAddress } from "@/hooke/useAddresses"
import { AuthModal } from "@/components/modules/auth/AuthModal"

export default function CartPage() {
  const navigate = useNavigate()
  const {
    cartItems,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    totalCartItems,
    totalCartPrice,
  } = useShop()

  const { user } = useAuth()

  // Address selection state
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null)
  const [paymentType, setPaymentType] = useState<"COD" | "ONLINE">("COD")
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const addressSectionRef = useRef<HTMLDivElement>(null)

  // Calculations: Fixed $60 shipping fee when cart has items
  const subtotal = totalCartPrice
  const shipping = subtotal === 0 ? 0 : 60
  const finalTotal = subtotal + shipping

  // Proceed to Checkout / Place Order
  const handleProceedToCheckout = async () => {
    setCheckoutError(null)

    if (cartItems.length === 0) {
      setCheckoutError("Your cart is empty. Please add items to checkout.")
      return
    }

    if (!user) {
      setCheckoutError("Please sign in or register to complete your order.")
      setIsAuthModalOpen(true)
      return
    }

    if (!selectedAddress) {
      setCheckoutError("Please select or add a delivery address below before proceeding.")
      addressSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    setIsPlacingOrder(true)

    // Backend payload: POST /api/v1/user/order/
    const orderPayload = {
      address_id: Number(selectedAddress.id),
      products: cartItems.map((item) => ({
        product_id: Number(item.product.id),
        quantity: item.quantity,
      })),
      shipping_fee: Number(shipping).toFixed(2),
      payment_type: paymentType,
    }

    try {
      const res = await axiosPublic.post("/api/v1/user/order/", orderPayload)
      const data = res.data?.data

      // ONLINE payment: Redirect to Stripe Checkout session URL
      if (paymentType === "ONLINE") {
        if (data?.url) {
          clearCart()
          window.location.href = data.url
          return
        }
      }

      // COD payment: Clear cart and redirect to user profile order history
      clearCart()
      navigate("/profile?tab=orders")
    } catch (err: any) {
      console.error("Checkout error:", err)
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        "Could not place order. Please review your address and cart."
      setCheckoutError(msg)
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Continue Shopping</span>
        </Link>

        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-stone-500 hover:text-rose-600 dark:text-stone-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-stone-900 dark:text-stone-100">
            Shopping Cart
          </h1>
          <span className="flex items-center justify-center size-7 rounded-full bg-stone-100 dark:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300">
            {totalCartItems}
          </span>
        </div>
        <p className="mt-2 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Review your selected skincare essentials, select your delivery address, and proceed to checkout.
        </p>
      </div>

      {/* Empty State */}
      {cartItems.length === 0 ? (
        <div className="text-center py-16 sm:py-24 px-4 rounded-3xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800 max-w-lg mx-auto">
          <div className="size-16 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center mx-auto mb-5 shadow-xs">
            <ShoppingBag className="size-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-900 dark:text-stone-100">
            Your Cart is Empty
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-2 max-w-sm mx-auto leading-relaxed">
            Your bag is waiting for personalized skincare. Add items from your favorites or browse our complete collection.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-[#2b2e32] hover:bg-[#1b1c1e] text-white text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-95"
            >
              Explore Products
            </Link>
            <Link
              to="/favorite"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-medium transition-all"
            >
              View Favorites
            </Link>
          </div>
        </div>
      ) : (
        /* Cart Layout: Items List & Address (Left) + Order Summary (Right) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Cart Items List + Address Section */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Items List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  Cart Items ({totalCartItems})
                </h2>
              </div>

              {cartItems.map((item) => {
                const product = item.product
                const unitPrice = parseFloat(product.price || "0")
                const itemTotal = (unitPrice * item.quantity).toFixed(2)

                return (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs transition-shadow hover:shadow-sm"
                  >
                    {/* Image */}
                    <div className="relative size-24 sm:size-28 shrink-0 rounded-xl bg-[#f8f9fa] dark:bg-stone-800/60 p-2 flex items-center justify-center overflow-hidden border border-stone-100 dark:border-stone-800">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-between flex-1 w-full text-center sm:text-left">
                      <div>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                          <span className="capitalize">{product.category_name || "Skincare"}</span>
                          {product.size && <span>• {product.size}ml</span>}
                        </div>

                        <h3 className="font-serif font-medium text-stone-900 dark:text-stone-100 text-base sm:text-lg mt-0.5">
                          {product.title}
                        </h3>

                        {product.sub_title && (
                          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                            {product.sub_title}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden bg-stone-50 dark:bg-stone-800">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(product.id, item.quantity - 1)}
                            className="px-2.5 py-1 text-stone-600 hover:bg-stone-200/70 dark:text-stone-300 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="px-3 py-1 text-xs sm:text-sm font-semibold min-w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(product.id, item.quantity + 1)}
                            disabled={item.quantity >= (product.stock || 99)}
                            className="px-2.5 py-1 text-stone-600 hover:bg-stone-200/70 dark:text-stone-300 dark:hover:bg-stone-700 transition-colors disabled:opacity-40 cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>

                        {/* Price & Remove */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-base font-semibold text-stone-900 dark:text-stone-100">
                              ${itemTotal}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-[11px] text-stone-400">
                                (${unitPrice.toFixed(2)} each)
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                            aria-label="Remove item"
                            title="Remove item"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 2. Delivery Address Management & Selection Section */}
            <div ref={addressSectionRef} className="pt-2">
              <CartAddressSection
                selectedAddressId={selectedAddress?.id ?? null}
                onSelectAddress={(addr) => {
                  setSelectedAddress(addr)
                  if (checkoutError) setCheckoutError(null)
                }}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
              />
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 sticky top-28 space-y-4">
            <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-6">
              <h2 className="text-lg font-serif font-medium text-stone-900 dark:text-stone-100 pb-3 border-b border-stone-100 dark:border-stone-800">
                Order Summary
              </h2>

              {/* Selected Address Preview */}
              <div className="rounded-xl bg-stone-50 dark:bg-stone-800/60 p-3.5 border border-stone-200/80 dark:border-stone-700 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="size-3.5 text-stone-700 dark:text-stone-300" />
                    <span>Shipping Address</span>
                  </span>
                  {selectedAddress && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                      ID: #{selectedAddress.id}
                    </span>
                  )}
                </div>

                {selectedAddress ? (
                  <div className="text-stone-800 dark:text-stone-200 pt-1">
                    <p className="font-semibold line-clamp-1">{selectedAddress.address_line1}</p>
                    <p className="text-stone-500 dark:text-stone-400 text-[11px]">
                      {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zip_code}
                    </p>
                    <p className="text-stone-500 dark:text-stone-400 text-[11px]">
                      {selectedAddress.phone_number}
                    </p>
                  </div>
                ) : (
                  <div className="text-amber-600 dark:text-amber-400 text-[11px] pt-1 flex items-center gap-1.5">
                    <AlertCircle className="size-3.5 shrink-0" />
                    <span>No delivery address selected. Please select one below.</span>
                  </div>
                )}
              </div>

              {/* Payment Method Choose Field: COD vs ONLINE */}
              <div className="space-y-2 pt-1 border-t border-stone-100 dark:border-stone-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    Payment Method
                  </span>
                  <span className="text-[10px] text-stone-400">Select delivery type</span>
                </div>

                <div className="space-y-2">
                  {/* Cash on Delivery (COD) */}
                  <div
                    onClick={() => setPaymentType("COD")}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      paymentType === "COD"
                        ? "border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800/80 shadow-2xs ring-1 ring-stone-900/10 dark:ring-stone-100/20"
                        : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`size-4 rounded-full border flex items-center justify-center transition-colors ${
                          paymentType === "COD"
                            ? "border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100"
                            : "border-stone-300 dark:border-stone-600"
                        }`}
                      >
                        {paymentType === "COD" && (
                          <div className="size-1.5 rounded-full bg-white dark:bg-stone-900" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                          <Banknote className="size-3.5 text-stone-700 dark:text-stone-300" />
                          <span>Cash on Delivery</span>
                        </p>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          Pay cash upon receiving package
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      COD
                    </span>
                  </div>

                  {/* Online Delivery / Payment */}
                  <div
                    onClick={() => setPaymentType("ONLINE")}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      paymentType === "ONLINE"
                        ? "border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800/80 shadow-2xs ring-1 ring-stone-900/10 dark:ring-stone-100/20"
                        : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`size-4 rounded-full border flex items-center justify-center transition-colors ${
                          paymentType === "ONLINE"
                            ? "border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100"
                            : "border-stone-300 dark:border-stone-600"
                        }`}
                      >
                        {paymentType === "ONLINE" && (
                          <div className="size-1.5 rounded-full bg-white dark:bg-stone-900" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                          <CreditCard className="size-3.5 text-stone-700 dark:text-stone-300" />
                          <span>Online Delivery</span>
                        </p>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          Debit / Credit Card (Stripe)
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                      ONLINE
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Details */}
              <div className="space-y-3 pt-2 text-xs sm:text-sm border-t border-stone-100 dark:border-stone-800">
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Subtotal ({totalCartItems} items)</span>
                  <span className="font-medium text-stone-900 dark:text-stone-100">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span className="flex items-center gap-1.5">
                    <Truck className="size-3.5 text-stone-600 dark:text-stone-300" />
                    <span>Shipping Fee</span>
                    <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500">
                      Fixed
                    </span>
                  </span>
                  <span className="font-medium text-stone-900 dark:text-stone-100">
                    ${shipping.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t border-stone-200 dark:border-stone-800 text-base font-semibold text-stone-900 dark:text-stone-100">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Error Message */}
              {checkoutError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0 text-rose-600" />
                  <span>{checkoutError}</span>
                </div>
              )}

              {/* Checkout Button */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                disabled={isPlacingOrder}
                className="w-full py-3.5 px-6 rounded-xl bg-[#2b2e32] hover:bg-[#1a1c1e] text-white text-xs sm:text-sm font-medium transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPlacingOrder ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {paymentType === "ONLINE"
                        ? "Proceed to Online Payment"
                        : "Place Order (Cash on Delivery)"}
                    </span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-center gap-4 text-[11px] text-stone-500">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-stone-600 dark:text-stone-300" />
                  <span>Secure Checkout</span>
                </div>
                <span>•</span>
                <div>30-Day Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal for unauthenticated users */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </div>
  )
}
