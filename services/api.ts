import { toast } from "sonner"

// Helper to get tenant ID from cookies (client-side)
function getTenantIdFromCookie(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/tenant_id=([^;]+)/);
    return match ? match[1] : null;
}

// Helper to get tenant headers
function getTenantHeaders(): Record<string, string> {
    if (typeof window === 'undefined') return {};

    // 1. First try to get from cookie (set after login/tenant switch)
    let tenantId = getTenantIdFromCookie();

    // 2. If not in cookie, check if there's a global tenant context
    if (!tenantId) {
        tenantId = (window as any).__TENANT_ID__;
    }

    // 3. Inject tenant ID header for backend tenant resolution
    if (tenantId) {
        // Validate UUID format before sending
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(tenantId)) {
            return { 'x-tenant-id': tenantId };
        }
    }

    return {};
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
    async get<T = any>(url: string, options?: { headers?: Record<string, string> }): Promise<{ data: T }> {
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

    async post<T = any>(url: string, data?: unknown, options?: { headers?: Record<string, string> }): Promise<{ data: T }> {
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

    async patch<T = any>(url: string, data?: unknown, options?: { headers?: Record<string, string> }): Promise<{ data: T }> {
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

    async put<T = any>(url: string, data?: unknown, options?: { headers?: Record<string, string> }): Promise<{ data: T }> {
        // Redirect PUT to PATCH for consistency
        return this.patch<T>(url, data, options)
    },

    async delete<T = any>(url: string, options?: { headers?: Record<string, string> }): Promise<{ data: T }> {
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