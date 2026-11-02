import { useQuery } from "@tanstack/react-query"
import { axiosPublic } from "@/hooke/useAxiosPublic"
import { useAuth } from "@/hooke/useAuth"

export interface UserStatistics {
  skin_intelligence_count: number
  order_count: number
  [key: string]: any
}

export interface UserDataResponse {
  success: boolean
  message: string
  data: UserStatistics
}

/**
 * API call to get user statistics:
 * GET /api/v1/userdata/
 */
export const getUserStatisticsApi = async (): Promise<UserStatistics> => {
  const res = await axiosPublic.get<UserDataResponse>("/api/v1/userdata/")
  if (res.data && res.data.data) {
    return res.data.data
  }
  return (res.data as unknown as UserStatistics) || { skin_intelligence_count: 0, order_count: 0 }
}

/**
 * TanStack Query Hook for fetching user statistics
 */
export function useUserData() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ["userStatistics"],
    queryFn: getUserStatisticsApi,
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 3, // 3 minutes cache
    retry: 1,
  })
}

export default useUserData
