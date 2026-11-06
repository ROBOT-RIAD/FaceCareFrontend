import React, { createContext, useContext, useState, useEffect } from "react"
import { axiosPublic } from "@/hooke/useAxiosPublic"

export interface User {
  id?: string | number
  _id?: string
  email: string
  name?: string
  fullName?: string
  full_name?: string
  contactNumber?: string
  contact_number?: string
  skinType?: string
  skin_type?: string
  birthday?: string
  date_of_birth?: string
  role?: string
  image?: string | null
  [key: string]: any
}

export type RegisterPayload =
  | {
      email: string
      password: string
      full_name?: string
      fullName?: string
      gender?: string
      contact_number?: string
      contactNumber?: string
      date_of_birth?: string
      birthday?: string
      skin_type?: string
      skinType?: string
      [key: string]: any
    }
  | FormData

export type LoginPayload =
  | {
      email: string
      password: string
      [key: string]: any
    }
  | FormData

export interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (credentials: LoginPayload) => Promise<any>
  register: (data: RegisterPayload) => Promise<any>
  logout: () => Promise<void>
  refreshToken: () => Promise<boolean>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const formatErrorMessage = (err: any, fallback = "An unexpected error occurred."): string => {
  if (!err) return fallback
  if (typeof err === "string") return err

  const data = err?.response?.data

  if (typeof data === "string") return data

  if (data && typeof data === "object") {
    if (typeof data.message === "string") return data.message
    if (data.message && typeof data.message === "object" && typeof data.message.message === "string") {
      return data.message.message
    }
    if (typeof data.error === "string") return data.error
    if (data.error && typeof data.error === "object" && typeof data.error.message === "string") {
      return data.error.message
    }
    if (typeof data.detail === "string") return data.detail
    if (typeof (data as any)?.message === "string") return (data as any).message

    for (const key of Object.keys(data)) {
      if (key === "type") continue
      const val = data[key]
      if (typeof val === "string") return `${val}`
      if (Array.isArray(val) && val.length > 0) {
        const first = val[0]
        if (typeof first === "string") return `${first}`
        if (typeof first === "object" && typeof first?.message === "string") return first.message
      }
      if (typeof val === "object" && typeof val?.message === "string") return val.message
    }
  }

  if (typeof err.message === "string") return err.message

  return fallback
}

const isUserObject = (data: any): boolean => {
  return Boolean(
    data &&
      typeof data === "object" &&
      (data.email || data.fullName || data.full_name || data.name || data.id || data._id || data.username)
  )
}

const formatUser = (userData: any): User => {
  return {
    ...userData,
    fullName: userData.full_name || userData.fullName || userData.name || userData.email?.split("@")?.[0] || "User",
  }
}

const toFormData = (payload: Record<string, any> | FormData): FormData => {
  if (payload instanceof FormData) {
    return payload
  }
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value)
    }
  })
  return formData
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  // 1. Verify Active Session via HttpOnly Cookie on page load/refresh
  const refreshToken = async (): Promise<boolean> => {
    try {
      // The Axios interceptor will automatically try /api/v1/cookie/refres/
      // if profile returns 401, so we only need one call here.
      const profileRes = await axiosPublic.get("/api/v1/profile/")
      const profileData = profileRes?.data?.data || profileRes?.data
      if (isUserObject(profileData)) {
        setUser(formatUser(profileData))
        return true
      }
      setUser(null)
      return false
    } catch {
      setUser(null)
      return false
    }
  }

  // 2. Initial Auth Check on page load using HttpOnly Cookie
  useEffect(() => {
    // Clean any old localStorage token remnants if any existed
    try {
      localStorage.removeItem("glowmi_token")
      localStorage.removeItem("token")
      localStorage.removeItem("glowmi_user")
    } catch {
      // ignore
    }

    const initAuth = async () => {
      setLoading(true)
      try {
        await refreshToken()
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // 3. Login function (Cookie set by backend via HttpOnly Set-Cookie header)
  const login = async (credentials: LoginPayload) => {
    setLoading(true)
    setError(null)
    try {
      const formData = toFormData(credentials)
      const userEmail =
        credentials instanceof FormData
          ? (credentials.get("email") as string)
          : credentials.email

      const res = await axiosPublic.post("/api/v1/login/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      // Check user in login response
      let potentialUser =
        res?.data?.user ||
        res?.data?.data ||
        (isUserObject(res?.data) ? res.data : null)

      // If user details not in login response, fetch profile with the new cookie
      if (!isUserObject(potentialUser)) {
        try {
          const profileRes = await axiosPublic.get("/api/v1/profile/")
          potentialUser = profileRes?.data?.data || profileRes?.data
        } catch {
          potentialUser = { email: userEmail }
        }
      }

      setUser(formatUser(potentialUser))
      return res.data
    } catch (err: any) {
      const message = formatErrorMessage(err, "Login failed. Please check your credentials.")
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // 4. Register function (Cookie set by backend via HttpOnly Set-Cookie header)
  const register = async (data: RegisterPayload) => {
    setLoading(true)
    setError(null)
    try {
      const formData = toFormData(data)
      const userEmail =
        data instanceof FormData ? (data.get("email") as string) : data.email
      const userFullName =
        data instanceof FormData ? (data.get("fullName") as string) : data.fullName

      const res = await axiosPublic.post("/api/v1/register/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      let potentialUser =
        res?.data?.user ||
        res?.data?.data ||
        (isUserObject(res?.data) ? res.data : null)

      if (!isUserObject(potentialUser)) {
        try {
          const profileRes = await axiosPublic.get("/api/v1/profile/")
          potentialUser = profileRes?.data?.data || profileRes?.data
        } catch {
          potentialUser = { email: userEmail, fullName: userFullName }
        }
      }

      setUser(formatUser(potentialUser))
      return res.data
    } catch (err: any) {
      const message = formatErrorMessage(err, "Registration failed. Please check your credentials.")
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // 5. Logout function (Cookie cleared by backend via HttpOnly Set-Cookie header)
  const logout = async () => {
    setLoading(true)
    setError(null)
    try {
      try {
        await axiosPublic.post("/api/v1/logout/")
      } catch (err: any) {
        if (err?.response?.status === 405) {
          await axiosPublic.get("/api/v1/logout/")
        }
      }
    } catch (err) {
      console.error("Logout request error:", err)
    } finally {
      setUser(null)
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        refreshToken,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default AuthProvider
