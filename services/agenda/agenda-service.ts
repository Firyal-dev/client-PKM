'use server'

import api from '@/services/api'
import { getBaseUrl, buildParams, parseResponse } from '@/services/helpers'
import { authHeaders, getTenantHeader } from '@/services/server-helpers'
import { tryAction, handleServiceError, SSG_REVALIDATE_TIME, CACHE_TAGS } from '@/services/utils'
import { Agenda } from '@/types/agenda-prop'
import { revalidateTag } from 'next/cache'

// Publik: Ambil agenda (paginated)
export async function getPublicAgenda(page = 1, limit = 10) {
    try {
        const res = await fetch(`${getBaseUrl()}/v1/agenda?${buildParams(page, limit)}`, {
            headers: await getTenantHeader(),
            next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.AGENDA] }
        })
        if (!res.ok) throw new Error('Gagal ambil agenda')
        const data = await res.json()
        return { data: data.docs || [], totalPages: data.totalPages || 1, currentPage: data.page || page }
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil agenda')) }
}

// Publik: Ambil agenda by slug
export async function getPublicAgendaBySlug(slug: string): Promise<Agenda | null> {
    try {
        const res = await fetch(`${getBaseUrl()}/v1/agenda/${slug}`, {
            headers: await getTenantHeader(),
            next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.AGENDA] }
        })
        return res.ok ? await res.json() : null
    } catch { return null }
}

// Admin: Ambil agenda (paginated)
export async function getAdminAgendaList(page = 1, limit = 10) {
    try {
        const res = await api.get(`/v1/admin/agenda?${buildParams(page, limit)}`, { headers: await authHeaders() })
        return parseResponse<Agenda>(res, page)
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil agenda')) }
}

// Admin: Ambil agenda by ID
export async function getAdminAgendaById(id: string): Promise<Agenda> {
    try {
        const res = await api.get(`/v1/admin/agenda/${id}`, { headers: await authHeaders() })
        return res.data
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil agenda')) }
}

// Admin: Buat agenda
export async function createAgendaAction(_: unknown, formData: FormData) {
    const payload = {
        activity_name: formData.get("activity_name"),
        date: formData.get("date"),
        effective_date: formData.get("effective_date"),
        time: formData.get("time"),
        location: formData.get("location"),
    }
    return tryAction(async () => {
        const res = await api.post('/v1/admin/agenda', payload, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.AGENDA, 'max')
        return res.data
    }, 'Gagal buat agenda')
}

// Admin: Update agenda
export async function updateAgendaAction(id: string, _: unknown, formData: FormData) {
    const payload = {
        activity_name: formData.get("activity_name"),
        date: formData.get("date"),
        effective_date: formData.get("effective_date"),
        time: formData.get("time"),
        location: formData.get("location"),
    }
    return tryAction(async () => {
        const res = await api.put(`/v1/admin/agenda/${id}`, payload, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.AGENDA, 'max')
        return { message: 'Agenda berhasil diperbarui!', data: res.data }
    }, 'Gagal update agenda')
}

// Admin: Hapus agenda
export async function deleteAgendaAction(id: string) {
    return tryAction(async () => {
        await api.delete(`/v1/admin/agenda/${id}`, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.AGENDA, 'max')
        return { message: 'Agenda berhasil dihapus!' }
    }, 'Gagal hapus agenda')
}
