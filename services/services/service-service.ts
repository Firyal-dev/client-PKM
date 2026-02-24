"use server"

import api from "@/services/api"
import { authHeaders, buildParams, parseResponse } from "@/services/helpers"
import { tryAction, handleServiceError, SSG_REVALIDATE_TIME, CACHE_TAGS } from "@/services/utils"
import { revalidateTag } from "next/cache"

export interface ServiceFlow {
    id?: number
    title_flow: string
    description_flow?: string
    step_order: number
}

export interface Service {
    id: number
    service_name: string
    icon?: string
    description?: string
    flows?: ServiceFlow[]
    created_at?: string
    updated_at?: string
}

// Admin: Ambil services (paginated)
export async function getAdminServices(page = 1, limit = 10) {
    try {
        const res = await api.get(`/v1/services?${buildParams(page, limit)}`, { headers: await authHeaders() })
        return parseResponse<Service>(res, page)
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil services')) }
}

// Admin: Ambil service by ID (use public endpoint)
export async function getAdminServiceById(id: string): Promise<Service> {
    try {
        const res = await api.get(`/v1/services/${id}`, { headers: await authHeaders() })
        return res.data
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil service')) }
}

// Admin: Buat service
export async function createServiceAction(_: unknown, formData: FormData) {
    const flowsData = formData.get('flows')
    if (flowsData) {
        try {
            const flows = JSON.parse(flowsData as string)
            formData.set('flows', JSON.stringify(flows))
        } catch {
            formData.delete('flows')
        }
    }

    return tryAction(async () => {
        const res = await api.post('/v1/admin/services', formData, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.SERVICES, 'max')
        return res.data
    }, 'Gagal buat service')
}

// Admin: Update service
export async function updateServiceAction(id: string, _: unknown, formData: FormData) {
    const flowsData = formData.get('flows')
    if (flowsData) {
        try {
            const flows = JSON.parse(flowsData as string)
            formData.set('flows', JSON.stringify(flows))
        } catch {
            formData.delete('flows')
        }
    }

    return tryAction(async () => {
        const res = await api.patch(`/v1/admin/services/${id}`, formData, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.SERVICES, 'max')
        return res.data
    }, 'Gagal update service')
}

// Admin: Hapus service
export async function deleteServiceAction(id: string) {
    return tryAction(async () => {
        const res = await api.delete(`/v1/admin/services/${id}`, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.SERVICES, 'max')
        return res.data
    }, 'Gagal hapus service')
}
