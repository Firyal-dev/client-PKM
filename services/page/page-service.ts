"use server"

import api from "@/services/api"
import { getBaseUrl, buildParams, parseResponse } from "@/services/helpers"
import { authHeaders, getTenantHeader } from "@/services/server-helpers"
import { tryAction, handleServiceError, SSG_REVALIDATE_TIME, CACHE_TAGS } from "@/services/utils"
import { revalidateTag } from "next/cache"

// Tipe Page (Dynamic Pages)
export interface Page {
  id: string
  menu_id: string
  menu?: { id: string; title: string }
  title: string
  dynamic_content: string
  content?: string // Alias for dynamic_content used in some components
  image?: string
  file?: string
  type: 'pdf' | 'halaman' | 'kartu'
  status: number
  createdAt: string
  updatedAt: string
}

// Publik: Ambil semua halaman
export async function getPublicPages(): Promise<Page[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/v1/pages`, {
      headers: await getTenantHeader(),
      next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.PAGE] }
    })
    if (!res.ok) throw new Error('Gagal ambil halaman')
    return await res.json() || []
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil halaman')) }
}

// Publik: Ambil halaman by status (published only)
export async function getPublishedPages(): Promise<Page[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/v1/pages?status=1`, {
      headers: await getTenantHeader(),
      next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.PAGE] }
    })
    if (!res.ok) throw new Error('Gagal ambil halaman')
    const data = await res.json()
    return data.docs || data.data || []
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil halaman')) }
}

// Publik: Ambil halaman by menu ID (satu halaman)
export async function getPublicPageByMenuId(menuId: string): Promise<Page> {
  try {
    const res = await fetch(`${getBaseUrl()}/v1/pages/menu/${menuId}`, {
      headers: await getTenantHeader(),
      next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.PAGE] }
    })
    if (!res.ok) throw new Error('Gagal ambil halaman')
    return await res.json()
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil halaman')) }
}

// Publik: Ambil halaman aktif by menu ID dengan pagination
export async function getPublicPagesByMenuId(menuId: string, page = 1, limit = 10): Promise<{ data: Page[]; lastPage: number; total: number }> {
  try {
    const res = await fetch(`${getBaseUrl()}/v1/pages/menu/${menuId}/all?${buildParams(page, limit)}`, {
      headers: await getTenantHeader(),
      next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.PAGE] }
    })
    if (!res.ok) throw new Error('Gagal ambil halaman')
    return await res.json()
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil halaman')) }
}

// Publik: Ambil halaman by ID
export async function getPublicPageById(id: string): Promise<Page> {
  try {
    const res = await fetch(`${getBaseUrl()}/v1/pages/${id}`, {
      headers: await getTenantHeader(),
      next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.PAGE] }
    })
    if (!res.ok) throw new Error('Gagal ambil halaman')
    return await res.json()
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil halaman')) }
}

// Publik: Ambil halaman pelayanan
export async function getPublicPelayanan(): Promise<Page[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/v1/pages/pelayanan`, {
      headers: await getTenantHeader(),
      next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.PAGE] }
    })
    if (!res.ok) throw new Error(`Gagal ambil data pelayanan: ${res.status}`)
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil data pelayanan')) }
}

// Publik: Ambil halaman berita
export async function getPublicBerita(page?: number, limit?: number): Promise<Page[]> {
  try {
    const params = new URLSearchParams()
    if (page !== undefined) params.set('page', String(page))
    if (limit !== undefined) params.set('limit', String(limit))
    const query = params.toString() ? `?${params.toString()}` : ''
    const res = await fetch(`${getBaseUrl()}/v1/pages/berita${query}`, {
      headers: await getTenantHeader(),
      next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.PAGE] }
    })
    if (!res.ok) throw new Error(`Gagal ambil data berita: ${res.status}`)
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil data berita')) }
}

// Admin: Ambil semua halaman (paginated)
export async function getAdminPages(page = 1, limit = 10) {
  try {
    const res = await api.get(`/v1/admin/pages?${buildParams(page, limit)}`, { headers: await authHeaders() })
    return parseResponse<Page>(res, page)
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil halaman')) }
}

// Admin: Ambil halaman by ID
export async function getAdminPageById(id: string): Promise<Page> {
  try {
    const res = await api.get(`/v1/admin/pages/${id}`, { headers: await authHeaders() })
    return res.data
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil halaman')) }
}

// Admin: Buat halaman
export async function createPageAction(_: unknown, formData: FormData) {
  const photo = formData.get('image') as File
  const doc = formData.get('file') as File

  if (!photo || photo.size === 0) formData.delete('image')
  if (!doc || doc.size === 0) formData.delete('file')

  return tryAction(async () => {
    const res = await api.post('/v1/admin/pages', formData, { headers: await authHeaders() })
    revalidateTag(CACHE_TAGS.PAGE, 'max')
    return res.data
  }, 'Gagal buat halaman')
}

// Admin: Update halaman
export async function updatePageAction(id: string, _: unknown, formData: FormData) {
  const photo = formData.get('image') as File
  const doc = formData.get('file') as File

  if (!photo || photo.size === 0) formData.delete('image')
  if (!doc || doc.size === 0) formData.delete('file')

  return tryAction(async () => {
    const res = await api.patch(`/v1/admin/pages/${id}`, formData, { headers: await authHeaders() })
    revalidateTag(CACHE_TAGS.PAGE, 'max')
    return res.data
  }, 'Gagal update halaman')
}

// Admin: Hapus halaman
export async function deletePageAction(id: string) {
  return tryAction(async () => {
    const res = await api.delete(`/v1/admin/pages/${id}`, { headers: await authHeaders() })
    revalidateTag(CACHE_TAGS.PAGE, 'max')
    return res.data
  }, 'Gagal hapus halaman')
}

// Admin: Toggle status
export async function togglePageStatusAction(id: string) {
  return tryAction(async () => {
    const res = await api.patch(`/v1/admin/pages/${id}/toggle-status`, {}, { headers: await authHeaders() })
    revalidateTag(CACHE_TAGS.PAGE, 'max')
    return res.data
  }, 'Gagal ubah status')
}

// Check if menu already has any pages linked, return all info with types
export async function checkMenuPageLink(menuId: string): Promise<{
  hasPages: boolean;
  pageCount: number;
  existingType: string;
  pages: { id: string; title: string; type: string }[];
  menu_id: string;
  menu_title: string;
} | null> {
  try {
    const res = await api.get(`/v1/admin/pages/check-menu?menu_id=${menuId}`, { headers: await authHeaders() })
    return res.data
  } catch (e) {
    // If not found or error, return null
    return null
  }
}
