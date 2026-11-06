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
  KeyRound,
  CheckCircle2,
} from "lucide-react"
import signupBg from "@/assets/signup/image.png"
import { useAuth, formatErrorMessage } from "@/hooke/useAuth"
import { axiosPublic } from "@/hooke/useAxiosPublic"

type AuthMode = "signup" | "login" | "forgot_email" | "forgot_otp" | "forgot_reset"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "signup" | "login" | "forgot_email"
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)

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

  // Login form states
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  // Forgot password flow states
  const [forgotEmail, setForgotEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [otpResendCountdown, setOtpResendCountdown] = useState<number>(0)

  const [mounted, setMounted] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Auth context integration
  const { login, register } = useAuth()

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

  const resetForgotForm = () => {
    setOtp("")
    setResetToken("")
    setNewPassword("")
    setConfirmNewPassword("")
    setShowNewPassword(false)
    setShowConfirmNewPassword(false)
    setOtpResendCountdown(0)
  }

  const resetAllForms = () => {
    resetSignupForm()
    resetLoginForm()
    resetForgotForm()
    setErrorMessage(null)
    setSuccessMessage(null)
  }

  const handleClose = () => {
    resetAllForms()
    onClose()
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  // Countdown timer for OTP resend
  useEffect(() => {
    if (otpResendCountdown <= 0) return
    const timer = setInterval(() => {
      setOtpResendCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [otpResendCountdown])

  // Reset mode when modal opens, and clear forms when modal closes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      setSkinTypeDropdownOpen(false)
      setErrorMessage(null)
      setSuccessMessage(null)
      // Check if there is a saved forgot email in localStorage
      const savedEmail = localStorage.getItem("forgot_password_email")
      if (savedEmail) {
        setForgotEmail(savedEmail)
      }
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

  // ==========================================
  // SIGNUP SUBMIT
  // ==========================================
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)
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

  // ==========================================
  // LOGIN SUBMIT
  // ==========================================
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

  // ==========================================
  // FORGOT PASSWORD STEP 1: SEND OTP
  // ==========================================
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const targetEmail = forgotEmail.trim()
    if (!targetEmail) {
      setErrorMessage("Please enter your registered email address.")
      return
    }

    setAuthLoading(true)
    try {
      const formData = new FormData()
      formData.append("email", targetEmail)

      const response = await axiosPublic.post("/api/v1/send-otp/", formData)

      // Save email in localStorage and state for drilling
      localStorage.setItem("forgot_password_email", targetEmail)
      setForgotEmail(targetEmail)

      setSuccessMessage(
        response.data?.message || "OTP sent successfully. OTP is valid for 5 minutes."
      )
      setOtp("")
      setOtpResendCountdown(60) // 60 seconds cooldown
      setMode("forgot_otp")
    } catch (err: any) {
      setErrorMessage(
        formatErrorMessage(err, "Failed to send OTP. Please check your email and try again.")
      )
    } finally {
      setAuthLoading(false)
    }
  }

  // ==========================================
  // FORGOT PASSWORD STEP 2: VERIFY OTP
  // ==========================================
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const targetEmail = forgotEmail.trim() || localStorage.getItem("forgot_password_email") || ""
    const targetOtp = otp.trim()

    if (!targetEmail) {
      setErrorMessage("Email not found. Please re-enter your email.")
      setMode("forgot_email")
      return
    }

    if (!targetOtp || targetOtp.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit OTP code.")
      return
    }

    setAuthLoading(true)
    try {
      const formData = new FormData()
      formData.append("email", targetEmail)
      formData.append("otp", targetOtp)

      const response = await axiosPublic.post("/api/v1/verify-otp/", formData)

      // The reset_token is inside response.data.data
      const token = response.data?.data || ""
      if (!token) {
        throw new Error("Verification token not received from server.")
      }

      setResetToken(token)
      setSuccessMessage(response.data?.message || "OTP verified successfully.")
      setNewPassword("")
      setConfirmNewPassword("")
      setMode("forgot_reset")
    } catch (err: any) {
      setErrorMessage(
        formatErrorMessage(err, "Invalid or expired OTP. Please check and try again.")
      )
    } finally {
      setAuthLoading(false)
    }
  }

  // ==========================================
  // FORGOT PASSWORD STEP 3: RESET PASSWORD
  // ==========================================
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const targetEmail = forgotEmail.trim() || localStorage.getItem("forgot_password_email") || ""

    if (!targetEmail) {
      setErrorMessage("Email is missing. Please restart the forgot password process.")
      setMode("forgot_email")
      return
    }

    if (!resetToken) {
      setErrorMessage("Reset token is missing or expired. Please verify OTP again.")
      setMode("forgot_otp")
      return
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.")
      return
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Passwords do not match. Please re-enter carefully.")
      return
    }

    setAuthLoading(true)
    try {
      const formData = new FormData()
      formData.append("email", targetEmail)
      formData.append("password", newPassword)
      formData.append("reset_token", resetToken)

      const response = await axiosPublic.post("/api/v1/reset-password/", formData)

      // Clear forgot password stored email and tokens
      localStorage.removeItem("forgot_password_email")
      setResetToken("")
      setOtp("")
      setNewPassword("")
      setConfirmNewPassword("")

      // Pre-populate login email so the user can easily log in
      setLoginEmail(targetEmail)
      setLoginPassword("")

      // Redirect step-by-step back to the Login modal
      setMode("login")
      setSuccessMessage(
        response.data?.message || "Password reset successfully. Please log in with your new password."
      )
    } catch (err: any) {
      setErrorMessage(
        formatErrorMessage(err, "Failed to reset password. Please try again.")
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
        {/* ========================================================
            1. LOGIN MODAL
            ======================================================== */}
        {mode === "login" && (
          <div className="relative w-full max-w-[440px] bg-white text-stone-900 rounded-[32px] p-7 sm:p-10 shadow-2xl shadow-stone-950/20 border border-stone-200/80 animate-in zoom-in-95 duration-200">
            {/* Top Left: Back Button to Signup */}
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null)
                setSuccessMessage(null)
                setMode("signup")
              }}
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

            {/* Success Notification (e.g. after password reset) */}
            {successMessage && (
              <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

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

                {/* Forget Password Trigger */}
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null)
                      setSuccessMessage(null)
                      const saved = loginEmail || localStorage.getItem("forgot_password_email") || ""
                      setForgotEmail(saved)
                      setMode("forgot_email")
                    }}
                    className="text-xs text-stone-600 hover:text-stone-900 hover:underline transition-colors cursor-pointer"
                  >
                    Forget Password?
                  </button>
                </div>
              </div>

              {/* Error message */}
              {errorMessage && (
                <div className="rounded-lg bg-destructive/15 text-destructive text-xs p-2.5 text-center">
                  {errorMessage}
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
                  onClick={() => {
                    setErrorMessage(null)
                    setSuccessMessage(null)
                    setMode("signup")
                  }}
                  className="font-bold text-stone-900 hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </p>
            </form>
          </div>
        )}

        {/* ========================================================
            2. FORGOT PASSWORD STEP 1: SEND OTP
            ======================================================== */}
        {mode === "forgot_email" && (
          <div className="relative w-full max-w-[440px] bg-white text-stone-900 rounded-[32px] p-7 sm:p-10 shadow-2xl shadow-stone-950/20 border border-stone-200/80 animate-in zoom-in-95 duration-200">
            {/* Top Left: Back to Login */}
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null)
                setSuccessMessage(null)
                setMode("login")
              }}
              className="absolute top-6 left-6 size-10 rounded-full bg-white shadow-md hover:shadow-lg border border-stone-100 flex items-center justify-center text-stone-700 hover:text-stone-900 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Back to login"
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
              <div className="size-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-800 shadow-xs">
                <KeyRound className="size-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#24272a] tracking-tight">
                Forgot Password?
              </h2>
              <p className="mt-2 text-stone-600 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
                Enter your registered email address and we'll send you an OTP to reset your password.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-800/80 pb-2.5 transition-colors focus-within:border-stone-950">
                <Mail className="size-4 text-stone-600 shrink-0" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full bg-transparent text-stone-900 placeholder:text-stone-500 text-sm outline-none"
                  required
                />
              </div>

              {/* Error message */}
              {errorMessage && (
                <div className="rounded-lg bg-destructive/15 text-destructive text-xs p-2.5 text-center">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full rounded-xl bg-[#2e3135] hover:bg-[#202225] disabled:opacity-70 text-white py-3.5 font-medium text-sm transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                {authLoading && <Loader2 className="size-4 animate-spin" />}
                <span>{authLoading ? "Sending OTP..." : "Send OTP"}</span>
              </button>

              {/* Back to Login link */}
              <p className="text-center text-xs sm:text-sm text-stone-600 pt-1">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null)
                    setSuccessMessage(null)
                    setMode("login")
                  }}
                  className="font-bold text-stone-900 hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </p>
            </form>
          </div>
        )}

        {/* ========================================================
            3. FORGOT PASSWORD STEP 2: VERIFY OTP
            ======================================================== */}
        {mode === "forgot_otp" && (
          <div className="relative w-full max-w-[440px] bg-white text-stone-900 rounded-[32px] p-7 sm:p-10 shadow-2xl shadow-stone-950/20 border border-stone-200/80 animate-in zoom-in-95 duration-200">
            {/* Top Left: Back to Step 1 */}
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null)
                setSuccessMessage(null)
                setMode("forgot_email")
              }}
              className="absolute top-6 left-6 size-10 rounded-full bg-white shadow-md hover:shadow-lg border border-stone-100 flex items-center justify-center text-stone-700 hover:text-stone-900 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Back"
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
            <div className="text-center mt-6 mb-7">
              <div className="size-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-800 shadow-xs">
                <Mail className="size-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#24272a] tracking-tight">
                Enter Verification Code
              </h2>
              <p className="mt-2 text-stone-600 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
                We sent a 6-digit OTP code to{" "}
                <span className="font-semibold text-stone-900 break-all">{forgotEmail}</span>.
                Code expires in 5 minutes.
              </p>
            </div>

            {/* Success message banner */}
            {successMessage && (
              <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-2.5 text-center">
                {successMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-center text-xs font-medium text-stone-600 uppercase tracking-wider">
                  6-Digit OTP Code
                </label>
                <div className="border-b border-stone-800/80 pb-2 transition-colors focus-within:border-stone-950">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-transparent text-stone-900 placeholder:text-stone-300 text-center text-2xl sm:text-3xl font-mono tracking-[0.45em] font-semibold outline-none"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {/* Resend OTP Row */}
              <div className="text-center text-xs text-stone-600">
                Didn't receive code?{" "}
                {otpResendCountdown > 0 ? (
                  <span className="font-semibold text-stone-900">
                    Resend in {otpResendCountdown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={authLoading}
                    className="font-bold text-stone-900 hover:underline cursor-pointer disabled:opacity-60"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Error message */}
              {errorMessage && (
                <div className="rounded-lg bg-destructive/15 text-destructive text-xs p-2.5 text-center">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={authLoading || otp.length !== 6}
                className="w-full rounded-xl bg-[#2e3135] hover:bg-[#202225] disabled:opacity-60 text-white py-3.5 font-medium text-sm transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                {authLoading && <Loader2 className="size-4 animate-spin" />}
                <span>{authLoading ? "Verifying OTP..." : "Verify OTP"}</span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================
            4. FORGOT PASSWORD STEP 3: RESET PASSWORD
            ======================================================== */}
        {mode === "forgot_reset" && (
          <div className="relative w-full max-w-[440px] bg-white text-stone-900 rounded-[32px] p-7 sm:p-10 shadow-2xl shadow-stone-950/20 border border-stone-200/80 animate-in zoom-in-95 duration-200">
            {/* Top Left: Back to OTP */}
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null)
                setSuccessMessage(null)
                setMode("forgot_otp")
              }}
              className="absolute top-6 left-6 size-10 rounded-full bg-white shadow-md hover:shadow-lg border border-stone-100 flex items-center justify-center text-stone-700 hover:text-stone-900 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Back"
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
            <div className="text-center mt-6 mb-7">
              <div className="size-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-800 shadow-xs">
                <Lock className="size-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#24272a] tracking-tight">
                Create New Password
              </h2>
              <p className="mt-2 text-stone-600 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
                Your identity has been verified. Set a new password for{" "}
                <span className="font-semibold text-stone-900 break-all">{forgotEmail}</span>.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* New Password */}
              <div className="flex items-center gap-3 border-b border-stone-800/80 pb-2.5 transition-colors focus-within:border-stone-950">
                <Lock className="size-4 text-stone-600 shrink-0" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-transparent text-stone-900 placeholder:text-stone-500 text-sm outline-none"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showNewPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              {/* Confirm New Password */}
              <div className="flex items-center gap-3 border-b border-stone-800/80 pb-2.5 transition-colors focus-within:border-stone-950">
                <Lock className="size-4 text-stone-600 shrink-0" />
                <input
                  type={showConfirmNewPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full bg-transparent text-stone-900 placeholder:text-stone-500 text-sm outline-none"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className="text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmNewPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              {/* Error message */}
              {errorMessage && (
                <div className="rounded-lg bg-destructive/15 text-destructive text-xs p-2.5 text-center">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full rounded-xl bg-[#2e3135] hover:bg-[#202225] disabled:opacity-70 text-white py-3.5 font-medium text-sm transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                {authLoading && <Loader2 className="size-4 animate-spin" />}
                <span>{authLoading ? "Resetting Password..." : "Reset Password"}</span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================
            5. SIGNUP MODAL
            ======================================================== */}
        {mode === "signup" && (
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
              <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white/30 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none">
                <div className="mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-950 tracking-tight">
                    Join the Circle
                  </h2>
                  <p className="text-xs text-stone-800 mt-0.5">
                    Experience personalized skincare with exclusive benefits.
                  </p>
                </div>

                <form onSubmit={handleSignupSubmit} className="space-y-2.5">
                  {/* Full Name */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <label className="text-stone-800 text-xs sm:text-sm font-medium w-28 shrink-0">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-full bg-white text-stone-900 placeholder:text-stone-400 px-4 py-1.5 text-xs sm:text-sm shadow-xs outline-none focus:ring-1 focus:ring-stone-400"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <label className="text-stone-800 text-xs sm:text-sm font-medium w-28 shrink-0">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-full bg-white text-stone-900 placeholder:text-stone-400 px-4 py-1.5 text-xs sm:text-sm shadow-xs outline-none focus:ring-1 focus:ring-stone-400"
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
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-full bg-white text-stone-900 placeholder:text-stone-400 px-4 py-1.5 pr-10 text-xs sm:text-sm shadow-xs outline-none focus:ring-1 focus:ring-stone-400"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Gender Selection */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <label className="text-stone-800 text-xs sm:text-sm font-medium w-28 shrink-0">
                      Gender
                    </label>
                    <div className="flex items-center gap-4 py-1">
                      {[
                        { label: "Female", val: "female" },
                        { label: "Male", val: "male" },
                        { label: "Other", val: "other" },
                      ].map((item) => (
                        <label
                          key={item.val}
                          className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-800 cursor-pointer font-medium"
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={item.val}
                            checked={gender === item.val}
                            onChange={(e) => setGender(e.target.value)}
                            className="accent-stone-900 cursor-pointer"
                          />
                          <span>{item.label}</span>
                        </label>
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
                      placeholder="+1 (555) 000-0000"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full rounded-full bg-white text-stone-900 placeholder:text-stone-400 px-4 py-1.5 text-xs sm:text-sm shadow-xs outline-none focus:ring-1 focus:ring-stone-400"
                      required
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <label className="text-stone-800 text-xs sm:text-sm font-medium w-28 shrink-0">
                      Date of Birth
                    </label>
                    <div className="relative w-full">
                      <div className="flex items-center w-full rounded-full bg-white shadow-xs focus-within:ring-1 focus-within:ring-stone-400 overflow-hidden px-4 py-1.5">
                        <input
                          type="text"
                          placeholder="YYYY-MM-DD"
                          value={dateOfBirth}
                          onChange={(e) => handleDateOfBirthChange(e.target.value)}
                          maxLength={10}
                          className="w-full bg-transparent text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm outline-none font-mono"
                        />
                        <input
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          className="sr-only"
                          id="dob-picker"
                        />
                        <label
                          htmlFor="dob-picker"
                          className="cursor-pointer text-stone-400 hover:text-stone-700 ml-1.5 shrink-0"
                          title="Pick date from calendar"
                        >
                          <Calendar className="size-3.5" />
                        </label>
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

                      {/* Dropdown Menu */}
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
                      {errorMessage}
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
                      onClick={() => {
                        setErrorMessage(null)
                        setSuccessMessage(null)
                        setMode("login")
                      }}
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
