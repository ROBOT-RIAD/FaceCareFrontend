import { useSearchParams, Link, useNavigate } from "react-router"
import { CheckCircle2, Package, ArrowRight, Home, Loader2, AlertCircle, ShieldCheck } from "lucide-react"
import { usePaymentStatus } from "@/hooke/useOrders"

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const sessionId = searchParams.get("session_id")

  const { data, isLoading, isError, error, refetch } = usePaymentStatus(sessionId)

  return (
    <div className="py-12 sm:py-20 max-w-3xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-10 shadow-lg text-center">
        {/* Loading State */}
        {isLoading && (
          <div className="py-12 space-y-4">
            <Loader2 className="size-10 animate-spin text-stone-900 dark:text-stone-100 mx-auto" />
            <h2 className="text-xl font-serif font-medium text-stone-900 dark:text-stone-100">
              Verifying Stripe Payment...
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Please wait while we confirm your transaction and generate your order details.
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="py-8 space-y-4">
            <div className="size-16 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="size-8" />
            </div>
            <h2 className="text-xl font-serif font-medium text-stone-900 dark:text-stone-100">
              Payment Verification Issue
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
              {(error as any)?.message ||
                "Could not retrieve the payment status at this moment. If you were charged, your order is safe and recorded."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => refetch()}
                className="px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                Retry Check
              </button>
              <Link
                to="/profile?tab=orders"
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:text-stone-900 text-xs sm:text-sm font-medium transition-colors"
              >
                Go to Order History
              </Link>
            </div>
          </div>
        )}

        {/* Success State */}
        {data && !isLoading && (
          <div className="space-y-6 animate-in zoom-in-95 duration-200">
            {/* Header Badge */}
            <div className="size-16 sm:size-20 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-9 sm:size-11" />
            </div>

            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                Payment Complete
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-medium text-stone-900 dark:text-stone-100 mt-1">
                Thank You for Your Order!
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1.5 max-w-md mx-auto">
                Your payment was successfully processed via Stripe. Your skincare items will soon be dispatched.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/80 p-5 sm:p-6 text-left space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-200 dark:border-stone-700">
                <div>
                  <span className="text-[11px] text-stone-400 uppercase tracking-wider block">Order ID</span>
                  <span className="text-base font-bold text-stone-900 dark:text-stone-100">
                    #{data.order_id}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 uppercase tracking-wider block">Payment Status</span>
                  <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 inline-block">
                    {data.payment_status || "PAID"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="text-stone-400 block text-[11px]">Order Status</span>
                  <span className="font-medium text-stone-800 dark:text-stone-200 capitalize">
                    {data.order_status || "Pending"}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Total Paid Amount</span>
                  <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    ${Number(data.total_price || 0).toFixed(2)} {data.currency?.toUpperCase() || "USD"}
                  </span>
                </div>
              </div>

              {data.session_id && (
                <div className="pt-2 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-[11px] text-stone-400">
                  <span>Stripe Session</span>
                  <span className="font-mono truncate max-w-[200px] sm:max-w-[300px]">
                    {data.session_id}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons as user requested: See Order History or Home Page */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => navigate("/profile?tab=orders")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:text-stone-900 text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Package className="size-4" />
                <span>See Order in History</span>
                <ArrowRight className="size-4" />
              </button>

              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-medium transition-all cursor-pointer"
              >
                <Home className="size-4" />
                <span>Return to Home</span>
              </Link>
            </div>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-stone-400">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>Encrypted 256-bit Stripe Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
