"use server"

import api from "@/services/api"
import { authHeaders, parseResponse } from "@/services/helpers"
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

// Admin: Ambil statistik visitor
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
