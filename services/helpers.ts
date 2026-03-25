// services/helpers.ts

import { getAuthToken } from './auth-token'

export const getBaseUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api'
    if (typeof window === 'undefined') {
        url = url.replace('localhost', '127.0.0.1')
    }
    return url
}

export async function authHeaders() {
    const token = await getAuthToken()
    return {
        Authorization: token ? `Bearer ${token}` : ''
    }
}

export function buildParams(page = 1, limit = 10, extras?: Record<string, string>) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), _v: '2' })
    extras && Object.entries(extras).forEach(([k, v]) => params.append(k, v))
    return params.toString()
}

export function parseResponse<T>(res: any, page = 1) {
    // If the response follows the { success: true, data: ... } pattern, unwrap it first
    const payload = (res.data && typeof res.data === 'object' && 'success' in res.data && 'data' in res.data)
        ? res.data.data
        : res.data;

    const docs = payload?.docs || payload?.data || (Array.isArray(payload) ? payload : []);
    return {
        data: docs,
        totalPages: payload?.totalPages || payload?.lastPage || payload?.last_page || 1,
        currentPage: payload?.page || page,
        total: payload?.total || payload?.totalDocs || docs.length
    }
}