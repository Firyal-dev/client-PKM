// Helper: Ambil base URL
export const getBaseUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api'
    if (typeof window === 'undefined') {
        url = url.replace('localhost', '127.0.0.1')
    }
    return url
}

// Helper: Validasi token dan return header
export async function authHeaders() {
    const { getAuthToken } = await import('@/services/auth-token')
    const token = await getAuthToken()
    if (!token) throw new Error('UNAUTHORIZED')
    return { Authorization: `Bearer ${token}` }
}

// Helper: Build query params
export function buildParams(page = 1, limit = 10, extras?: Record<string, string>) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    extras && Object.entries(extras).forEach(([k, v]) => params.append(k, v))
    return params.toString()
}

// Helper: Parse response paginated
export function parseResponse<T>(res: { data: { docs?: T[]; data?: T[]; totalPages?: number; page?: number } }, page = 1) {
    const docs = res.data.docs || res.data.data || []
    return { data: docs, totalPages: res.data.totalPages || 1, currentPage: res.data.page || page }
}
