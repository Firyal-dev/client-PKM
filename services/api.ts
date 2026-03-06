import axios from "axios"
import { toast } from "sonner"

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api",
    withCredentials: true,
})

// Request interceptor: Inject Tenant ID for Public & Admin requests
api.interceptors.request.use((config: any) => {
    // Only inject if not already present (to favor manual overrides)
    if (!config.headers['x-tenant-id']) {
        const tenantId = process.env.NEXT_PUBLIC_PUSKESMAS_ID;
        if (tenantId) {
            config.headers['x-tenant-id'] = tenantId;
        }
    }
    return config;
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