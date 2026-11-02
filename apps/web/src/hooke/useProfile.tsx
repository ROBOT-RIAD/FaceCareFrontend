import React, { createContext, useContext } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosPublic } from "@/hooke/useAxiosPublic"
import { formatErrorMessage } from "@/hooke/AuthProvider"

export interface UserProfile {
  id: number
  user: number
  email: string
  role: string
  full_name: string
  image: string | null
  gender: string
  contact_number: string
  skin_type: string
  date_of_birth: string
  created_at: string
  updated_at: string
}

export interface ProfileResponse {
  success: boolean
  message: string
  data: UserProfile
}

export interface UpdateProfileInput {
  full_name?: string
  image?: File | null
  gender?: string
  contact_number?: string
  skin_type?: string
  date_of_birth?: string
}

export interface ProfileContextType {
  profile: UserProfile | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  errorMessage: string | null
  updateProfile: (data: FormData | UpdateProfileInput) => Promise<ProfileResponse>
  isUpdating: boolean
  updateError: string | null
  refetch: () => Promise<any>
}

// 1. Core API calls
export const getProfile = async (): Promise<UserProfile> => {
  const res = await axiosPublic.get<ProfileResponse>("/api/v1/profile/")
  return res.data.data
}

export const updateProfileApi = async (payload: FormData | UpdateProfileInput): Promise<ProfileResponse> => {
  let formData: FormData

  if (payload instanceof FormData) {
    formData = payload
  } else {
    formData = new FormData()
    if (payload.full_name !== undefined) formData.append("full_name", payload.full_name)
    if (payload.image) formData.append("image", payload.image)
    if (payload.gender !== undefined) formData.append("gender", payload.gender)
    if (payload.contact_number !== undefined) formData.append("contact_number", payload.contact_number)
    if (payload.skin_type !== undefined) formData.append("skin_type", payload.skin_type)
    if (payload.date_of_birth !== undefined) formData.append("date_of_birth", payload.date_of_birth)
  }

  const res = await axiosPublic.patch<ProfileResponse>("/api/v1/profile/update/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return res.data
}

import { useAuth } from "@/hooke/useAuth"

// 2. React Context for TanStack Query Profile State
const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

// Custom Hook that works with TanStack Query directly or via Context
export function useProfileQueryHook(): ProfileContextType {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  // Clear cached profile data if user logs out
  React.useEffect(() => {
    if (!user) {
      queryClient.removeQueries({ queryKey: ["userProfile"] })
    }
  }, [user, queryClient])

  const {
    data: profileData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getProfile,
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: 1,
  })

  const profile = user ? profileData : undefined

  const mutation = useMutation({
    mutationFn: updateProfileApi,
    onSuccess: (response) => {
      // Invalidate and refetch user profile
      queryClient.setQueryData(["userProfile"], response.data)
      queryClient.invalidateQueries({ queryKey: ["userProfile"] })
    },
  })

  const updateProfile = async (data: FormData | UpdateProfileInput): Promise<ProfileResponse> => {
    return await mutation.mutateAsync(data)
  }

  const errorMessage = error ? formatErrorMessage(error, "Failed to load profile.") : null
  const updateError = mutation.error ? formatErrorMessage(mutation.error, "Failed to update profile.") : null

  return {
    profile,
    isLoading,
    isError,
    error: error as Error | null,
    errorMessage,
    updateProfile,
    isUpdating: mutation.isPending,
    updateError,
    refetch,
  }
}

// Provider Component
export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const value = useProfileQueryHook()

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}

// Universal hook: if wrapped in ProfileProvider it uses context, otherwise falls back to useProfileQueryHook
export function useProfile(): ProfileContextType {
  const context = useContext(ProfileContext)
  if (context) {
    return context
  }
  return useProfileQueryHook()
}

export default useProfile
