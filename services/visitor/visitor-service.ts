"use server"

import api from "@/services/api"
import { getBaseUrl, parseResponse} from "@/services/helpers"
import { authHeaders, getTenantHeader } from "@/services/server-helpers"
import { handleServiceError } from "@/services/utils"

export interface Visitor {
    id: number
    ip_address: string
    user_agent: string
    visit_date: string
    path?: string
    created_at?: string
}

export interface VisitorStats {
    total: number
    today: number
    thisMonth: number
    thisYear: number
}

// Admin: Ambil semua visitor
export async function getAdminVisitors(): Promise<Visitor[]> {
    try {
        const res = await api.get('/v1/visitor', { headers: await authHeaders() })
        return res.data
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil visitor')) }
}

// Admin: Ambil statistik visitor (Authenticated)
export async function getVisitorStats(): Promise<VisitorStats> {
    try {
        const [total, today, thisMonth, thisYear] = await Promise.all([
            api.get('/v1/visitor/count', { headers: await authHeaders() }),
            api.get('/v1/visitor/count-day', { headers: await authHeaders() }),
            api.get('/v1/visitor/count-month', { headers: await authHeaders() }),
            api.get('/v1/visitor/count-year', { headers: await authHeaders() }),
        ])

        return {
            total: total.data,
            today: today.data,
            thisMonth: thisMonth.data,
            thisYear: thisYear.data,
        }
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil statistik visitor')) }
}

// Public: Ambil statistik visitor (Unauthenticated untuk Footer)
export async function getPublicVisitorStats(): Promise<VisitorStats> {
    try {
        const url = getBaseUrl()

        const headers = await getTenantHeader()

        const [total, today, thisMonth, thisYear] = await Promise.all([
            fetch(`${url}/v1/visitor/count`, { headers, next: { revalidate: 300 } }).then(r => r.json()),
            fetch(`${url}/v1/visitor/count-day`, { headers, next: { revalidate: 300 } }).then(r => r.json()),
            fetch(`${url}/v1/visitor/count-month`, { headers, next: { revalidate: 300 } }).then(r => r.json()),
            fetch(`${url}/v1/visitor/count-year`, { headers, next: { revalidate: 300 } }).then(r => r.json()),
        ])

        return {
            total: total || 0,
            today: today || 0,
            thisMonth: thisMonth || 0,
            thisYear: thisYear || 0,
        }
    } catch {
        // Silent fail - visitor stats is non-critical
        return { total: 0, today: 0, thisMonth: 0, thisYear: 0 }
    }
}
