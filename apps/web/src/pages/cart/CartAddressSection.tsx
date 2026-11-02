import React, { useState, useEffect } from "react"
import {
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  Phone,
  Building,
  Globe,
  AlertCircle,
  Loader2,
  X,
  ShieldCheck,
  UserCheck,
} from "lucide-react"
import { useAddresses, type UserAddress, type CreateAddressInput } from "@/hooke/useAddresses"
import { useAuth } from "@/hooke/useAuth"

interface CartAddressSectionProps {
  selectedAddressId: number | string | null
  onSelectAddress: (address: UserAddress | null) => void
  onOpenAuthModal?: () => void
}

export default function CartAddressSection({
  selectedAddressId,
  onSelectAddress,
  onOpenAuthModal,
}: CartAddressSectionProps) {
  const { user } = useAuth()
  const {
    addresses,
    isLoading,
    isError,
    errorMessage,
    createAddress,
    isCreating,
    createError,
    deleteAddress,
    isDeleting,
    deletingId,
    deleteError,
    refetch,
  } = useAddresses()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deletingConfirmId, setDeletingConfirmId] = useState<number | string | null>(null)
  const [formValidationMsg, setFormValidationMsg] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState<CreateAddressInput>({
    address_line1: "",
    city: "Dhaka",
    state: "Dhaka",
    zip_code: "8300",
    country: "Bangladesh",
    phone_number: "01761290547",
  })

  // Auto-select first address if none is selected and list is loaded
  useEffect(() => {
    if (addresses.length > 0) {
      const currentSelected = addresses.find(
        (addr) => String(addr.id) === String(selectedAddressId)
      )
      if (!currentSelected) {
        onSelectAddress(addresses[0])
      }
    } else if (addresses.length === 0 && selectedAddressId !== null) {
      onSelectAddress(null)
    }
  }, [addresses, selectedAddressId, onSelectAddress])

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (formValidationMsg) setFormValidationMsg(null)
  }

  // Handle create address
  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormValidationMsg(null)

    if (!formData.address_line1.trim()) {
      setFormValidationMsg("Please enter street address line.")
      return
    }
    if (!formData.phone_number.trim()) {
      setFormValidationMsg("Please enter a contact phone number.")
      return
    }
    if (!formData.city.trim()) {
      setFormValidationMsg("Please enter a city.")
      return
    }
    if (!formData.country.trim()) {
      setFormValidationMsg("Please enter a country.")
      return
    }

    try {
      const created = await createAddress(formData)
      // Reset form
      setFormData({
        address_line1: "",
        city: "Dhaka",
        state: "Dhaka",
        zip_code: "8300",
        country: "Bangladesh",
        phone_number: "01761290547",
      })
      setIsFormOpen(false)
      // Auto-select newly created address
      if (created) {
        onSelectAddress(created)
      }
    } catch {
      // Error handled by TanStack Query
    }
  }

  // Handle delete address
  const handleDeleteAddress = async (id: number | string) => {
    try {
      await deleteAddress(id)
      setDeletingConfirmId(null)
      if (String(selectedAddressId) === String(id)) {
        const remaining = addresses.filter((item) => String(item.id) !== String(id))
        onSelectAddress(remaining[0] || null)
      }
    } catch {
      // Error handled by mutation
    }
  }

  // Unauthenticated State
  if (!user) {
    return (
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="size-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <UserCheck className="size-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-serif font-medium text-stone-900 dark:text-stone-100 text-base sm:text-lg">
              Delivery Address
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Please sign in to select or add your delivery address and complete your checkout.
            </p>
            {onOpenAuthModal && (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="mt-4 px-4 py-2 rounded-xl bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:text-stone-900 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 flex items-center justify-center">
            <MapPin className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-medium text-stone-900 dark:text-stone-100 text-base sm:text-lg">
                Delivery Address
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                {addresses.length} {addresses.length === 1 ? "Saved" : "Saved"}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Select where you'd like your order delivered or add a new shipping destination.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsFormOpen(!isFormOpen)
            setFormValidationMsg(null)
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-2xs"
        >
          {isFormOpen ? (
            <>
              <X className="size-3.5" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus className="size-3.5" />
              <span>Add New Address</span>
            </>
          )}
        </button>
      </div>

      {/* Global Errors */}
      {isError && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0 text-rose-600" />
            <span>{errorMessage || "Failed to load addresses."}</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="underline font-semibold hover:text-rose-900 dark:hover:text-rose-100 text-xs cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {deleteError && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>{deleteError}</span>
        </div>
      )}

      {/* Add Address Form (Collapsible / Expandable) */}
      {isFormOpen && (
        <form
          onSubmit={handleCreateAddress}
          className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/40 p-4 sm:p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 shadow-inner"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Plus className="size-4 text-stone-700 dark:text-stone-300" />
              <span>Enter New Address Details</span>
            </h3>
            <span className="text-[11px] text-stone-400">All fields required</span>
          </div>

          {formValidationMsg && (
            <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{formValidationMsg}</span>
            </p>
          )}

          {createError && (
            <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{createError}</span>
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Address Line 1 */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                Street Address / House & Road <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="address_line1"
                value={formData.address_line1}
                onChange={handleChange}
                placeholder="e.g. House 24, Road 11, Block D, Banani"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 outline-none focus:ring-1 focus:ring-stone-400 transition-all shadow-2xs"
                required
              />
            </div>

            {/* City */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1">
                <Building className="size-3 text-stone-400" />
                <span>City <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Dhaka"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 outline-none focus:ring-1 focus:ring-stone-400 transition-all shadow-2xs"
                required
              />
            </div>

            {/* State */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                State / Division <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Dhaka"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 outline-none focus:ring-1 focus:ring-stone-400 transition-all shadow-2xs"
                required
              />
            </div>

            {/* Zip Code */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                Postal / Zip Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
                placeholder="e.g. 1213"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 outline-none focus:ring-1 focus:ring-stone-400 transition-all shadow-2xs"
                required
              />
            </div>

            {/* Country */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1">
                <Globe className="size-3 text-stone-400" />
                <span>Country <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. Bangladesh"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 outline-none focus:ring-1 focus:ring-stone-400 transition-all shadow-2xs"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1">
                <Phone className="size-3 text-stone-400" />
                <span>Contact Phone Number <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="e.g. 01761290547"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 outline-none focus:ring-1 focus:ring-stone-400 transition-all shadow-2xs"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 rounded-xl hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:text-stone-900 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isCreating ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Saving Address...</span>
                </>
              ) : (
                <span>Save & Deliver Here</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 py-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-stone-100 dark:bg-stone-800/60 animate-pulse border border-stone-200/60 dark:border-stone-800"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && addresses.length === 0 && !isFormOpen && (
        <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700/80 bg-stone-50/50 dark:bg-stone-800/20">
          <div className="size-12 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 flex items-center justify-center mx-auto mb-3">
            <MapPin className="size-6" />
          </div>
          <h4 className="font-serif font-medium text-stone-900 dark:text-stone-100 text-sm sm:text-base">
            No shipping addresses saved yet
          </h4>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto mt-1 mb-4">
            Add your primary shipping destination so we can safely deliver your skincare products.
          </p>
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:text-stone-900 rounded-xl text-xs font-medium transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="size-3.5" />
            <span>Add Delivery Address</span>
          </button>
        </div>
      )}

      {/* Address Selection Cards */}
      {!isLoading && addresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {addresses.map((address) => {
            const isSelected = String(address.id) === String(selectedAddressId)
            const isBeingDeleted = isDeleting && String(deletingId) === String(address.id)
            const isConfirmingDelete = deletingConfirmId === address.id

            return (
              <div
                key={address.id}
                onClick={() => onSelectAddress(address)}
                className={`relative group rounded-2xl p-4 transition-all duration-200 cursor-pointer border text-left flex flex-col justify-between ${
                  isSelected
                    ? "border-stone-900 dark:border-stone-100 bg-stone-50/90 dark:bg-stone-800/80 shadow-xs ring-1 ring-stone-900/10 dark:ring-stone-100/20"
                    : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/70 hover:border-stone-300 dark:hover:border-stone-700"
                }`}
              >
                {/* Top Row: Radio & Selected Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`size-4 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100"
                          : "border-stone-300 dark:border-stone-600 bg-transparent"
                      }`}
                    >
                      {isSelected && (
                        <div className="size-1.5 rounded-full bg-white dark:bg-stone-900" />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                      Address #{address.id}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="size-3" />
                      <span>Deliver Here</span>
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1 text-xs text-stone-600 dark:text-stone-300 my-1">
                  <p className="font-medium text-stone-900 dark:text-stone-100 line-clamp-2">
                    {address.address_line1}
                  </p>
                  <p className="text-stone-500 dark:text-stone-400">
                    {address.city}
                    {address.state ? `, ${address.state}` : ""}
                    {address.zip_code ? ` - ${address.zip_code}` : ""}
                  </p>
                  <p className="text-stone-500 dark:text-stone-400">{address.country}</p>
                  {address.phone_number && (
                    <p className="flex items-center gap-1.5 pt-1 text-[11px] text-stone-700 dark:text-stone-300 font-medium">
                      <Phone className="size-3 text-stone-400" />
                      <span>{address.phone_number}</span>
                    </p>
                  )}
                </div>

                {/* Bottom Actions: Delete */}
                <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400">
                    ID: {address.id}
                  </span>

                  {isConfirmingDelete ? (
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-[11px] text-rose-600 font-medium">Delete?</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(address.id)}
                        disabled={isBeingDeleted}
                        className="px-2 py-0.5 text-[11px] bg-rose-600 hover:bg-rose-700 text-white rounded-md cursor-pointer disabled:opacity-50"
                      >
                        {isBeingDeleted ? "..." : "Yes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingConfirmId(null)}
                        className="px-2 py-0.5 text-[11px] bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-md cursor-pointer"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeletingConfirmId(address.id)
                      }}
                      className="p-1 rounded-lg text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Delete this address"
                      aria-label="Delete this address"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Selected Address Summary Bar */}
      {selectedAddressId && (
        <div className="pt-2 flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
          <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>
            Selected shipping address ID:{" "}
            <strong className="text-stone-900 dark:text-stone-100">
              #{selectedAddressId}
            </strong>{" "}
            will be linked to this order.
          </span>
        </div>
      )}
    </div>
  )
}
