import { toast } from "sonner"

// Helper to get tenant ID from cookies (client-side)
function getTenantIdFromCookie(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/tenant_id=([^;]+)/);
    return match ? match[1] : null;
}

// Helper to get tenant slug from hostname (for public visitors)
function getTenantSlugFromHostname(): string | null {
    if (typeof window === 'undefined') return null;

    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';
    const fullHost = port ? `${hostname}${port}` : hostname;

    // Skip localhost without subdomain
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('127.0.0.1')) {
        return null;
    }

    // Extract subdomain from patterns like: pkm-bogor-tengah.localhost
    const parts = hostname.split('.');
    if (parts.length >= 2 && (parts[parts.length - 1] === 'localhost' || parts[parts.length - 1] === 'local')) {
        const subdomain = parts[0];
        if (subdomain && !['www', 'api', 'admin'].includes(subdomain)) {
            return subdomain;
        }
    }

    // For production: subdomain.domain.com
    if (parts.length > 2) {
        const subdomain = parts[0];
        if (subdomain && !['www', 'api', 'admin'].includes(subdomain)) {
            return subdomain;
        }
    }

    return null;
}

// Helper to get tenant headers
function getTenantHeaders(): Record<string, string> {
    // Try server-side tenant header first (set by proxy middleware)
    // Note: This only works for server-side requests, not client-side fetch

    let tenantId: string | null = null;
    let tenantSlug: string | null = null;

    // 1. First try to get from cookie (set after login/tenant switch)
    tenantId = getTenantIdFromCookie();

    // 2. If not in cookie, check if there's a global tenant context
    if (!tenantId && typeof window !== 'undefined') {
        tenantId = (window as any).__TENANT_ID__;
    }

    // 3. For public visitors (not logged in), extract from hostname
    if (!tenantId) {
        tenantSlug = getTenantSlugFromHostname();
    }

    // 4. Inject tenant ID header for backend tenant resolution
    if (tenantId) {
        // Validate UUID format before sending
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(tenantId)) {
            return { 'x-tenant-id': tenantId };
        }
    }

    // 5. Use slug for public visitors
    if (tenantSlug) {
        return { 'x-tenant-slug': tenantSlug };
    }

    return {};
}

