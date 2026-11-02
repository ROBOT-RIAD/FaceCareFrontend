import React, { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import {
  X,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  Check,
  Loader2,
  Calendar,
} from "lucide-react"
import signupBg from "@/assets/signup/image.png"
import { useAuth, formatErrorMessage } from "@/hooke/useAuth"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "signup" | "login"
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<"signup" | "login">(initialMode)

  // Signup form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState("")
  const [gender, setGender] = useState("female")
  const [contactNumber, setContactNumber] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [skinType, setSkinType] = useState("")
  const [skinTypeDropdownOpen, setSkinTypeDropdownOpen] = useState(false)

  // Format date input as YYYY-MM-DD
  const handleDateOfBirthChange = (val: string) => {
    let formatted = val.replace(/[/.]/g, "-").replace(/[^\d-]/g, "")
    if (!formatted.includes("-") && formatted.length > 4) {
      if (formatted.length <= 6) {
        formatted = `${formatted.slice(0, 4)}-${formatted.slice(4)}`
      } else {
        formatted = `${formatted.slice(0, 4)}-${formatted.slice(4, 6)}-${formatted.slice(6, 8)}`
      }
    }
    setDateOfBirth(formatted.slice(0, 10))
  }

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Auth context integration
  const { login, register } = useAuth()
  const [authLoading, setAuthLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const resetSignupForm = () => {
    setEmail("")
    setPassword("")
    setShowPassword(false)
    setFullName("")
    setGender("female")
    setContactNumber("")
    setDateOfBirth("")
    setSkinType("")
    setSkinTypeDropdownOpen(false)
  }

  const resetLoginForm = () => {
    setLoginEmail("")
    setLoginPassword("")
    setShowLoginPassword(false)
  }

  const resetAllForms = () => {
    resetSignupForm()
    resetLoginForm()
    setErrorMessage(null)
  }

  const handleClose = () => {
    resetAllForms()
    onClose()
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset mode when modal opens, and clear forms when modal closes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      setSkinTypeDropdownOpen(false)
      setErrorMessage(null)
    } else {
      resetAllForms()
    }
  }, [isOpen, initialMode])

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen || !mounted) return null

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setAuthLoading(true)
    try {
      if (dateOfBirth) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
          setErrorMessage("Date of Birth must be in YYYY-MM-DD format (e.g. 2000-01-15).")
          setAuthLoading(false)
          return
        }
        const parsedDate = new Date(dateOfBirth)
        if (isNaN(parsedDate.getTime())) {
          setErrorMessage("Please enter a valid Date of Birth (YYYY-MM-DD).")
          setAuthLoading(false)
          return
        }
      }

      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)
      formData.append("full_name", fullName)
      formData.append("fullName", fullName)
      formData.append("gender", gender)
      formData.append("contact_number", contactNumber)
      formData.append("contactNumber", contactNumber)
      formData.append("date_of_birth", dateOfBirth)
      formData.append("birthday", dateOfBirth)
      formData.append("skin_type", skinType)
      formData.append("skinType", skinType)

      await register(formData)
      resetAllForms()
      onClose()
    } catch (err: any) {
      setErrorMessage(
        formatErrorMessage(err, "Registration failed. Please check details and try again.")
      )
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setAuthLoading(true)
    try {
      await login({
        email: loginEmail,
        password: loginPassword,
      })
      resetAllForms()
      onClose()
    } catch (err: any) {
      setErrorMessage(
        formatErrorMessage(err, "Login failed. Please check your credentials.")
      )
    } finally {
      setAuthLoading(false)
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-4 pt-20 sm:pt-16 bg-black/[0.08] animate-in fade-in duration-150"
      onClick={handleClose}
    >
      {/* Click propagation stop on modal container */}
      <div
        className="relative w-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {mode === "login" ? (
          /* ================= LOGIN MODAL ================= */
          <div className="relative w-full max-w-[440px] bg-white text-stone-900 rounded-[32px] p-7 sm:p-10 shadow-2xl shadow-stone-950/20 border border-stone-200/80 animate-in zoom-in-95 duration-200">
            {/* Top Left: Circular Back Button */}
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="absolute top-6 left-6 size-10 rounded-full bg-white shadow-md hover:shadow-lg border border-stone-100 flex items-center justify-center text-stone-700 hover:text-stone-900 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Back to sign up"
            >
              <ArrowLeft className="size-4" />
            </button>

            {/* Top Right: Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-6 right-6 size-8 rounded-full text-stone-400 hover:text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            {/* Header Content */}
            <div className="text-center mt-6 mb-8">
              <h2 className="text-3xl sm:text-[34px] font-bold text-[#24272a] tracking-tight">
                Welcome Back
              </h2>
              <p className="mt-2.5 text-stone-600 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
                Log in to access your personalized skincare routine, expert recommendations, and more.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              {/* Email Field with Underline */}
              <div className="flex items-center gap-3 border-b border-stone-800/80 pb-2.5 transition-colors focus-within:border-stone-950">
                <Mail className="size-4 text-stone-600 shrink-0" />
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-transparent text-stone-900 placeholder:text-stone-500 text-sm outline-none"
                  required
                />
              </div>

              {/* Password Field with Underline */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 border-b border-stone-800/80 pb-2.5 transition-colors focus-within:border-stone-950">
                  <Lock className="size-4 text-stone-600 shrink-0" />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-transparent text-stone-900 placeholder:text-stone-500 text-sm outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                {/* Forget Password */}
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    className="text-xs text-stone-600 hover:text-stone-900 hover:underline transition-colors cursor-pointer"
                  >
                    Forget Password?
                  </button>
                </div>
              </div>

                {/* Error message */}
                {errorMessage && (
                  <div className="rounded-lg bg-destructive/15 text-destructive text-xs p-2.5 text-center">
                    {typeof errorMessage === "string"
                      ? errorMessage
                      : (errorMessage as any)?.message || "Registration error. Please check your details."}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full rounded-xl bg-[#2e3135] hover:bg-[#202225] disabled:opacity-70 text-white py-3.5 font-medium text-sm transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                >
                  {authLoading && <Loader2 className="size-4 animate-spin" />}
                  <span>{authLoading ? "Logging in..." : "Login"}</span>
                </button>

              {/* Switch to Signup */}
              <p className="text-center text-xs sm:text-sm text-stone-600 pt-1">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="font-bold text-stone-900 hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </p>
            </form>
          </div>
        ) : (
          /* ================= SIGNUP MODAL ================= */
          <div
            className="relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl shadow-stone-950/25 border border-stone-300/40 bg-[#be9f88] text-stone-900 animate-in zoom-in-95 duration-200"
            style={{
              backgroundImage: `url(${signupBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Top Right Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 size-8 rounded-full text-stone-800 hover:text-stone-950 flex items-center justify-center transition-colors cursor-pointer bg-white/40 hover:bg-white/70"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
              {/* Left Side: Empty space on desktop to let the heart cream show */}
              <div className="hidden md:block md:col-span-5" />

              {/* Right Side: Form Overlay */}
              <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white/20 sm:bg-transparent backdrop-blur-[2px] md:backdrop-blur-none">
                {/* Header */}
                <div className="text-left mb-4">
                  <h2 className="text-xl sm:text-[22px] font-serif font-medium text-stone-900 leading-tight">
                    Your skin decoded
                  </h2>
                  <p className="text-stone-800 text-sm font-light">
                    Complete your profile to unlock.
                  </p>
                  <p className="text-stone-800/90 text-xs mt-3 leading-relaxed max-w-sm">
                    Join the Glowmi Circle and receive your first order complimentary
                  </p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSignupSubmit} className="space-y-2.5">
                  {/* Email */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <label className="text-stone-800 text-xs sm:text-sm font-medium w-28 shrink-0">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-full bg-white text-stone-900 px-4 py-1.5 text-xs sm:text-sm shadow-xs outline-none focus:ring-1 focus:ring-stone-400 placeholder:text-stone-400"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <label className="text-stone-800 text-xs sm:text-sm font-medium w-28 shrink-0">
                      Password
                    </label>
                    <div className="relative w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-full bg-white text-stone-900 px-4 py-1.5 pr-8 text-xs sm:text-sm shadow-xs outline-none focus:ring-1 focus:ring-stone-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800 cursor-pointer"
                        aria-label="Toggle password"
                      >
                        {showPassword ? (
                          <EyeOff className="size-3.5" />
                        ) : (
                          <Eye className="size-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <label className="text-stone-800 text-xs sm:text-sm font-medium w-28 shrink-0">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-full bg-white text-stone-900 px-4 py-1.5 text-xs sm:text-sm shadow-xs outline-none focus:ring-1 focus:ring-stone-400 placeholder:text-stone-400"
                      required
                    />
                  </div>

                  {/* Gender */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <label className="text-stone-800 text-xs sm:text-sm font-medium w-28 shrink-0">
                      Gender
                    </label>
                    <div className="flex items-center gap-2 w-full">
                      {[
                        { label: "Female", value: "female" },
                        { label: "Male", value: "male" },
                        { label: "Other", value: "other" },
                      ].map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setGender(item.value)}
                          className={`flex-1 rounded-full py-1 text-xs font-medium transition-all cursor-pointer ${
                            gender === item.value
                              ? "bg-[#303336] text-white shadow-xs"
                              : "bg-white/90 text-stone-700 hover:bg-white"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <label className="text-stone-800 text-xs sm:text-sm font-medium w-28 shrink-0">
                      Contact
                    </label>
                    <input
                      type="tel"
                      placeholder="+8801700000000"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full rounded-full bg-white text-stone-900 px-4 py-1.5 text-xs sm:text-sm shadow-xs outline-none focus:ring-1 focus:ring-stone-400 placeholder:text-stone-400"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <label className="text-stone-800 text-xs sm:text-sm font-medium w-28 shrink-0">
                      Date of Birth
                    </label>
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="YYYY-MM-DD"
                        value={dateOfBirth}
                        onChange={(e) => handleDateOfBirthChange(e.target.value)}
                        maxLength={10}
                        className="w-full rounded-full bg-white text-stone-900 px-4 py-1.5 pr-9 text-xs sm:text-sm shadow-xs outline-none focus:ring-1 focus:ring-stone-400 placeholder:text-stone-400"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 size-4 flex items-center justify-center">
                        <Calendar className="size-3.5 text-stone-500 pointer-events-none" />
                        <input
                          type="date"
                          max={new Date().toISOString().split("T")[0]}
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full [color-scheme:light]"
                          title="Choose date from calendar"
                          tabIndex={-1}
                          onClick={(e) => {
                            const target = e.currentTarget as HTMLInputElement
                            if (target && "showPicker" in target) {
                              try {
                                target.showPicker()
                              } catch {
                                // fallback
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skin Type */}
                  <div className="flex items-center gap-2 sm:gap-3 relative">
                    <label className="text-stone-800 text-xs sm:text-sm font-medium w-28 shrink-0">
                      Skin Type
                    </label>
                    <div className="relative w-full">
                      <button
                        type="button"
                        onClick={() => setSkinTypeDropdownOpen(!skinTypeDropdownOpen)}
                        className="w-full rounded-full bg-white text-stone-900 px-4 py-1.5 text-xs sm:text-sm shadow-xs flex items-center justify-between cursor-pointer outline-none focus:ring-1 focus:ring-stone-400"
                      >
                        <span className={skinType ? "text-stone-900 font-medium" : "text-stone-500"}>
                          {skinType || "Select Skin Type"}
                        </span>
                        <ChevronDown className="size-3.5 text-stone-500" />
                      </button>

                      {/* Dropdown Menu (matching design) */}
                      {skinTypeDropdownOpen && (
                        <div className="absolute right-0 top-full mt-1.5 z-30 w-48 rounded-xl bg-white/95 backdrop-blur-md shadow-xl border border-stone-200/80 py-1 text-xs sm:text-sm max-h-48 overflow-y-auto">
                          {["Normal", "Dry", "Oily", "Combination", "Sensitive", "Acne-Prone", "Mature", "Other"].map(
                            (type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => {
                                  setSkinType(type)
                                  setSkinTypeDropdownOpen(false)
                                }}
                                className={`w-full text-left px-3.5 py-1.5 hover:bg-stone-100 transition-colors flex items-center justify-between cursor-pointer ${
                                  skinType === type
                                    ? "font-semibold text-stone-900 bg-stone-50"
                                    : "text-stone-700"
                                }`}
                              >
                                <span>{type}</span>
                                {skinType === type && <Check className="size-3 text-stone-800" />}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Error message */}
                  {errorMessage && (
                    <div className="rounded-lg bg-red-100 text-red-700 text-xs p-2 text-center border border-red-200">
                      {typeof errorMessage === "string"
                        ? errorMessage
                        : (errorMessage as any)?.message || "Login error. Please check your credentials."}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2 text-center">
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full max-w-[220px] mx-auto rounded-full bg-[#303336] hover:bg-[#202224] disabled:opacity-70 text-white py-2 px-6 text-xs sm:text-sm font-medium transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {authLoading && <Loader2 className="size-3.5 animate-spin" />}
                      <span>{authLoading ? "Entering..." : "Enter the Circle"}</span>
                    </button>
                  </div>

                  {/* Switch to Login Link */}
                  <p className="text-center text-xs text-stone-800 pt-1">
                    Already in the circle?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="font-bold text-stone-950 underline hover:opacity-80 cursor-pointer"
                    >
                      Login
                    </button>
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export default AuthModal
