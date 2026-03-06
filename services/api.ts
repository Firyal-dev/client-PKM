import { toast } from "sonner"

// API client using fetch
const api = {
    async get<T = any>(url: string, options?: { headers?: Record<string, string> }): Promise<{ data: T }> {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api"
        const response = await fetch(`${baseURL}${url}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        })

        if (!response.ok) {
            const msg = (await response.json())?.message || "Terjadi kesalahan"

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

            throw new Error(msg)
        }

        const data = await response.json() as T
        return { data }
    },

    async post<T = any>(url: string, data?: unknown, options?: { headers?: Record<string, string> }): Promise<{ data: T }> {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api"
        const isFormData = data instanceof FormData

        // Build headers - don't set Content-Type for FormData (browser does it automatically with boundary)
        const headers: Record<string, string> = {}
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
            method: 'POST',
            credentials: 'include',
            headers,
            body: isFormData ? data as FormData : JSON.stringify(data),
        })

        if (!response.ok) {
            const msg = (await response.json())?.message || "Terjadi kesalahan"

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

            throw new Error(msg)
        }

        const result = await response.json() as T
        return { data: result }
    },

    async patch<T = any>(url: string, data?: unknown, options?: { headers?: Record<string, string> }): Promise<{ data: T }> {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api"
        const isFormData = data instanceof FormData

        // Build headers - don't set Content-Type for FormData (browser does it automatically with boundary)
        const headers: Record<string, string> = {}
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
            const msg = (await response.json())?.message || "Terjadi kesalahan"

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

            throw new Error(msg)
        }

        const result = await response.json() as T
        return { data: result }
    },

    async put<T = any>(url: string, data?: unknown, options?: { headers?: Record<string, string> }): Promise<{ data: T }> {
        // Redirect PUT to PATCH for consistency
        return this.patch<T>(url, data, options)
    },

    async delete<T = any>(url: string, options?: { headers?: Record<string, string> }): Promise<{ data: T }> {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api"
        const response = await fetch(`${baseURL}${url}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        })

        if (!response.ok) {
            const msg = (await response.json())?.message || "Terjadi kesalahan"

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

            throw new Error(msg)
        }

        const result = await response.json() as T
        return { data: result }
    },
}

export default api
