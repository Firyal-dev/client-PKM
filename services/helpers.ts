// services/helpers.ts

export const getBaseUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api'
    if (typeof window === 'undefined') {
        url = url.replace('localhost', '127.0.0.1')
    }
    return url
}

export function buildParams(page = 1, limit = 10, extras?: Record<string, string>) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    extras && Object.entries(extras).forEach(([k, v]) => params.append(k, v))
    return params.toString()
}

export function parseResponse<T>(res: any, page = 1) {
    const docs = res.data?.docs || res.data?.data || []
    return {
        data: docs,
        totalPages: res.data?.totalPages || res.data?.lastPage || 1,
        currentPage: res.data?.page || page,
        total: res.data?.total || res.data?.totalDocs || docs.length
    }
}