import { Link } from "react-router"
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"

export default function OrderCancelPage() {
  return (
    <div className="py-16 sm:py-24 max-w-xl mx-auto px-4 sm:px-6 text-center">
      <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-8 sm:p-10 shadow-lg space-y-5">
        <div className="size-16 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <AlertCircle className="size-8" />
        </div>

        <span className="text-xs font-semibold tracking-wider uppercase text-amber-600 dark:text-amber-400">
          Payment Cancelled
        </span>

        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-stone-900 dark:text-stone-100">
          Checkout Incomplete
        </h1>

        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
          Your online payment session was cancelled. No charges were made to your account, and your selected items remain safely in your shopping cart.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/cart"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:text-stone-900 text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <RefreshCw className="size-4" />
            <span>Return to Cart & Retry</span>
          </Link>

          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-medium transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
