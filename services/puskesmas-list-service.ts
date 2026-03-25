import { handleServiceError, SSG_REVALIDATE_TIME, CACHE_TAGS } from "@/services/utils"
import { getBaseUrl, buildParams } from '@/services/helpers'

export async function getPuskesmasList(page: number, limit: number, search?: string) {
    try {
        const extras: Record<string, string> = {}
        if (search && search.trim()) extras.search = search.trim() // ← tambah .trim() dan cek truthy

        const res = await fetch(`${getBaseUrl()}/v1/public/puskesmas?${buildParams(page, limit, extras)}`, {
            next: {
                revalidate: SSG_REVALIDATE_TIME,
                tags: [CACHE_TAGS.PUSKESMAS_LIST],
            },
        })
        if (!res.ok) throw new Error('Failed to fetch puskesmas list')
        const json = await res.json()
        const payload = json.success && json.data ? json.data : json

        return {
            docs: payload.docs || [],
            totalDocs: payload.totalDocs || 0,
            limit: payload.limit || limit,
            page: payload.page || page,
            totalPages: payload.totalPages || 1
        }
    } catch (e) {
        throw new Error(handleServiceError(e, 'Failed to fetch puskesmas list'))
    }
}