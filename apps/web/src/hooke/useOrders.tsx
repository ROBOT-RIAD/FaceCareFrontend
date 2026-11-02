import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosPublic } from "@/hooke/useAxiosPublic"
import { useAuth } from "@/hooke/useAuth"
import { formatErrorMessage } from "@/hooke/AuthProvider"

export interface OrderProductJson {
  sku?: string
  size?: string
  image?: string
  title?: string
  [key: string]: any
}

export interface OrderProductItem {
  id: number
  product: number
  product_json_field?: OrderProductJson
  quantity: number
  price: string
  discount_price?: string
  created_at?: string
  updated_at?: string
}

export interface OrderAddressDetails {
  id: number
  user?: number
  address_line1: string
  country: string
  state: string
  city: string
  zip_code: string
  phone_number: string
}

export interface OrderPaymentDetails {
  id?: number
  transaction_id?: string | null
  amount: string
  payment_type: "COD" | "ONLINE" | string
  status: "PAID" | "UNPAID" | string
  paid_at?: string | null
  currency?: string
  created_at?: string
}

export interface OrderRecord {
  id: number
  user_name?: string
  user_email?: string
  total_price: string
  discount_amount?: string
  status: string // e.g. "PENDING", "PROCESSING", "DELIVERED"
  shipping_fee: string
  addressDetails?: OrderAddressDetails
  order_products: OrderProductItem[]
  payment?: OrderPaymentDetails
  created_at: string
  updated_at?: string
}

export interface PaginatedOrdersResponse {
  count: number
  next: string | null
  previous: string | null
  results: OrderRecord[]
}

export interface CreateOrderPayload {
  address_id: number | string
  products: {
    product_id: number | string
    quantity: number
  }[]
  shipping_fee: string
  payment_type: "COD" | "ONLINE"
}

export interface CreateOrderResponse {
  success: boolean
  message: string
  data: {
    id?: number
    url?: string
    checkout_attempt_id?: number
    [key: string]: any
  }
}

export interface PaymentStatusData {
  session_id: string
  stripe_payment_status: string
  checkout_attempt_status: string
  order_id: number
  order_status: string
  payment_status: string
  total_price: string
  currency: string
  webhook_processed: boolean
}

/**
 * 1. API: Fetch paginated orders for logged-in user
 * GET /api/v1/user/orders/?page={page}
 */
export const getUserOrdersApi = async (page = 1): Promise<PaginatedOrdersResponse> => {
  const res = await axiosPublic.get<{
    success: boolean
    message: string
    data: PaginatedOrdersResponse | OrderRecord[]
  }>(`/api/v1/user/orders/?page=${page}`)

  const data = res.data?.data

  if (data && "results" in data && Array.isArray(data.results)) {
    return data as PaginatedOrdersResponse
  }

  if (Array.isArray(data)) {
    return {
      count: data.length,
      next: null,
      previous: null,
      results: data,
    }
  }

  return {
    count: 0,
    next: null,
    previous: null,
    results: [],
  }
}

/**
 * 2. API: Create Order
 * POST /api/v1/user/order/
 */
export const createOrderApi = async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
  const res = await axiosPublic.post<CreateOrderResponse>("/api/v1/user/order/", payload)
  return res.data
}

/**
 * 3. API: Check Stripe payment status
 * GET /api/v1/user/payment-status/?session_id={session_id}
 */
export const getPaymentStatusApi = async (sessionId: string): Promise<PaymentStatusData> => {
  const res = await axiosPublic.get<{
    success: boolean
    message: string
    data: PaymentStatusData
  }>(`/api/v1/user/payment-status/?session_id=${encodeURIComponent(sessionId)}`)
  return res.data?.data
}

/**
 * Hook: Fetch orders list with pagination
 */
export function useOrders(page = 1) {
  const { user } = useAuth()

  const query = useQuery({
    queryKey: ["userOrderHistory", page],
    queryFn: () => getUserOrdersApi(page),
    enabled: Boolean(user),
    staleTime: 1000 * 30, // 30 seconds
    retry: 1,
  })

  const results = query.data?.results || []
  const count = query.data?.count || results.length
  const itemsPerPage = results.length > 0 ? results.length : 10
  const totalPages = Math.max(1, Math.ceil(count / itemsPerPage))

  return {
    ...query,
    orders: results,
    count,
    next: query.data?.next,
    previous: query.data?.previous,
    totalPages,
    currentPage: page,
    errorMessage: query.error ? formatErrorMessage(query.error, "Failed to load orders.") : null,
  }
}

/**
 * Hook: Create Order Mutation
 */
export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createOrderApi,
    onSuccess: () => {
      // Refresh order history and user data count
      queryClient.invalidateQueries({ queryKey: ["userOrderHistory"] })
      queryClient.invalidateQueries({ queryKey: ["userStatistics"] })
    },
  })
}

/**
 * Hook: Query Stripe Payment Status
 */
export function usePaymentStatus(sessionId: string | null) {
  return useQuery({
    queryKey: ["paymentStatus", sessionId],
    queryFn: () => getPaymentStatusApi(sessionId!),
    enabled: Boolean(sessionId),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

export default useOrders