// Clear authentication cookies before redirect to prevent loop
function clearTokensClientSide() {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'tenant_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

// Error handler for API responses
async function handleApiError(response: Response): Promise<string> {
    let msg = "Terjadi kesalahan";

    try {
        // Get response body as text first
        const bodyText = await response.text();

        // Check if body is empty or null - use trimmed comparison for robustness
        const trimmedBody = bodyText?.trim();
        if (!bodyText || trimmedBody === 'null' || trimmedBody === '') {
            msg = response.statusText || `HTTP Error: ${response.status}`;
        } else {
            // Try to parse as JSON
            try {
                const json = JSON.parse(bodyText);

                // Check for tenant status errors - check json.error (from ForbiddenException)
                const errorCode = json?.error;
                const errorMessage = json?.message;

                if (errorCode === 'TENANT_SUSPENDED') {
                    // Redirect to suspended page
                    if (typeof window !== 'undefined') {
                        const params = new URLSearchParams({
                            tenant: json.tenantName || '',
                            reason: json.reason || ''
                        });
                        window.location.href = `/suspended?${params.toString()}`;
                    }
                    return json.message || 'Puskesmas ditangguhkan';
                }

                if (errorCode === 'TENANT_INACTIVE') {
                    msg = json.message || 'Puskesmas tidak aktif';
                    if (typeof window !== 'undefined') {
                        toast.error(msg); // Red toast for inactive
                    }
                    return msg;
                }

                if (errorCode === 'TENANT_MAINTENANCE') {
                    msg = json.message || 'Website dalam perbaikan';
                    if (typeof window !== 'undefined') {
                        toast.info(msg); // Blue toast for maintenance - will be redirected anyway
                    }
                    return msg;
                }

                msg = json?.message || msg;
            } catch {
                // If not valid JSON, use the text as message
                msg = bodyText || msg;
            }
        }
    } catch (e) {
        // If we can't read the body at all
        msg = `HTTP Error: ${response.status}`;
    }

    if (typeof window !== 'undefined') {
        if (response.status === 401) {
            if (!window.sessionStorage.getItem('loggedOut')) {
                // ✅ FIX: Clear tokens before redirect to prevent loop
                clearTokensClientSide();

                toast.error("Sesi berakhir karena akun ini login di tempat lain.")
                window.sessionStorage.setItem('loggedOut', 'true')
                window.location.href = '/admin/login'
            }
        } else {
            toast.error(msg)
        }
    }

    return msg
}

// API client using fetch
const api = {
    async get<T = any>(url: string, options?: { headers?: Record<string, string>, next?: NextFetchRequestConfig }): Promise<{ data: T }> {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api"

        // Merge tenant headers with custom headers
        const tenantHeaders = getTenantHeaders()
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...tenantHeaders,
            ...options?.headers,
        }

        const response = await fetch(`${baseURL}${url}`, {
            method: 'GET',
            credentials: 'include',
            headers,
            next: options?.next,
        })

        if (!response.ok) {
            const errorMsg = await handleApiError(response)
            throw new Error(errorMsg)
        }

        // Handle empty response
        const text = await response.text()
        if (!text || text === 'null' || text.trim() === 'null' || text === '') {
            return { data: null as unknown as T }
        }

        const data = JSON.parse(text) as T
        return { data }
    },

    async post<T = any>(url: string, data?: unknown, options?: { headers?: Record<string, string>, next?: NextFetchRequestConfig }): Promise<{ data: T }> {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api"
        const isFormData = data instanceof FormData

        // Merge tenant headers with custom headers
        const tenantHeaders = getTenantHeaders()

        // Build headers - don't set Content-Type for FormData (browser does it automatically with boundary)
        const headers: Record<string, string> = {
            ...tenantHeaders,
        }
        if (!isFormData) {
            headers['Content-Type'] = 'application/json'
        }
        // Add custom headers (like Authorization), but exclude any Content-Type if present
        if (options?.headers) {
            Object.entries(options.headers).forEach(([key, value]) => {
                if (key.toLowerCase() !== 'content-type') {
                    headers[key] = value
                }
            })
        }

        // Handle null/undefined data - don't send as JSON string "null", send empty body instead
        let body: string | FormData | undefined;
        if (data !== null && data !== undefined) {
            body = isFormData ? data as FormData : JSON.stringify(data);
        }
        // If data is null or undefined, don't set body (will be sent as empty)

        const response = await fetch(`${baseURL}${url}`, {
            method: 'POST',
            credentials: 'include',
            headers,
            body,
            next: options?.next,
        })

        if (!response.ok) {
            const errorMsg = await handleApiError(response)
            throw new Error(errorMsg)
        }

        // Handle empty or null response
        const text = await response.text()

        // More robust null/empty check
        if (!text || text === 'null' || text.trim() === 'null' || text === '') {
            return { data: null as unknown as T }
        }

        const result = JSON.parse(text) as T
        return { data: result }
    },

    async patch<T = any>(url: string, data?: unknown, options?: { headers?: Record<string, string>, next?: NextFetchRequestConfig }): Promise<{ data: T }> {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api"
        const isFormData = data instanceof FormData

        // Merge tenant headers with custom headers
        const tenantHeaders = getTenantHeaders()

        // Build headers - don't set Content-Type for FormData (browser does it automatically with boundary)
        const headers: Record<string, string> = {
            ...tenantHeaders,
        }
        if (!isFormData) {
            headers['Content-Type'] = 'application/json'
        }
        // Add custom headers (like Authorization), but exclude any Content-Type if present
        if (options?.headers) {
            Object.entries(options.headers).forEach(([key, value]) => {
                if (key.toLowerCase() !== 'content-type') {
                    headers[key] = value
                }
            })
        }

        const response = await fetch(`${baseURL}${url}`, {
            method: 'PATCH',
            credentials: 'include',
            headers,
            body: isFormData ? data as FormData : JSON.stringify(data),
            next: options?.next,
        })

        if (!response.ok) {
            const errorMsg = await handleApiError(response)
            throw new Error(errorMsg)
        }

        // Handle empty response
        const patchText = await response.text()
        if (!patchText || patchText === 'null' || patchText.trim() === 'null' || patchText === '') {
            return { data: null as unknown as T }
        }

        const result = JSON.parse(patchText) as T
        return { data: result }
    },

    async put<T = any>(url: string, data?: unknown, options?: { headers?: Record<string, string>, next?: NextFetchRequestConfig }): Promise<{ data: T }> {
        // Redirect PUT to PATCH for consistency
        return this.patch<T>(url, data, options)
    },

    async delete<T = any>(url: string, options?: { headers?: Record<string, string>, next?: NextFetchRequestConfig }): Promise<{ data: T }> {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api"

        // Merge tenant headers with custom headers
        const tenantHeaders = getTenantHeaders()
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...tenantHeaders,
            ...options?.headers,
        }

        const response = await fetch(`${baseURL}${url}`, {
            method: 'DELETE',
            credentials: 'include',
            headers,
            next: options?.next,
        })

        if (!response.ok) {
            const errorMsg = await handleApiError(response)
            throw new Error(errorMsg)
        }

        // Handle empty response
        const deleteText = await response.text()
        if (!deleteText || deleteText === 'null' || deleteText.trim() === 'null' || deleteText === '') {
            return { data: null as unknown as T }
        }

        const result = JSON.parse(deleteText) as T
        return { data: result }
    },
}

export default api