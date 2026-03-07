import axios from "axios"
import { toast } from "sonner"

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api",
    withCredentials: true,
})

// Request interceptor: Inject Tenant ID from subdomain routing or cookies
api.interceptors.request.use((config: any) => {
    // 1. First try to get from cookie (set after login)
    let tenantId = getTenantIdFromCookie();

    // 2. If not in cookie, check if there's a global tenant context
    if (!tenantId && typeof window !== 'undefined') {
        tenantId = (window as any).__TENANT_ID__;
    }

    // 3. Inject tenant ID header for backend tenant resolution
    if (tenantId && !config.headers['x-tenant-id']) {
        // Validate UUID format before sending
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(tenantId)) {
            config.headers['x-tenant-id'] = tenantId;
        }
    }

    return config;
})

// Helper to get tenant ID from cookies
function getTenantIdFromCookie(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/tenant_id=([^;]+)/);
    return match ? match[1] : null;
}

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