import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosPublic } from "@/hooke/useAxiosPublic"
import { useAuth } from "@/hooke/useAuth"
import { formatErrorMessage } from "@/hooke/AuthProvider"

export interface ProductCategory {
  id: number
  name: string
}

export interface RoutineProduct {
  id: number
  sku?: string
  size?: string
  image?: string
  price: string
  discount?: string
  stock?: number
  reserved_stock?: number
  is_available?: boolean
  title: string
  sub_title?: string
  description?: string
  key_ingredients?: string
  key_benefits?: string
  how_to_use?: string
  skin_type?: string
  category?: ProductCategory
  cloudinary_public_id?: string
  created_at?: string
  updated_at?: string
  [key: string]: any
}

export interface RoutineJson {
  morning: string
  morning_products: RoutineProduct[]
  night: string
  night_products: RoutineProduct[]
  precautions: string[]
}

export interface SkinIntelligenceRecord {
  id: number
  skin_intelligence_id?: number
  routine_json: RoutineJson
  is_saved?: boolean
  created_at?: string
  updated_at?: string
}

export interface GenerateRoutineResponse {
  success: boolean
  message: string
  data: SkinIntelligenceRecord
}

export interface SavedRoutinesResponse {
  success: boolean
  message: string
  data: SkinIntelligenceRecord[]
}

/**
 * 1. API: Generate personalized skincare routine
 * POST /api/v1/user/skin-intelligence/
 */
export const generateSkinIntelligenceApi = async (formData: FormData): Promise<GenerateRoutineResponse> => {
  const res = await axiosPublic.post<GenerateRoutineResponse>(
    "/api/v1/user/skin-intelligence/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )
  return res.data
}

/**
 * 2. API: Save routine (Update is_saved status)
 * PATCH /api/v1/user/skin-intelligence/{id}/
 */
export const saveSkinIntelligenceApi = async ({
  id,
  isSaved = true,
}: {
  id: number | string
  isSaved?: boolean
}): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const res = await axiosPublic.patch<{ success: boolean; message: string; data?: any }>(
      `/api/v1/user/skin-intelligence/${id}/`,
      {
        is_saved: isSaved,
      }
    )
    return res.data
  } catch (err: any) {
    if (err?.response?.status === 404) {
      // Plural fallback
      const res = await axiosPublic.patch<{ success: boolean; message: string; data?: any }>(
        `/api/v1/user/skin-intelligences/${id}/`,
        {
          is_saved: isSaved,
        }
      )
      return res.data
    }
    throw err
  }
}

/**
 * 3. API: Fetch user saved routines
 * GET /api/v1/user/skin-intelligences/
 */
export const getSavedSkinRoutinesApi = async (): Promise<SkinIntelligenceRecord[]> => {
  try {
    const res = await axiosPublic.get<any>(
      "/api/v1/user/skin-intelligences/"
    )

    const rawData = res.data
    let list: any[] = []

    if (Array.isArray(rawData?.data)) {
      list = rawData.data
    } else if (Array.isArray(rawData)) {
      list = rawData
    } else if (Array.isArray(rawData?.results)) {
      list = rawData.results
    } else if (Array.isArray(rawData?.data?.results)) {
      list = rawData.data.results
    }

    return list.map((item) => {
      let rJson = item.routine_json
      if (typeof rJson === "string") {
        try {
          rJson = JSON.parse(rJson)
        } catch {
          rJson = {}
        }
      }
      return {
        ...item,
        routine_json: rJson || {},
      }
    })
  } catch (err: any) {
    // If plural fails with 404, fallback to singular
    if (err?.response?.status === 404) {
      const fallbackRes = await axiosPublic.get<any>("/api/v1/user/skin-intelligence/")
      const rawData = fallbackRes.data
      const list = Array.isArray(rawData?.data) ? rawData.data : Array.isArray(rawData) ? rawData : []
      return list.map((item: any) => {
        let rJson = item.routine_json
        if (typeof rJson === "string") {
          try {
            rJson = JSON.parse(rJson)
          } catch {
            rJson = {}
          }
        }
        return {
          ...item,
          routine_json: rJson || {},
        }
      })
    }
    throw err
  }
}

/**
 * Hook: Mutation to generate skin intelligence routine
 */
export function useGenerateRoutine() {
  return useMutation({
    mutationFn: generateSkinIntelligenceApi,
  })
}

/**
 * Hook: Mutation to save a routine ({ is_saved: true })
 */
export function useSaveRoutine() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveSkinIntelligenceApi,
    onSuccess: () => {
      // Invalidate saved routines list and user stats counter
      queryClient.invalidateQueries({ queryKey: ["userSavedRoutines"] })
      queryClient.invalidateQueries({ queryKey: ["userStatistics"] })
    },
  })
}

/**
 * Hook: Query user's saved routines
 */
export function useSavedRoutines() {
  const { user, loading: authLoading } = useAuth()

  const query = useQuery({
    queryKey: ["userSavedRoutines"],
    queryFn: getSavedSkinRoutinesApi,
    enabled: !authLoading && Boolean(user),
    staleTime: 0,
    refetchOnMount: true,
    retry: 1,
  })

  return {
    ...query,
    savedRoutines: query.data || [],
    errorMessage: query.error ? formatErrorMessage(query.error, "Failed to load saved routines.") : null,
  }
}
