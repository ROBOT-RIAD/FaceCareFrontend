import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosPublic } from "@/hooke/useAxiosPublic"
import { useAuth } from "@/hooke/useAuth"
import { formatErrorMessage } from "@/hooke/AuthProvider"

export interface UserAddress {
  id: number | string
  user?: number | string
  address_line1: string
  country: string
  state: string
  city: string
  zip_code: string
  phone_number: string
  is_default?: boolean
  created_at?: string
  updated_at?: string
  [key: string]: any
}

export interface CreateAddressInput {
  address_line1: string
  country: string
  state: string
  city: string
  zip_code: string
  phone_number: string
}

export interface AddressResponse {
  success?: boolean
  message?: string
  data?: UserAddress | UserAddress[]
  results?: UserAddress[]
  addresses?: UserAddress[]
  [key: string]: any
}

/**
 * 1. API: Get all addresses for the logged-in user
 * GET /api/v1/user/addresses/list/
 */
export const getAddressesApi = async (): Promise<UserAddress[]> => {
  const res = await axiosPublic.get<AddressResponse | UserAddress[]>("/api/v1/user/addresses/list/")
  
  if (Array.isArray(res.data)) {
    return res.data
  }
  if (res.data && typeof res.data === "object") {
    if (Array.isArray(res.data.data)) {
      return res.data.data
    }
    if (Array.isArray(res.data.results)) {
      return res.data.results
    }
    if (Array.isArray(res.data.addresses)) {
      return res.data.addresses
    }
  }
  return []
}

/**
 * 2. API: Add a new address
 * POST /api/v1/user/addresses/
 * Sends FormData with address_line1, country, state, city, zip_code, phone_number
 */
export const createAddressApi = async (input: CreateAddressInput): Promise<UserAddress> => {
  const formData = new FormData()
  formData.append("address_line1", input.address_line1.trim())
  formData.append("country", input.country.trim())
  formData.append("state", input.state.trim())
  formData.append("city", input.city.trim())
  formData.append("zip_code", input.zip_code.trim())
  formData.append("phone_number", input.phone_number.trim())

  const res = await axiosPublic.post<any>("/api/v1/user/addresses/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  // Return created address object
  if (res.data && typeof res.data === "object") {
    if (res.data.data && typeof res.data.data === "object" && !Array.isArray(res.data.data)) {
      return res.data.data
    }
    return res.data
  }
  return res.data
}

/**
 * 3. API: Delete an address by ID
 * DELETE /api/v1/user/addresses/{id}/
 */
export const deleteAddressApi = async (id: number | string): Promise<any> => {
  const res = await axiosPublic.delete(`/api/v1/user/addresses/${id}/`)
  return res.data
}

/**
 * Custom hook using TanStack Query for user addresses
 */
export function useAddresses() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  // Fetch list of addresses
  const {
    data: addresses = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["userAddresses"],
    queryFn: getAddressesApi,
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  })

  // Create address mutation
  const createMutation = useMutation({
    mutationFn: createAddressApi,
    onSuccess: (newAddress) => {
      // Invalidate and refetch address list
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] })
      // Optimistically or directly update cache if valid object
      if (newAddress && newAddress.id) {
        queryClient.setQueryData<UserAddress[]>(["userAddresses"], (old = []) => {
          const exists = old.some((item) => String(item.id) === String(newAddress.id))
          return exists ? old : [newAddress, ...old]
        })
      }
    },
  })

  // Delete address mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAddressApi,
    onSuccess: (_, deletedId) => {
      // Update cache immediately
      queryClient.setQueryData<UserAddress[]>(["userAddresses"], (old = []) =>
        old.filter((item) => String(item.id) !== String(deletedId))
      )
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] })
    },
  })

  const createAddress = async (data: CreateAddressInput): Promise<UserAddress> => {
    return await createMutation.mutateAsync(data)
  }

  const deleteAddress = async (id: number | string): Promise<any> => {
    return await deleteMutation.mutateAsync(id)
  }

  const errorMessage = error ? formatErrorMessage(error, "Failed to load addresses.") : null
  const createErrorMessage = createMutation.error
    ? formatErrorMessage(createMutation.error, "Failed to create address.")
    : null
  const deleteErrorMessage = deleteMutation.error
    ? formatErrorMessage(deleteMutation.error, "Failed to delete address.")
    : null

  return {
    addresses,
    isLoading: isLoading || (Boolean(user) && isFetching && addresses.length === 0),
    isError,
    error,
    errorMessage,
    createAddress,
    isCreating: createMutation.isPending,
    createError: createErrorMessage,
    deleteAddress,
    isDeleting: deleteMutation.isPending,
    deletingId: deleteMutation.variables as (number | string) | undefined,
    deleteError: deleteErrorMessage,
    refetch,
  }
}

export default useAddresses
