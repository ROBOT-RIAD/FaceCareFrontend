import axios from "axios"

export const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost",
    withCredentials: true,
})

// ---------- Automatic 401 → cookie refresh → retry interceptor ----------
let isRefreshing = false
let failedQueue: Array<{
    resolve: (value?: unknown) => void
    reject: (reason?: any) => void
}> = []

const processQueue = (error: any | null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve()
        }
    })
    failedQueue = []
}

axiosPublic.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Only intercept 401 errors, skip if already retried or if it's the refresh endpoint itself
        if (
            error?.response?.status !== 401 ||
            originalRequest._retry ||
            originalRequest.url?.includes("/cookie/refres") ||
            originalRequest.url?.includes("/login") ||
            originalRequest.url?.includes("/register")
        ) {
            return Promise.reject(error)
        }

        // If another request is already refreshing, queue this one
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject })
            }).then(() => {
                return axiosPublic(originalRequest)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
            await axiosPublic.post("/api/v1/cookie/refres/")
            processQueue(null)
            // Retry the original request with the new cookie
            return axiosPublic(originalRequest)
        } catch (refreshError) {
            processQueue(refreshError)
            return Promise.reject(refreshError)
        } finally {
            isRefreshing = false
        }
    }
)

const useAxiosPublic = () => {
    return axiosPublic
}

export default useAxiosPublic
