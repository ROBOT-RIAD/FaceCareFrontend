import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "@/hooke/useAuth"
import { useShop, type Product } from "@/hooke/ShopContext"
import { AuthModal } from "@/components/modules/auth/AuthModal"
import {
  useGenerateRoutine,
  useSaveRoutine,
  type SkinIntelligenceRecord,
  type RoutineProduct,
} from "@/hooke/useSkinIntelligence"
import {
  Sparkles,
  ArrowLeft,
  X,
  Check,
  Upload,
  Calendar,
  Sun,
  Moon,
  BookmarkCheck,
  ShieldAlert,
  Loader2,
  Droplets,
  Flame,
  Camera,
  FileText,
  Package,
  Heart,
  ShoppingBag,
} from "lucide-react"

export default function AISkinIntelligencePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart, toggleFavorite, isFavorite } = useShop()

  // Form State
  const [skinType, setSkinType] = useState<string>("Dry")
  const [age, setAge] = useState<string>("")
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([
    "Dark Spots",
    "Large Pores",
  ])
  const [additionalDetails, setAdditionalDetails] = useState<string>("")
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  // Auth, Modal & Feedback State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [generatedRoutine, setGeneratedRoutine] = useState<SkinIntelligenceRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const [justAddedCartId, setJustAddedCartId] = useState<number | null>(null)

  // TanStack Query Mutations
  const generateRoutineMutation = useGenerateRoutine()
  const saveRoutineMutation = useSaveRoutine()

  // Skin Types & Concerns options
  const skinTypes = ["Oily", "Dry", "Combination", "Normal", "Sensitive"]

  const skinConcerns = [
    "Acne & Breakouts",
    "Dark Spots",
    "Fine Lines & Wrinkles",
    "Dryness",
    "Oily Skin",
    "Redness & Sensitivity",
    "Dullness",
    "Large Pores",
    "Others",
  ]

  const handleToggleConcern = (concern: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concern)
        ? prev.filter((c) => c !== concern)
        : [...prev, concern]
    )
  }

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast("Image size must be under 10MB")
        return
      }
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const showToast = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3200)
  }

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Unauthorized check: Login is required before analyzing
    if (!user) {
      showToast("Please login first to analyze your skin.")
      setIsAuthModalOpen(true)
      return
    }

    if (!skinType) {
      showToast("Please choose your skin type.")
      return
    }

    try {
      const formData = new FormData()
      formData.append("skin_type", skinType)
      formData.append("age", age || "")
      formData.append("skin_concerns", selectedConcerns.join(","))
      selectedConcerns.forEach((c) => formData.append("skin_concerns[]", c))
      formData.append("details", additionalDetails || "")
      if (photoFile) {
        formData.append("face_image", photoFile)
      }

      const res = await generateRoutineMutation.mutateAsync(formData)
      if (res && res.data) {
        setGeneratedRoutine(res.data)
        setIsModalOpen(true)
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 150)
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to generate skincare routine. Please try again."
      showToast(msg)
    }
  }

  // Handle Save Routine
  const handleSaveRoutine = async () => {
    if (!generatedRoutine) return

    try {
      await saveRoutineMutation.mutateAsync({
        id: generatedRoutine.id,
        isSaved: true,
      })
      showToast("Personalized routine saved successfully!")
      setIsModalOpen(false)
      // Redirect to Profile page Routine tab
      navigate("/profile?tab=routine")
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save routine. Please try again."
      showToast(msg)
    }
  }

  // Handle Cancel Result (Closes/clears result, routine is not saved, stays on page)
  const handleCancelModal = () => {
    setIsModalOpen(false)
  }

  // Helper: Convert RoutineProduct to Shop Product
  const toShopProduct = (prod: RoutineProduct): Product => ({
    id: prod.id,
    title: prod.title,
    sub_title: prod.sub_title,
    description: prod.description,
    price: String(prod.price || "0.00"),
    discount: prod.discount || "0.00",
    image: prod.image || "",
    stock: prod.stock ?? 20,
    reserved_stock: prod.reserved_stock ?? 0,
    is_available: prod.is_available ?? true,
    skin_type: prod.skin_type,
    key_benefits: prod.key_benefits,
    key_ingredients: prod.key_ingredients,
    how_to_use: prod.how_to_use,
    size: prod.size,
    sku: prod.sku,
    category: typeof prod.category === "object" ? prod.category?.id : prod.category,
    category_name: typeof prod.category === "object" ? prod.category?.name : undefined,
  })

  // Quick Add to Cart
  const handleAddToCart = (prod: RoutineProduct) => {
    const shopItem = toShopProduct(prod)
    addToCart(shopItem, 1)
    setJustAddedCartId(prod.id)
    setTimeout(() => setJustAddedCartId(null), 2000)
    showToast(`"${prod.title}" added to cart!`)
  }

  // Quick Toggle Favorite
  const handleToggleFavorite = (prod: RoutineProduct) => {
    const shopItem = toShopProduct(prod)
    const currentlyFav = isFavorite(prod.id)
    toggleFavorite(shopItem)
    showToast(currentlyFav ? `"${prod.title}" removed from favorites` : `"${prod.title}" added to favorites!`)
  }

  const routineJson = (() => {
    if (!generatedRoutine?.routine_json) return null
    if (typeof generatedRoutine.routine_json === "string") {
      try {
        return JSON.parse(generatedRoutine.routine_json)
      } catch {
        return null
      }
    }
    return generatedRoutine.routine_json
  })()

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Floating Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-[130] flex items-center gap-2.5 px-4 py-3 bg-[#2b2e32] text-white rounded-xl shadow-2xl border border-stone-700 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom-4">
          <Check className="size-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Page Title & Subtitle */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="size-3.5 text-primary" />
          <span>AI Skin Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-stone-900 dark:text-stone-100 tracking-tight">
          Personalized Routine Diagnosis
        </h1>
        <p className="mt-2.5 text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
          Analyze your unique skin biology and concerns with our dermatological AI to generate a tailor-made morning and evening regimen.
        </p>
      </div>

      {/* =========================================================================
          MAIN FORM
          ========================================================================= */}
      <div className="max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-[#f9f9f9] dark:bg-stone-900/70 border border-stone-200/90 dark:border-stone-800 p-6 sm:p-10 shadow-xs space-y-8"
        >
          {/* Question 1: Skin Type */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-medium text-sm sm:text-base">
              <span className="p-1 rounded bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                <Droplets className="size-4" />
              </span>
              <span>What's your skin type?</span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {skinTypes.map((type) => {
                const isSelected = skinType === type
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSkinType(type)}
                    className={`px-6 py-2 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#2b2e32] text-white shadow-xs border border-[#2b2e32]"
                        : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:border-stone-400"
                    }`}
                  >
                    {type}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Question 2: Age */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-medium text-sm sm:text-base">
              <span className="p-1 rounded bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                <Calendar className="size-4" />
              </span>
              <span>What's your age?</span>
            </div>

            <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Type your age here (e.g. 25)"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 outline-none focus:ring-1 focus:ring-stone-500 transition-all"
            />
          </div>

          {/* Question 3: Main Skin Concerns */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-medium text-sm sm:text-base">
              <span className="p-1 rounded bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                <Flame className="size-4" />
              </span>
              <span>What are your main skin concerns? (Select all that apply)</span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {skinConcerns.map((concern) => {
                const isSelected = selectedConcerns.includes(concern)
                return (
                  <button
                    key={concern}
                    type="button"
                    onClick={() => handleToggleConcern(concern)}
                    className={`px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#2b2e32] text-white shadow-xs border border-[#2b2e32]"
                        : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:border-stone-400"
                    }`}
                  >
                    {concern}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Question 4: Additional Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-medium text-sm sm:text-base">
              <span className="p-1 rounded bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                <FileText className="size-4" />
              </span>
              <span>Additional Details (Optional)</span>
            </div>

            <textarea
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Tell us more about your skincare goals, allergies, or any specific products you'd like to avoid..."
              rows={4}
              className="w-full px-3.5 py-3 text-xs sm:text-sm rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 outline-none focus:ring-1 focus:ring-stone-500 transition-all resize-y"
            />
          </div>

          {/* Question 5: Upload Photo (Optional) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-medium text-sm sm:text-base">
              <span className="p-1 rounded bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                <Camera className="size-4" />
              </span>
              <span>Upload Photo (Optional)</span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />

            {photoPreview ? (
              <div className="relative rounded-md border border-stone-300 dark:border-stone-700 p-4 bg-white dark:bg-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={photoPreview}
                    alt="Skin preview"
                    className="size-14 rounded object-cover border border-stone-200 dark:border-stone-700"
                  />
                  <div>
                    <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 block">
                      Photo Uploaded
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {photoFile?.name || "Ready for AI skin analysis"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview(null)
                    setPhotoFile(null)
                  }}
                  className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
                  title="Remove photo"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 px-4 rounded-md border border-stone-300 dark:border-stone-700 bg-white/70 dark:bg-stone-800/40 text-center flex flex-col items-center justify-center gap-2 hover:bg-stone-100/60 dark:hover:bg-stone-800/80 transition-colors cursor-pointer group"
              >
                <div className="size-10 rounded-full bg-stone-100 dark:bg-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 group-hover:scale-110 transition-transform">
                  <Upload className="size-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200">
                  Click to upload or drag and drop
                </span>
                <span className="text-[11px] text-stone-400">
                  PNG, JPG up to 10MB
                </span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={generateRoutineMutation.isPending}
              className="w-full py-3.5 px-6 rounded-md bg-[#2b2e32] hover:bg-[#1b1c1e] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {generateRoutineMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>ANALYZING YOUR SKIN BIOLOGY...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  <span>ANALYZE & GET RECOMMENDATIONS</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* =========================================================================
          RESPONSE: PERSONALIZED ROUTINE DIAGNOSIS SECTION
          (Rendered in-page so Navbar, Page Form Content, and Footer remain fully visible)
          ========================================================================= */}
      {isModalOpen && generatedRoutine && routineJson ? (
        <div
          ref={resultRef}
          id="routine-diagnosis-section"
          className="mt-12 max-w-4xl mx-auto scroll-mt-24 animate-in fade-in slide-in-from-bottom-6 duration-300"
        >
          <div className="relative w-full bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-3xl shadow-xl border border-stone-200/90 dark:border-stone-800 overflow-hidden">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-800/40">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-serif font-medium leading-tight">
                      Personalized Skincare Routine
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                      Generated
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Tailored for {skinType} skin • Based on your concerns & biology
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCancelModal}
                className="size-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
                title="Dismiss"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-7 space-y-7">
              {/* 1. MORNING ROUTINE */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-serif font-medium text-base sm:text-lg pb-1 border-b border-amber-200/60 dark:border-amber-900/40">
                  <Sun className="size-5" />
                  <span>Morning Protocol (AM)</span>
                </div>

                {/* Morning Guide Text */}
                {routineJson.morning && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs sm:text-sm text-amber-950 dark:text-amber-200/90 leading-relaxed">
                    {routineJson.morning}
                  </div>
                )}

                {/* Morning Products Cards */}
                {routineJson.morning_products && routineJson.morning_products.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block">
                      Recommended Morning Essentials ({routineJson.morning_products.length})
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {routineJson.morning_products.map((prod: RoutineProduct) => {
                        const inFav = isFavorite(prod.id)
                        const inStock = prod.is_available !== false && (prod.stock ?? 1) > 0
                        return (
                          <div
                            key={prod.id}
                            className="p-3.5 rounded-2xl bg-[#fafafa] dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-800 flex flex-col justify-between hover:border-stone-300 dark:hover:border-stone-700 transition-all gap-3 group"
                          >
                            <div className="flex gap-3">
                              {/* Product Image */}
                              <div className="relative size-16 sm:size-20 shrink-0">
                                {prod.image ? (
                                  <img
                                    src={prod.image}
                                    alt={prod.title}
                                    className="size-full rounded-xl object-contain bg-white dark:bg-stone-900 p-1.5 border border-stone-200/70 dark:border-stone-800"
                                  />
                                ) : (
                                  <div className="size-full rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0 text-stone-400">
                                    <Package className="size-6" />
                                  </div>
                                )}
                              </div>

                              {/* Details */}
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-200/80 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                                    {prod.category?.name || "Skincare"}
                                  </span>
                                  <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                                    ${Number(prod.price || 0).toFixed(2)}
                                  </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                                  {prod.title}
                                </h4>
                                {prod.sub_title && (
                                  <p className="text-[11px] text-stone-500 line-clamp-1">
                                    {prod.sub_title}
                                  </p>
                                )}
                                {prod.how_to_use && (
                                  <p className="text-[10px] text-stone-400 line-clamp-2 leading-tight">
                                    <strong className="text-stone-600 dark:text-stone-300">How to use:</strong> {prod.how_to_use}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons: Favorite & Add to Cart */}
                            <div className="flex items-center gap-2 pt-2 border-t border-stone-200/60 dark:border-stone-700/60">
                              <button
                                type="button"
                                onClick={() => handleToggleFavorite(prod)}
                                className={`size-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer active:scale-95 shrink-0 ${
                                  inFav
                                    ? "bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/40 dark:border-rose-900"
                                    : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-400 hover:text-rose-500 hover:border-rose-200"
                                }`}
                                title={inFav ? "Remove from favorites" : "Add to favorites"}
                                aria-label="Toggle Favorite"
                              >
                                <Heart
                                  className={`size-4 ${inFav ? "fill-rose-500 text-rose-500" : ""}`}
                                />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleAddToCart(prod)}
                                disabled={!inStock}
                                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95 disabled:opacity-50 cursor-pointer ${
                                  justAddedCartId === prod.id
                                    ? "bg-emerald-600 text-white"
                                    : "bg-[#2b2e32] hover:bg-[#1a1c1e] text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
                                }`}
                              >
                                {justAddedCartId === prod.id ? (
                                  <>
                                    <Check className="size-3.5" />
                                    <span>Added to Cart</span>
                                  </>
                                ) : (
                                  <>
                                    <ShoppingBag className="size-3.5" />
                                    <span>{inStock ? "Add to Cart" : "Out of Stock"}</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. NIGHT ROUTINE */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-serif font-medium text-base sm:text-lg pb-1 border-b border-indigo-200/60 dark:border-indigo-900/40">
                  <Moon className="size-5" />
                  <span>Night Protocol (PM)</span>
                </div>

                {/* Night Guide Text */}
                {routineJson.night && (
                  <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/40 text-xs sm:text-sm text-indigo-950 dark:text-indigo-200/90 leading-relaxed">
                    {routineJson.night}
                  </div>
                )}

                {/* Night Products Cards */}
                {routineJson.night_products && routineJson.night_products.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block">
                      Recommended Night Essentials ({routineJson.night_products.length})
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {routineJson.night_products.map((prod: RoutineProduct) => {
                        const inFav = isFavorite(prod.id)
                        const inStock = prod.is_available !== false && (prod.stock ?? 1) > 0
                        return (
                          <div
                            key={prod.id}
                            className="p-3.5 rounded-2xl bg-[#fafafa] dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-800 flex flex-col justify-between hover:border-stone-300 dark:hover:border-stone-700 transition-all gap-3 group"
                          >
                            <div className="flex gap-3">
                              {/* Product Image */}
                              <div className="relative size-16 sm:size-20 shrink-0">
                                {prod.image ? (
                                  <img
                                    src={prod.image}
                                    alt={prod.title}
                                    className="size-full rounded-xl object-contain bg-white dark:bg-stone-900 p-1.5 border border-stone-200/70 dark:border-stone-800"
                                  />
                                ) : (
                                  <div className="size-full rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0 text-stone-400">
                                    <Package className="size-6" />
                                  </div>
                                )}
                              </div>

                              {/* Details */}
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-200/80 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                                    {prod.category?.name || "Skincare"}
                                  </span>
                                  <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                                    ${Number(prod.price || 0).toFixed(2)}
                                  </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                                  {prod.title}
                                </h4>
                                {prod.sub_title && (
                                  <p className="text-[11px] text-stone-500 line-clamp-1">
                                    {prod.sub_title}
                                  </p>
                                )}
                                {prod.how_to_use && (
                                  <p className="text-[10px] text-stone-400 line-clamp-2 leading-tight">
                                    <strong className="text-stone-600 dark:text-stone-300">How to use:</strong> {prod.how_to_use}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons: Favorite & Add to Cart */}
                            <div className="flex items-center gap-2 pt-2 border-t border-stone-200/60 dark:border-stone-700/60">
                              <button
                                type="button"
                                onClick={() => handleToggleFavorite(prod)}
                                className={`size-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer active:scale-95 shrink-0 ${
                                  inFav
                                    ? "bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/40 dark:border-rose-900"
                                    : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-400 hover:text-rose-500 hover:border-rose-200"
                                }`}
                                title={inFav ? "Remove from favorites" : "Add to favorites"}
                                aria-label="Toggle Favorite"
                              >
                                <Heart
                                  className={`size-4 ${inFav ? "fill-rose-500 text-rose-500" : ""}`}
                                />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleAddToCart(prod)}
                                disabled={!inStock}
                                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95 disabled:opacity-50 cursor-pointer ${
                                  justAddedCartId === prod.id
                                    ? "bg-emerald-600 text-white"
                                    : "bg-[#2b2e32] hover:bg-[#1a1c1e] text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
                                }`}
                              >
                                {justAddedCartId === prod.id ? (
                                  <>
                                    <Check className="size-3.5" />
                                    <span>Added to Cart</span>
                                  </>
                                ) : (
                                  <>
                                    <ShoppingBag className="size-3.5" />
                                    <span>{inStock ? "Add to Cart" : "Out of Stock"}</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. PRECAUTIONS */}
              {routineJson.precautions && routineJson.precautions.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-semibold text-xs sm:text-sm">
                    <ShieldAlert className="size-4" />
                    <span>Dermatological Precautions</span>
                  </div>
                  <ul className="text-xs text-rose-900/90 dark:text-rose-200/90 space-y-1.5 list-disc pl-5">
                    {routineJson.precautions.map((item: string, idx: number) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Section Footer */}
            <div className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-stone-500 dark:text-stone-400">
                Save to access this routine in your user profile anytime.
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCancelModal}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveRoutine}
                  disabled={saveRoutineMutation.isPending}
                  className="px-6 py-2.5 rounded-xl bg-[#2b2e32] hover:bg-[#1b1c1e] text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {saveRoutineMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Saving Routine...</span>
                    </>
                  ) : (
                    <>
                      <BookmarkCheck className="size-4" />
                      <span>Save Routine</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Auth Modal for Unauthenticated Users */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </div>
  )
}
