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
        const data = await res.json()
        return {
            docs: data.docs || [],
            totalDocs: data.totalDocs || 0,
            limit: data.limit || limit,
            page: data.page || page,
            totalPages: data.totalPages || 1
        }
    } catch (e) {
        throw new Error(handleServiceError(e, 'Failed to fetch puskesmas list'))
    }
}