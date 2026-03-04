import axios from "axios"
import { toast } from "sonner"

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api",
    withCredentials: true,
})

// Error handler global
api.interceptors.response.use(
    (res: any) => res,
    async (err: any) => {
        if (typeof window !== 'undefined') {
            const status = err.response?.status;
            const msg = err.response?.data?.message || "Terjadi kesalahan";

            if (status === 401) {
                if (!window.sessionStorage.getItem('loggedOut')) {
                    toast.error("Sesi berakhir karena akun ini login di tempat lain.");
                    window.sessionStorage.setItem('loggedOut', 'true');
                    
                    window.location.href = '/admin/login'; 
                }
            } else {
                toast.error(msg);
            }
        }
        return Promise.reject(err)
    }
)

export default api