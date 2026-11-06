import React, { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useNavigate, Link, useSearchParams } from "react-router"
import {
    User,
    Phone,
    Calendar,
    Sparkles,
    Edit3,
    Camera,
    CheckCircle2,
    AlertCircle,
    Loader2,
    X,
    Shield,
    Clock,
    Activity,
    RefreshCw,
    Heart,
    PackageCheck,
    Package,
    ChevronLeft,
    ChevronRight,
    Trash2,
    Sun,
    Moon,
    ShoppingBag,
    CreditCard,
    Banknote,
    Eye,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { useProfile, type UserProfile } from "@/hooke/useProfile"
import { useAuth } from "@/hooke/useAuth"
import { useUserData } from "@/hooke/useUserData"
import { useShop, type Product } from "@/hooke/ShopContext"
import { useOrders } from "@/hooke/useOrders"
import {
    useSavedRoutines,
    useSaveRoutine,
    type SkinIntelligenceRecord,
    type RoutineProduct,
} from "@/hooke/useSkinIntelligence"

const SKIN_TYPE_OPTIONS = [
    "Normal",
    "Dry",
    "Oily",
    "Combination",
    "Sensitive",
    "Acne-Prone",
    "Mature",
]

const GENDER_OPTIONS = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
]

export default function ProfilePage() {
    const navigate = useNavigate()
    const { user: authUser, loading: authLoading } = useAuth()
    const {
        profile,
        isLoading,
        isError,
        errorMessage,
        updateProfile,
        isUpdating,
        updateError,
        refetch,
    } = useProfile()

    // Fetch user statistics (/api/v1/userdata/)
    const { data: userStats, isLoading: isStatsLoading } = useUserData()
    const { totalCartItems, addToCart, toggleFavorite, isFavorite } = useShop()

    // Retrieve cart items count from localStorage or ShopContext
    const cartProductCount = (() => {
        try {
            const raw = localStorage.getItem("glowmi_cart")
            if (raw) {
                const parsed = JSON.parse(raw)
                if (Array.isArray(parsed)) {
                    return parsed.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0)
                }
            }
        } catch {
            // fallback
        }
        return totalCartItems
    })()

    // URL search params for active tab support (e.g. /profile?tab=orders from checkout)
    const [searchParams, setSearchParams] = useSearchParams()
    const tabParam = searchParams.get("tab")
    const [activeTab, setActiveTab] = useState<"routine" | "orders">(
        tabParam === "orders" ? "orders" : "routine"
    )

    useEffect(() => {
        if (tabParam === "orders" || tabParam === "routine") {
            setActiveTab(tabParam)
        }
    }, [tabParam])

    const handleSwitchTab = (tab: "routine" | "orders") => {
        setActiveTab(tab)
        setSearchParams({ tab }, { replace: true })
    }

    // Order History Pagination state
    const [orderPage, setOrderPage] = useState(1)
    const {
        orders: userOrders = [],
        count: ordersCount,
        totalPages: ordersTotalPages,
        isLoading: isOrdersLoading,
        refetch: refetchOrders,
    } = useOrders(orderPage)

    // Saved routines state from TanStack Query (/api/v1/user/skin-intelligence/)
    const {
        savedRoutines = [],
        isLoading: isRoutinesLoading,
        refetch: refetchRoutines,
    } = useSavedRoutines()
    const saveRoutineMutation = useSaveRoutine()
    const [viewingRoutineDetail, setViewingRoutineDetail] = useState<SkinIntelligenceRecord | null>(null)

    // Delete routine helper (Calls API with is_saved: false)
    const handleDeleteRoutine = async (id: number | string) => {
        if (!window.confirm("Are you sure you want to remove this saved skincare routine?")) return
        try {
            await saveRoutineMutation.mutateAsync({ id, isSaved: false })
        } catch (e) {
            console.error("Failed to update routine", e)
        }
    }

    // Redirect to home page if user is logged out
    useEffect(() => {
        if (!authLoading && !authUser) {
            navigate("/", { replace: true })
        }
    }, [authUser, authLoading, navigate])

    // State for Edit Profile Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [formError, setFormError] = useState<string | null>(null)

    // Edit form state
    const [fullName, setFullName] = useState("")
    const [gender, setGender] = useState("")
    const [contactNumber, setContactNumber] = useState("")
    const [skinType, setSkinType] = useState("")
    const [customSkinType, setCustomSkinType] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const [headerOffset, setHeaderOffset] = useState(110)
    const [justAddedCartId, setJustAddedCartId] = useState<number | null>(null)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3200)
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

    const handleAddToCart = (prod: RoutineProduct) => {
        const shopItem = toShopProduct(prod)
        addToCart(shopItem, 1)
        setJustAddedCartId(prod.id)
        setTimeout(() => setJustAddedCartId(null), 2000)
        showToast(`"${prod.title}" added to cart!`)
    }

    const handleToggleFavorite = (prod: RoutineProduct) => {
        const shopItem = toShopProduct(prod)
        const currentlyFav = isFavorite(prod.id)
        toggleFavorite(shopItem)
        showToast(currentlyFav ? `"${prod.title}" removed from favorites` : `"${prod.title}" added to favorites!`)
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    // Calculate exact gap below the navbar (for Edit Profile & Routine Details modals)
    useEffect(() => {
        const updateOffset = () => {
            const header = document.querySelector("header")
            if (header) {
                const rect = header.getBoundingClientRect()
                // rect.bottom is the bottom edge of the navbar; add 12px gap
                setHeaderOffset(Math.round(rect.bottom + 12))
            }
        }

        if (isEditModalOpen || Boolean(viewingRoutineDetail)) {
            updateOffset()
            window.addEventListener("resize", updateOffset)
            window.addEventListener("scroll", updateOffset)
            return () => {
                window.removeEventListener("resize", updateOffset)
                window.removeEventListener("scroll", updateOffset)
            }
        }
    }, [isEditModalOpen, viewingRoutineDetail])

    // Sync form state when profile data is available or modal opens
    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || "")
            setGender(profile.gender || "male")
            setContactNumber(profile.contact_number || "")
            setSkinType(profile.skin_type || "")
            setDateOfBirth(profile.date_of_birth ? profile.date_of_birth.split("T")[0] : "")
            setPreviewImage(profile.image || null)
        }
    }, [profile, isEditModalOpen])

    // Handle ESC key press to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (viewingRoutineDetail) {
                    setViewingRoutineDetail(null)
                }
                if (isEditModalOpen) {
                    setIsEditModalOpen(false)
                }
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isEditModalOpen, viewingRoutineDetail])

    // Clear success notification after 4 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 4000)
            return () => clearTimeout(timer)
        }
    }, [successMessage])

    // Handle image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith("image/")) {
                setFormError("Please select a valid image file.")
                return
            }
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // Handle profile update form submission
    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError(null)

        try {
            const formData = new FormData()
            formData.append("full_name", fullName)
            formData.append("gender", gender)
            formData.append("contact_number", contactNumber)
            formData.append("skin_type", customSkinType || skinType)
            formData.append("date_of_birth", dateOfBirth)

            if (imageFile) {
                formData.append("image", imageFile)
            }

            await updateProfile(formData)
            setSuccessMessage("Profile updated successfully!")
            setIsEditModalOpen(false)
            setImageFile(null)
        } catch (err: any) {
            setFormError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update profile. Please try again."
            )
        }
    }

    // Format dates for display
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "Not provided"
        try {
            const date = new Date(dateStr)
            if (isNaN(date.getTime())) return dateStr
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        } catch {
            return dateStr
        }
    }

    // Real user profile data only (no hardcoded mock data)
    const displayProfile: UserProfile | null = profile || (authUser ? {
        id: Number(authUser.id) || 0,
        user: Number(authUser.user || authUser.id) || 0,
        email: authUser.email || "",
        role: authUser.role || "user",
        full_name: authUser.full_name || authUser.fullName || authUser.name || authUser.email?.split("@")?.[0] || "",
        image: authUser.image || null,
        gender: authUser.gender || "",
        contact_number: authUser.contact_number || authUser.contactNumber || "",
        skin_type: authUser.skin_type || authUser.skinType || "",
        date_of_birth: authUser.date_of_birth || authUser.birthday || "",
        created_at: authUser.created_at || "",
        updated_at: authUser.updated_at || "",
    } : null)

    // If user is logged out, render nothing while redirecting
    if (!authLoading && !authUser) {
        return null
    }

    if (isLoading && !displayProfile) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!displayProfile) {
        return null
    }

    return (
        <div className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-8 pb-12">
            {/* Floating Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-[130] flex items-center gap-2.5 px-4 py-3 bg-[#2b2e32] text-white rounded-xl shadow-2xl border border-stone-700 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom-4">
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Success Alert Banner */}
            {successMessage && (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-600 dark:text-emerald-400 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="size-5 shrink-0" />
                    <div className="flex-1">{successMessage}</div>
                    <button
                        onClick={() => setSuccessMessage(null)}
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            )}

            {/* Loading State Indicator */}
            {isLoading && (
                <div className="flex items-center justify-center p-5 bg-muted/40 rounded-2xl border border-border">
                    <Loader2 className="size-5 animate-spin text-primary mr-2" />
                    <span className="text-sm text-muted-foreground font-medium">
                        Fetching latest profile data...
                    </span>
                </div>
            )}

            {/* Error Notification */}
            {isError && !profile && (
                <div className="flex items-center justify-between rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive shadow-sm">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="size-5 shrink-0" />
                        <span>{errorMessage || "Unable to fetch profile from server."}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5 text-xs">
                        <RefreshCw className="size-3.5" /> Retry
                    </Button>
                </div>
            )}

            {/* =========================================================================
          1. TOP PROFILE HEADER SECTION (All Data Displayed in this Card)
          ========================================================================= */}
            <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/60 bg-[#f7f7f7] dark:bg-card/90 p-5 sm:p-7 shadow-xs transition-all hover:shadow-sm">
                {/* Top Row: Avatar + Name + Email + Skin Badge + Edit Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-6 border-b border-border/60">
                    {/* Left: Avatar + Identity Info */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Rounded Square Avatar */}
                        <div className="relative group shrink-0">
                            <div className="size-20 sm:size-24 rounded-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 shadow-sm ring-1 ring-black/5 dark:ring-white/10 flex items-center justify-center">
                                {displayProfile.image ? (
                                    <img
                                        src={displayProfile.image}
                                        alt={displayProfile.full_name}
                                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="size-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl uppercase">
                                        {displayProfile.full_name?.[0] || "U"}
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(true)}
                                className="absolute -bottom-1.5 -right-1.5 size-7 rounded-full bg-primary text-primary-foreground shadow-md flex items-center justify-center opacity-90 hover:opacity-100 transition-transform active:scale-90 cursor-pointer"
                                title="Change photo"
                            >
                                <Camera className="size-3.5" />
                            </button>
                        </div>

                        {/* Identity & Skin Badge */}
                        <div className="flex flex-col items-start min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 truncate">
                                    {displayProfile.full_name || "Guest User"}
                                </h1>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                    <CheckCircle2 className="size-3" /> {displayProfile.role || "User"}
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium truncate mt-0.5">
                                {displayProfile.email}
                            </p>

                            {/* Dark Pill Badge (matching image design) */}
                            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2b2b2b] text-white dark:bg-neutral-800 dark:text-neutral-200 text-xs font-semibold shadow-xs">
                                <Sparkles className="size-3 text-amber-300" />
                                <span className="capitalize">
                                    {displayProfile.skin_type || "Skin Intelligence"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Edit Profile Action Button */}
                    <div className="w-full sm:w-auto flex sm:justify-end">
                        <Button
                            onClick={() => setIsEditModalOpen(true)}
                            className="w-full sm:w-auto rounded-full gap-2 px-5 py-2 text-xs font-semibold shadow-xs transition-transform active:scale-95 cursor-pointer"
                        >
                            <Edit3 className="size-3.5" />
                            <span>Edit Profile</span>
                        </Button>
                    </div>
                </div>

                {/* Bottom Row: All Profile Data Cards inside this Header Section */}
                <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Contact Number */}
                    <div className="p-3.5 rounded-xl bg-white/80 dark:bg-card border border-border/60 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                            <Phone className="size-3.5" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Contact</span>
                        </div>
                        <p className="text-sm font-medium text-foreground truncate">
                            {displayProfile.contact_number || "Not provided"}
                        </p>
                    </div>

                    {/* Gender */}
                    <div className="p-3.5 rounded-xl bg-white/80 dark:bg-card border border-border/60 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                            <User className="size-3.5" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Gender</span>
                        </div>
                        <p className="text-sm font-medium text-foreground capitalize truncate">
                            {displayProfile.gender || "Not specified"}
                        </p>
                    </div>

                    {/* Date of Birth */}
                    <div className="p-3.5 rounded-xl bg-white/80 dark:bg-card border border-border/60 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                            <Calendar className="size-3.5" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Date of Birth</span>
                        </div>
                        <p className="text-sm font-medium text-foreground truncate">
                            {formatDate(displayProfile.date_of_birth)}
                        </p>
                    </div>

                    {/* Skin Type */}
                    <div className="p-3.5 rounded-xl bg-white/80 dark:bg-card border border-border/60 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-primary mb-1">
                            <Sparkles className="size-3.5" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Skin Type</span>
                        </div>
                        <p className="text-sm font-semibold text-primary capitalize truncate">
                            {displayProfile.skin_type || "Not evaluated"}
                        </p>
                    </div>

                    {/* Member Since */}
                    <div className="p-3.5 rounded-xl bg-white/80 dark:bg-card border border-border/60 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                            <Clock className="size-3.5" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Member Since</span>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                            {formatDate(displayProfile.created_at)}
                        </p>
                    </div>

                    {/* Last Updated */}
                    <div className="p-3.5 rounded-xl bg-white/80 dark:bg-card border border-border/60 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                            <Activity className="size-3.5" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Last Update</span>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                            {formatDate(displayProfile.updated_at)}
                        </p>
                    </div>

                    {/* Profile ID */}
                    <div className="p-3.5 rounded-xl bg-white/80 dark:bg-card border border-border/60 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                            <Shield className="size-3.5" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Profile ID</span>
                        </div>
                        <p className="text-sm font-mono font-medium text-foreground truncate">
                            #{displayProfile.id}
                        </p>
                    </div>

                    {/* Status */}
                    <div className="p-3.5 rounded-xl bg-white/80 dark:bg-card border border-border/60 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                            <Shield className="size-3.5" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Account</span>
                        </div>
                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 capitalize truncate flex items-center gap-1">
                            <CheckCircle2 className="size-3.5" /> Active
                        </p>
                    </div>
                </div>
            </section>

            {/* =========================================================================
          2. USER METRICS & ACTIVITY SECTION (Analysis, Cart Product, Order Product)
          ========================================================================= */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {/* 1. Analysis Card */}
                <Link
                    to="/ai-skin-intelligence"
                    className="group rounded-2xl sm:rounded-3xl border border-stone-200/70 dark:border-border/60 bg-[#f8f9fa] dark:bg-card/90 p-6 sm:p-7 shadow-xs hover:shadow-sm hover:border-stone-300 dark:hover:border-stone-700 transition-all flex flex-col justify-between"
                >
                    <div className="text-stone-800 dark:text-stone-200 transition-transform duration-200 group-hover:scale-105">
                        {/* Analysis Magnifying Glass with Chart */}
                        <svg
                            className="size-7 sm:size-8"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="10" cy="10" r="7" />
                            <path d="m21 21-4.8-4.8" />
                            <path d="M7 11.5 9 9.5l2 2 3-3" />
                            <circle cx="7" cy="11.5" r="0.75" fill="currentColor" />
                            <circle cx="9" cy="9.5" r="0.75" fill="currentColor" />
                            <circle cx="11" cy="11.5" r="0.75" fill="currentColor" />
                            <circle cx="14" cy="8.5" r="0.75" fill="currentColor" />
                        </svg>
                    </div>

                    <div className="mt-5">
                        <div className="text-3xl sm:text-4xl font-normal text-stone-900 dark:text-stone-100 tracking-tight">
                            {isStatsLoading ? (
                                <Loader2 className="size-7 animate-spin text-muted-foreground inline-block" />
                            ) : (
                                userStats?.skin_intelligence_count ?? 0
                            )}
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mt-1.5">
                            Analysis
                        </div>
                    </div>
                </Link>

                {/* 2. Cart Product Card */}
                <Link
                    to="/cart"
                    className="group rounded-2xl sm:rounded-3xl border border-stone-200/70 dark:border-border/60 bg-[#f8f9fa] dark:bg-card/90 p-6 sm:p-7 shadow-xs hover:shadow-sm hover:border-stone-300 dark:hover:border-stone-700 transition-all flex flex-col justify-between"
                >
                    <div className="text-stone-800 dark:text-stone-200 transition-transform duration-200 group-hover:scale-105">
                        {/* Shopping Bag Icon */}
                        <svg
                            className="size-7 sm:size-8"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M6 9h12l-1 11H7L6 9z" />
                            <path d="M9 9V6a3 3 0 0 1 6 0v3" />
                        </svg>
                    </div>

                    <div className="mt-5">
                        <div className="text-3xl sm:text-4xl font-normal text-stone-900 dark:text-stone-100 tracking-tight">
                            {cartProductCount}
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mt-1.5">
                            Cart Product
                        </div>
                    </div>
                </Link>

                {/* 3. Order Product Card */}
                <Link
                    to="/cart"
                    className="group rounded-2xl sm:rounded-3xl border border-stone-200/70 dark:border-border/60 bg-[#f8f9fa] dark:bg-card/90 p-6 sm:p-7 shadow-xs hover:shadow-sm hover:border-stone-300 dark:hover:border-stone-700 transition-all flex flex-col justify-between"
                >
                    <div className="text-stone-800 dark:text-stone-200 transition-transform duration-200 group-hover:scale-105">
                        {/* Package Box with Checkmark */}
                        <svg
                            className="size-7 sm:size-8"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m7.5 4.27 9 5.15" />
                            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
                            <path d="m3.3 7 8.7 5 8.7-5" />
                            <path d="M12 22V12" />
                            <circle cx="18" cy="18" r="3" />
                            <path d="m16.5 18 1 1 2-2" />
                        </svg>
                    </div>

                    <div className="mt-5">
                        <div className="text-3xl sm:text-4xl font-normal text-stone-900 dark:text-stone-100 tracking-tight">
                            {isStatsLoading ? (
                                <Loader2 className="size-7 animate-spin text-muted-foreground inline-block" />
                            ) : (
                                userStats?.order_count ?? 0
                            )}
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mt-1.5">
                            Order Product
                        </div>
                    </div>
                </Link>
            </section>

            {/* =========================================================================
          3. TABS NAVIGATION: ROUTINE & ORDER HISTORY (As requested: only Routine and Order History)
          ========================================================================= */}
            <div className="pt-2">
                {/* Horizontal Tab Bar */}
                <div className="flex items-center gap-6 sm:gap-8 border-b border-border/70 pb-px">
                    {/* Routine Tab */}
                    <button
                        type="button"
                        onClick={() => handleSwitchTab("routine")}
                        className={`relative pb-3.5 flex items-center gap-2 text-sm sm:text-base transition-colors cursor-pointer ${
                            activeTab === "routine"
                                ? "text-stone-900 dark:text-stone-100 font-semibold"
                                : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-medium"
                        }`}
                    >
                        <Heart className="size-4 sm:size-4.5" />
                        <span>Routine</span>
                        {savedRoutines.length > 0 && (
                            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                                {savedRoutines.length}
                            </span>
                        )}
                        {/* Underline indicator */}
                        {activeTab === "routine" && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 dark:bg-stone-100 rounded-full animate-in fade-in duration-150" />
                        )}
                    </button>

                    {/* Order History Tab */}
                    <button
                        type="button"
                        onClick={() => handleSwitchTab("orders")}
                        className={`relative pb-3.5 flex items-center gap-2 text-sm sm:text-base transition-colors cursor-pointer ${
                            activeTab === "orders"
                                ? "text-stone-900 dark:text-stone-100 font-semibold"
                                : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-medium"
                        }`}
                    >
                        <PackageCheck className="size-4 sm:size-4.5" />
                        <span>Order History</span>
                        {ordersCount > 0 && (
                            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                                {ordersCount}
                            </span>
                        )}
                        {/* Underline indicator */}
                        {activeTab === "orders" && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 dark:bg-stone-100 rounded-full animate-in fade-in duration-150" />
                        )}
                    </button>
                </div>

                {/* Tab Content Display */}
                <div className="mt-6">
                    {/* -------------------- 1. ROUTINE SECTION (TABLE-WISE) -------------------- */}
                    {activeTab === "routine" && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            {/* Section Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h3 className="font-serif font-medium text-lg sm:text-xl text-stone-900 dark:text-stone-100">
                                        Personalized Skincare Routines
                                    </h3>
                                    <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                                        Routines customized to your skin type, barriers, and environmental needs.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => refetchRoutines()}
                                        disabled={isRoutinesLoading}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
                                        title="Refresh Saved Routines"
                                    >
                                        <RefreshCw className={`size-3.5 ${isRoutinesLoading ? "animate-spin" : ""}`} />
                                        <span className="hidden sm:inline">Refresh</span>
                                    </button>
                                    <Link
                                        to="/ai-skin-intelligence"
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:text-stone-900 text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer active:scale-95"
                                    >
                                        <Sparkles className="size-3.5" />
                                        <span>New Routine Analysis</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Loading State */}
                            {isRoutinesLoading && (
                                <div className="flex items-center justify-center p-12 bg-[#f8f9fa] dark:bg-card/60 rounded-2xl border border-border">
                                    <Loader2 className="size-6 animate-spin text-primary mr-2" />
                                    <span className="text-sm text-muted-foreground">Loading your saved routines...</span>
                                </div>
                            )}

                            {/* Saved Routines Table */}
                            {!isRoutinesLoading && savedRoutines.length > 0 ? (
                                <div className="rounded-2xl sm:rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-[#f8f9fa] dark:bg-card/90 overflow-hidden shadow-xs">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm border-collapse min-w-[800px]">
                                            <thead>
                                                <tr className="border-b border-stone-200/80 dark:border-stone-800 bg-stone-100/80 dark:bg-stone-900/60 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                                                    <th className="py-3.5 px-4">Routine #</th>
                                                    <th className="py-3.5 px-4">Morning Protocol (AM)</th>
                                                    <th className="py-3.5 px-4">Night Protocol (PM)</th>
                                                    <th className="py-3.5 px-4">Precautions</th>
                                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-stone-200/70 dark:divide-stone-800/80 bg-white/60 dark:bg-stone-900/40">
                                                {savedRoutines
                                                    .filter((r: any) => r.is_saved !== false)
                                                    .map((routine: any, idx: number) => {
                                                    const routineId = routine.id || routine.skin_intelligence_id || idx + 1
                                                    const routineData =
                                                        typeof routine.routine_json === "string"
                                                            ? (() => {
                                                                  try {
                                                                      return JSON.parse(routine.routine_json)
                                                                  } catch {
                                                                      return {}
                                                                  }
                                                              })()
                                                            : (routine.routine_json || {})
                                                    const morningGuide = routineData.morning || ""
                                                    const morningProducts: RoutineProduct[] = routineData.morning_products || []
                                                    const nightGuide = routineData.night || ""
                                                    const nightProducts: RoutineProduct[] = routineData.night_products || []
                                                    const precautions: string[] = routineData.precautions || []
                                                    const createdDate = routine.created_at

                                                    return (
                                                        <tr
                                                            key={routine.id || idx}
                                                            className="hover:bg-stone-50/80 dark:hover:bg-stone-800/50 transition-colors"
                                                        >
                                                            {/* Column 1: Routine ID & Date */}
                                                            <td className="py-4 px-4 align-top whitespace-nowrap">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="size-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                                                                        <Heart className="size-4" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                                                                            Routine #{routineId}
                                                                        </span>
                                                                        {createdDate ? (
                                                                            <span className="text-[11px] text-stone-400 block">
                                                                                {formatDate(createdDate)}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-[11px] text-stone-400 block">
                                                                                Saved
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* Column 2: Morning Protocol */}
                                                            <td className="py-4 px-4 align-top max-w-xs">
                                                                <div className="space-y-1.5">
                                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                                                                        <Sun className="size-3.5" />
                                                                        <span>Morning Regimen ({morningProducts.length} Products)</span>
                                                                    </div>
                                                                    {morningGuide && (
                                                                        <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                                                                            {morningGuide}
                                                                        </p>
                                                                    )}
                                                                    {morningProducts.length > 0 && (
                                                                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                                                                            {morningProducts.slice(0, 3).map((p: RoutineProduct, pIdx: number) => (
                                                                                <span
                                                                                    key={p.id || pIdx}
                                                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200/60 dark:border-amber-900/40"
                                                                                >
                                                                                    {p.image && (
                                                                                        <img src={p.image} alt="" className="size-3 rounded-full object-contain" />
                                                                                    )}
                                                                                    <span className="truncate max-w-[120px]">{p.title}</span>
                                                                                </span>
                                                                            ))}
                                                                            {morningProducts.length > 3 && (
                                                                                <span className="text-[10px] text-stone-400 italic">
                                                                                    +{morningProducts.length - 3} more
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>

                                                            {/* Column 3: Night Protocol */}
                                                            <td className="py-4 px-4 align-top max-w-xs">
                                                                <div className="space-y-1.5">
                                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                                                                        <Moon className="size-3.5" />
                                                                        <span>Night Regimen ({nightProducts.length} Products)</span>
                                                                    </div>
                                                                    {nightGuide && (
                                                                        <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                                                                            {nightGuide}
                                                                        </p>
                                                                    )}
                                                                    {nightProducts.length > 0 && (
                                                                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                                                                            {nightProducts.slice(0, 3).map((p: RoutineProduct, pIdx: number) => (
                                                                                <span
                                                                                    key={p.id || pIdx}
                                                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 border border-indigo-200/60 dark:border-indigo-900/40"
                                                                                >
                                                                                    {p.image && (
                                                                                        <img src={p.image} alt="" className="size-3 rounded-full object-contain" />
                                                                                    )}
                                                                                    <span className="truncate max-w-[120px]">{p.title}</span>
                                                                                </span>
                                                                            ))}
                                                                            {nightProducts.length > 3 && (
                                                                                <span className="text-[10px] text-stone-400 italic">
                                                                                    +{nightProducts.length - 3} more
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>

                                                            {/* Column 4: Precautions */}
                                                            <td className="py-4 px-4 align-top max-w-xs text-xs text-stone-600 dark:text-stone-400">
                                                                {precautions.length > 0 ? (
                                                                    <ul className="space-y-1 list-disc pl-3 text-[11px] leading-relaxed line-clamp-3">
                                                                        {precautions.map((item: string, prIdx: number) => (
                                                                            <li key={prIdx}>{item}</li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    <span className="text-stone-400 italic text-[11px]">General daily care</span>
                                                                )}
                                                            </td>

                                                            {/* Column 5: Actions */}
                                                            <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                                                                <div className="flex items-center justify-end gap-1.5">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setViewingRoutineDetail(routine)}
                                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors cursor-pointer"
                                                                        title="View Full Routine Details"
                                                                    >
                                                                        <Eye className="size-3.5" />
                                                                        <span>Details</span>
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDeleteRoutine(routine.id)}
                                                                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                                                        title="Remove Routine"
                                                                    >
                                                                        <Trash2 className="size-3.5" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                !isRoutinesLoading && (
                                    /* Empty State for Routines */
                                    <div className="text-center py-12 px-4 rounded-2xl sm:rounded-3xl border border-dashed border-stone-300 dark:border-stone-700 bg-[#f8f9fa] dark:bg-card/60">
                                        <div className="size-14 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
                                            <Heart className="size-7" />
                                        </div>
                                        <h4 className="font-serif font-medium text-base sm:text-lg text-stone-900 dark:text-stone-100">
                                            No Skincare Routines Saved Yet
                                        </h4>
                                        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto mt-1 mb-5">
                                            Unlock daily glowing skin with tailored morning & nighttime steps diagnosed by our AI Skin Intelligence dermatologist.
                                        </p>
                                        <Link
                                            to="/ai-skin-intelligence"
                                            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:text-stone-900 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer active:scale-95"
                                        >
                                            <Sparkles className="size-4" />
                                            <span>Diagnose My Skin Routine</span>
                                        </Link>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {/* -------------------- 2. ORDER HISTORY SECTION -------------------- */}
                    {activeTab === "orders" && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            {/* Section Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h3 className="font-serif font-medium text-lg sm:text-xl text-stone-900 dark:text-stone-100">
                                        Order History & Receipts
                                    </h3>
                                    <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                                        Track order statuses, delivery address details, and skincare essentials purchased.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => refetchOrders()}
                                        disabled={isOrdersLoading}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs sm:text-sm font-medium transition-colors disabled:opacity-50"
                                        title="Refresh Orders"
                                    >
                                        <RefreshCw className={`size-3.5 ${isOrdersLoading ? "animate-spin" : ""}`} />
                                        <span className="hidden sm:inline">Refresh</span>
                                    </button>
                                    <Link
                                        to="/products"
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-medium transition-colors"
                                    >
                                        <ShoppingBag className="size-3.5" />
                                        <span>Browse Store</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Loading State */}
                            {isOrdersLoading && (
                                <div className="flex items-center justify-center p-12 bg-[#f8f9fa] dark:bg-card/60 rounded-2xl border border-border">
                                    <Loader2 className="size-6 animate-spin text-primary mr-2" />
                                    <span className="text-sm text-muted-foreground">Loading your orders...</span>
                                </div>
                            )}

                            {/* Orders Table & Pagination */}
                            {!isOrdersLoading && userOrders.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="rounded-2xl sm:rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-[#f8f9fa] dark:bg-card/90 overflow-hidden shadow-xs">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm border-collapse min-w-[760px]">
                                                <thead>
                                                    <tr className="border-b border-stone-200/80 dark:border-stone-800 bg-stone-100/80 dark:bg-stone-900/60 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                                                        <th className="py-3.5 px-4">Order ID & Date</th>
                                                        <th className="py-3.5 px-4">Products</th>
                                                        <th className="py-3.5 px-4">Delivery Address</th>
                                                        <th className="py-3.5 px-4">Payment</th>
                                                        <th className="py-3.5 px-4">Status</th>
                                                        <th className="py-3.5 px-4 text-right">Total Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-stone-200/70 dark:divide-stone-800/80 bg-white/60 dark:bg-stone-900/40">
                                                    {userOrders.map((order: any, idx: number) => {
                                                        const orderNumber = order.id || order.order_id || idx + 1
                                                        const orderDate = order.created_at || order.date
                                                        const productsList = order.order_products || order.items || []
                                                        const address = order.addressDetails || order.shipping_address
                                                        const payment = order.payment
                                                        const paymentType = payment?.payment_type || "COD"
                                                        const paymentStatus = payment?.status || "UNPAID"
                                                        const orderStatus = order.status || "PENDING"
                                                        const totalPrice = Number(order.total_price || order.total_amount || 0).toFixed(2)
                                                        const shippingFee = Number(order.shipping_fee || 60).toFixed(2)

                                                        return (
                                                            <tr
                                                                key={order.id || idx}
                                                                className="hover:bg-stone-50/80 dark:hover:bg-stone-800/50 transition-colors"
                                                            >
                                                                {/* Column 1: Order ID & Date */}
                                                                <td className="py-4 px-4 align-top">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                                                            <PackageCheck className="size-4" />
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                                                                                #{orderNumber}
                                                                            </span>
                                                                            <span className="text-[11px] text-stone-400 block whitespace-nowrap">
                                                                                {orderDate ? formatDate(orderDate) : "Recent"}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                {/* Column 2: Products list */}
                                                                <td className="py-4 px-4 align-top max-w-xs">
                                                                    <div className="space-y-2">
                                                                        {productsList.map((item: any, pIdx: number) => {
                                                                            const productData = item.product_json_field || item
                                                                            const itemTitle = productData.title || item.title || "Skincare Product"
                                                                            const itemImg = productData.image || item.image
                                                                            const itemQty = item.quantity || 1
                                                                            const itemPrice = Number(item.price || 0).toFixed(2)

                                                                            return (
                                                                                <div key={item.id || pIdx} className="flex items-center gap-2.5">
                                                                                    {itemImg ? (
                                                                                        <img
                                                                                            src={itemImg}
                                                                                            alt={itemTitle}
                                                                                            className="size-9 rounded-lg object-contain bg-stone-100 dark:bg-stone-800 p-1 shrink-0 border border-stone-200/60 dark:border-stone-800"
                                                                                        />
                                                                                    ) : (
                                                                                        <div className="size-9 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0 text-stone-400">
                                                                                            <Package className="size-4" />
                                                                                        </div>
                                                                                    )}
                                                                                    <div className="min-w-0">
                                                                                        <p className="text-xs font-medium text-stone-800 dark:text-stone-200 line-clamp-1">
                                                                                            {itemTitle}
                                                                                        </p>
                                                                                        <p className="text-[11px] text-stone-400">
                                                                                            Qty: {itemQty} × ${itemPrice}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                        {productsList.length === 0 && (
                                                                            <span className="text-xs text-stone-400 italic">No item details</span>
                                                                        )}
                                                                    </div>
                                                                </td>

                                                                {/* Column 3: Delivery Address */}
                                                                <td className="py-4 px-4 align-top text-xs text-stone-600 dark:text-stone-400">
                                                                    {address ? (
                                                                        <div className="space-y-0.5">
                                                                            <p className="font-medium text-stone-800 dark:text-stone-200">
                                                                                {address.address_line1 || "Street Address"}
                                                                            </p>
                                                                            <p className="text-[11px] text-stone-500">
                                                                                {[address.city, address.state, address.zip_code].filter(Boolean).join(", ")}
                                                                            </p>
                                                                            {address.phone_number && (
                                                                                <p className="text-[11px] text-stone-400 font-mono">
                                                                                    {address.phone_number}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-xs text-stone-400 italic">No address provided</span>
                                                                    )}
                                                                </td>

                                                                {/* Column 4: Payment */}
                                                                <td className="py-4 px-4 align-top">
                                                                    <div className="space-y-1.5">
                                                                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                                                                            {paymentType === "COD" ? (
                                                                                <>
                                                                                    <Banknote className="size-3 text-amber-600 dark:text-amber-400" />
                                                                                    <span>Cash on Delivery</span>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <CreditCard className="size-3 text-indigo-600 dark:text-indigo-400" />
                                                                                    <span>Online Card</span>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                            <span
                                                                                className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                                                                    paymentStatus === "PAID"
                                                                                        ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300"
                                                                                        : "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300"
                                                                                }`}
                                                                            >
                                                                                {paymentStatus}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                {/* Column 5: Status */}
                                                                <td className="py-4 px-4 align-top">
                                                                    <span
                                                                        className={`inline-block text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                                                            orderStatus === "DELIVERED" || orderStatus === "COMPLETED"
                                                                                ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300"
                                                                                : orderStatus === "CANCELLED"
                                                                                ? "bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300"
                                                                                : "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300"
                                                                        }`}
                                                                    >
                                                                        {orderStatus}
                                                                    </span>
                                                                </td>

                                                                {/* Column 6: Total Price */}
                                                                <td className="py-4 px-4 align-top text-right">
                                                                    <div className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                                                                        ${totalPrice}
                                                                    </div>
                                                                    <div className="text-[10px] text-stone-400">
                                                                        Shipping: ${shippingFee}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination Footer */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-stone-200/80 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/60">
                                            <p className="text-xs text-stone-500 dark:text-stone-400">
                                                Showing Page <span className="font-semibold text-stone-900 dark:text-stone-100">{orderPage}</span> of{" "}
                                                <span className="font-semibold text-stone-900 dark:text-stone-100">{ordersTotalPages}</span>{" "}
                                                ({ordersCount} total orders)
                                            </p>

                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setOrderPage((prev) => Math.max(1, prev - 1))}
                                                    disabled={orderPage <= 1}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <ChevronLeft className="size-3.5" />
                                                    <span>Previous</span>
                                                </button>

                                                {Array.from({ length: ordersTotalPages }, (_, i) => i + 1).map((p) => (
                                                    <button
                                                        key={p}
                                                        type="button"
                                                        onClick={() => setOrderPage(p)}
                                                        className={`size-8 rounded-lg text-xs font-medium transition-colors ${
                                                            p === orderPage
                                                                ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold shadow-xs"
                                                                : "border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                                                        }`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}

                                                <button
                                                    type="button"
                                                    onClick={() => setOrderPage((prev) => Math.min(ordersTotalPages, prev + 1))}
                                                    disabled={orderPage >= ordersTotalPages}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <span>Next</span>
                                                    <ChevronRight className="size-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                !isOrdersLoading && (
                                    /* Empty State for Orders */
                                    <div className="text-center py-12 px-4 rounded-2xl sm:rounded-3xl border border-dashed border-stone-300 dark:border-stone-700 bg-[#f8f9fa] dark:bg-card/60">
                                        <div className="size-14 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center mx-auto mb-3">
                                            <Package className="size-7" />
                                        </div>
                                        <h4 className="font-serif font-medium text-base sm:text-lg text-stone-900 dark:text-stone-100">
                                            No Orders Placed Yet
                                        </h4>
                                        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto mt-1 mb-5">
                                            Your order history is empty. Choose from our curated dermatologist formulas and proceed to checkout.
                                        </p>
                                        <Link
                                            to="/products"
                                            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:text-stone-900 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer active:scale-95"
                                        >
                                            <ShoppingBag className="size-4" />
                                            <span>Shop Essentials</span>
                                        </Link>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* =========================================================================
          4. EDIT PROFILE MODAL (Portal with proper Z-Index and Layout)
             - Navbar: z-[100] (visible on top)
             - Modal Container: z-[95] with subtle backdrop so page content & footer stay clearly visible
             - Page & Footer Content: z-0 (visible underneath)
          ========================================================================= */}
            {isEditModalOpen && mounted && createPortal(
                <div
                    className="fixed inset-0 z-[95] flex items-start justify-center px-3 sm:px-4 pb-6 bg-black/[0.08] dark:bg-black/30 animate-in fade-in duration-150 overflow-y-auto"
                    style={{ paddingTop: `${headerOffset}px` }}
                    onClick={() => setIsEditModalOpen(false)}
                >
                    <div
                        className="relative w-full max-w-lg bg-card text-card-foreground rounded-3xl p-6 sm:p-7 shadow-2xl border border-border/80 animate-in zoom-in-95 duration-200 overflow-y-auto"
                        style={{ maxHeight: `calc(100vh - ${headerOffset + 24}px)` }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
                            <div className="flex items-center gap-2.5">
                                <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Edit3 className="size-4" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-foreground">Edit Your Profile</h3>
                                    <p className="text-xs text-muted-foreground">
                                        Update personal information and skin profile
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
                                title="Close modal"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        {/* Form Error Banner */}
                        {(formError || updateError) && (
                            <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
                                <AlertCircle className="size-4 shrink-0" />
                                <span>{formError || updateError}</span>
                            </div>
                        )}

                        {/* Modal Edit Form */}
                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            {/* Photo Upload with Live Preview */}
                            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/30 border border-border/60 text-center">
                                <div
                                    className="relative group cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="size-20 rounded-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 ring-2 ring-primary/30 flex items-center justify-center shadow-sm">
                                        {previewImage ? (
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            <User className="size-8 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black/45 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                        <Camera className="size-5" />
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="mt-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
                                >
                                    Change Profile Photo
                                </button>
                            </div>

                            {/* Full Name */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-foreground">
                                    Full Name <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter full name"
                                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                />
                            </div>

                            {/* Contact Number */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-foreground">
                                    Contact Number
                                </label>
                                <input
                                    type="tel"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    placeholder="+8801700000000"
                                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                />
                            </div>

                            {/* Gender Select */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-foreground">Gender</label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer"
                                >
                                    {GENDER_OPTIONS.map((g) => (
                                        <option key={g.value} value={g.value}>
                                            {g.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date of Birth */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-foreground">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer"
                                />
                            </div>

                            {/* Skin Type */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-foreground">
                                    Skin Type Profile
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    {SKIN_TYPE_OPTIONS.map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => {
                                                setSkinType(type)
                                                setCustomSkinType("")
                                            }}
                                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${skinType === type
                                                ? "bg-primary text-primary-foreground shadow-xs"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={customSkinType || (SKIN_TYPE_OPTIONS.includes(skinType) ? "" : skinType)}
                                    onChange={(e) => {
                                        setCustomSkinType(e.target.value)
                                        setSkinType(e.target.value)
                                    }}
                                    placeholder="Or enter custom skin concern (e.g. Acne & Breakouts)"
                                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-5">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsEditModalOpen(false)}
                                    disabled={isUpdating}
                                    className="rounded-xl text-xs cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={isUpdating}
                                    className="rounded-xl text-xs font-semibold px-5 gap-1.5 cursor-pointer"
                                >
                                    {isUpdating ? (
                                        <>
                                            <Loader2 className="size-3.5 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="size-3.5" />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* =========================================================================
          5. ROUTINE DETAILS MODAL (Portal)
          ========================================================================= */}
            {viewingRoutineDetail && mounted && createPortal(
                <div
                    className="fixed inset-0 z-[95] flex items-start justify-center px-3 sm:px-6 pb-6 bg-black/25 dark:bg-black/50 backdrop-blur-[1px] animate-in fade-in duration-150 overflow-y-auto"
                    style={{ paddingTop: `${headerOffset}px` }}
                    onClick={() => setViewingRoutineDetail(null)}
                >
                    <div
                        className="relative w-full max-w-4xl bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-3xl shadow-2xl border border-stone-200/90 dark:border-stone-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
                        style={{ maxHeight: `calc(100vh - ${headerOffset + 24}px)` }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-4 sm:p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/90 dark:bg-stone-800/60 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                                    <Heart className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-serif font-medium leading-tight">
                                        Saved Skincare Routine #{viewingRoutineDetail.id}
                                    </h3>
                                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                                        Tailored AI Dermatological Prescription & Regimen
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setViewingRoutineDetail(null)}
                                className="size-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center justify-center transition-colors cursor-pointer"
                                aria-label="Close"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        {/* Body */}
                        {(() => {
                            const detailRoutineData =
                                typeof viewingRoutineDetail.routine_json === "string"
                                    ? (() => {
                                          try {
                                              return JSON.parse(viewingRoutineDetail.routine_json)
                                          } catch {
                                              return {}
                                          }
                                      })()
                                    : (viewingRoutineDetail.routine_json || {})

                            const morningGuide = detailRoutineData.morning || ""
                            const morningProducts: RoutineProduct[] = detailRoutineData.morning_products || []
                            const nightGuide = detailRoutineData.night || ""
                            const nightProducts: RoutineProduct[] = detailRoutineData.night_products || []
                            const precautions: string[] = detailRoutineData.precautions || []

                            return (
                                <div className="overflow-y-auto flex-1 min-h-0 p-5 sm:p-7 space-y-7 overscroll-contain">
                                    {/* Morning Protocol */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-serif font-medium text-base sm:text-lg pb-1 border-b border-amber-200/60 dark:border-amber-900/40">
                                            <Sun className="size-5" />
                                            <span>Morning Regimen (AM)</span>
                                        </div>
                                        {morningGuide && (
                                            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs sm:text-sm text-amber-950 dark:text-amber-200/90 leading-relaxed">
                                                {morningGuide}
                                            </div>
                                        )}
                                        {morningProducts.length > 0 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                                {morningProducts.map((prod: RoutineProduct) => {
                                                    const inFav = isFavorite(prod.id)
                                                    const inStock = prod.is_available !== false && (prod.stock ?? 1) > 0
                                                    return (
                                                        <div
                                                            key={prod.id}
                                                            className="p-3.5 rounded-2xl bg-[#fafafa] dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-800 flex flex-col justify-between hover:border-stone-300 dark:hover:border-stone-700 transition-all gap-3 group"
                                                        >
                                                            <div className="flex gap-3">
                                                                {prod.image ? (
                                                                    <img
                                                                        src={prod.image}
                                                                        alt={prod.title}
                                                                        className="size-16 rounded-xl object-contain bg-white dark:bg-stone-900 p-1.5 border border-stone-200/70 dark:border-stone-800 shrink-0"
                                                                    />
                                                                ) : (
                                                                    <div className="size-16 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0 text-stone-400">
                                                                        <Package className="size-6" />
                                                                    </div>
                                                                )}
                                                                <div className="min-w-0 flex-1 space-y-1">
                                                                    <div className="flex items-center justify-between gap-2">
                                                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-200/80 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                                                                            {prod.category?.name || "Skincare"}
                                                                        </span>
                                                                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                                                                            ${Number(prod.price || 0).toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                    <h4 className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                                                                        {prod.title}
                                                                    </h4>
                                                                    {prod.how_to_use && (
                                                                        <p className="text-[10px] text-stone-500 line-clamp-2">
                                                                            <strong className="text-stone-700 dark:text-stone-300">How to use:</strong> {prod.how_to_use}
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
                                                                            <CheckCircle2 className="size-3.5" />
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
                                        )}
                                    </div>

                                    {/* Night Protocol */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-serif font-medium text-base sm:text-lg pb-1 border-b border-indigo-200/60 dark:border-indigo-900/40">
                                            <Moon className="size-5" />
                                            <span>Night Regimen (PM)</span>
                                        </div>
                                        {nightGuide && (
                                            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/40 text-xs sm:text-sm text-indigo-950 dark:text-indigo-200/90 leading-relaxed">
                                                {nightGuide}
                                            </div>
                                        )}
                                        {nightProducts.length > 0 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                                {nightProducts.map((prod: RoutineProduct) => {
                                                    const inFav = isFavorite(prod.id)
                                                    const inStock = prod.is_available !== false && (prod.stock ?? 1) > 0
                                                    return (
                                                        <div
                                                            key={prod.id}
                                                            className="p-3.5 rounded-2xl bg-[#fafafa] dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-800 flex flex-col justify-between hover:border-stone-300 dark:hover:border-stone-700 transition-all gap-3 group"
                                                        >
                                                            <div className="flex gap-3">
                                                                {prod.image ? (
                                                                    <img
                                                                        src={prod.image}
                                                                        alt={prod.title}
                                                                        className="size-16 rounded-xl object-contain bg-white dark:bg-stone-900 p-1.5 border border-stone-200/70 dark:border-stone-800 shrink-0"
                                                                    />
                                                                ) : (
                                                                    <div className="size-16 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0 text-stone-400">
                                                                        <Package className="size-6" />
                                                                    </div>
                                                                )}
                                                                <div className="min-w-0 flex-1 space-y-1">
                                                                    <div className="flex items-center justify-between gap-2">
                                                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-200/80 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                                                                            {prod.category?.name || "Skincare"}
                                                                        </span>
                                                                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
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
                                                                        <p className="text-[10px] text-stone-500 line-clamp-2">
                                                                            <strong className="text-stone-700 dark:text-stone-300">How to use:</strong> {prod.how_to_use}
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
                                                                            <CheckCircle2 className="size-3.5" />
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
                                        )}
                                    </div>

                                    {/* Precautions */}
                                    {precautions.length > 0 && (
                                        <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-1.5">
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-800 dark:text-rose-300">
                                                <AlertCircle className="size-4" />
                                                <span>Precautions</span>
                                            </div>
                                            <ul className="text-xs text-rose-900/90 dark:text-rose-200/90 space-y-1 list-disc pl-5">
                                                {precautions.map((item: string, idx: number) => (
                                                    <li key={idx}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )
                        })()}

                        {/* Footer */}
                        <div className="p-4 bg-stone-50/90 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 flex justify-end shrink-0">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setViewingRoutineDetail(null)}
                                className="rounded-xl text-xs cursor-pointer"
                            >
                                Close Regimen
                            </Button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
