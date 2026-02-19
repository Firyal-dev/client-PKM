import axios from "axios"
import { toast } from "sonner"

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api",
    withCredentials: true,
})

// Error handler global
api.interceptors.response.use(
    res => res,
    err => {
        if (typeof window !== 'undefined') {
            const msg = err.response?.data?.message || "Terjadi kesalahan"
            toast.error(msg)
        }
        return Promise.reject(err)
    }
)

export default api
