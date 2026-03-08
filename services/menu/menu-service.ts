"use server"

import api from "@/services/api"
import { getBaseUrl } from "@/services/helpers"
import { authHeaders, getTenantHeader } from '@/services/server-helpers'
import { tryAction, handleServiceError, SSG_REVALIDATE_TIME, CACHE_TAGS } from "@/services/utils"
import { revalidateTag } from "next/cache"

export interface Menu {
  id: string
  title: string
  slug: string
  type?: 'static' | 'dynamic' | 'custom' | 'grup'
  url_target?: string
  parent?: { id: string; title: string } | null
  parent_id?: string | null
  order: number
  status: number
  children?: Menu[]
  createdAt: string
  updatedAt: string
}

// Publik: Ambil semua menu aktif
export async function getPublicMenus(): Promise<Menu[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/v1/menus`, {
      headers: await getTenantHeader(),
      next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.MENU] }
    })
    if (!res.ok) throw new Error('Gagal ambil menu')
    return await res.json() || []
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil menu')) }
}

// Publik: Ambil menu by slug
export async function getPublicMenuBySlug(slug: string): Promise<Menu> {
  try {
    const res = await fetch(`${getBaseUrl()}/v1/menus/${slug}`, {
      headers: await getTenantHeader(),
      next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.MENU] }
    })
    if (!res.ok) throw new Error('Gagal ambil menu')
    return await res.json()
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil menu')) }
}

// Cek apakah slug sudah ada (untuk validasi form)
export async function checkMenuSlugExists(slug: string, excludeId?: string): Promise<boolean> {
  try {
    const res = await fetch(`${getBaseUrl()}/v1/menus/${slug}`, {
      next: { revalidate: 0 }
    })

    // Jika 404, berarti slug belum ada
    if (res.status === 404) return false

    // Jika berhasil dapat data, cek apakah itu menu yang sama yang sedang di-edit
    if (res.ok) {
      const menu = await res.json() as Menu
      // Jika excludeId diberikan dan sama dengan menu.id, berarti boleh pakai slug ini
      if (excludeId && menu.id === excludeId) return false
      return true
    }

    return false
  } catch {
    return false
  }
}

// Admin: Ambil semua menu dengan pagination dan filter
interface GetAdminMenusParams {
  page?: number
  limit?: number
  search?: string
  type?: string
}

export async function getAdminMenus({ page = 1, limit = 10, search, type }: GetAdminMenusParams = {}): Promise<{ data: Menu[]; total: number; totalPages: number }> {
  try {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    params.set('limit', limit.toString())
    if (search) params.set('search', search)
    if (type) params.set('type', type)

    const headers = await authHeaders()
    console.log('[MenuService] getAdminMenus - Auth headers:', JSON.stringify(headers))

    const res = await api.get(`/v1/admin/menus?${params.toString()}`, { headers })

    console.log('[MenuService] getAdminMenus - Response total:', res.data?.total || res.data?.data?.length || 0)

    // Handle response structure (could be paginated or flat array)
    const menus: Menu[] = res.data?.docs || res.data?.data || res.data || []
    const total = res.data?.total || menus.length
    const totalPages = res.data?.totalPages || Math.ceil(total / limit)

    return { data: menus, total, totalPages }
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil menu')) }
}

// Admin: Ambil semua menu (legacy - tanpa pagination)
export async function getAdminMenusLegacy(): Promise<Menu[]> {
  try {
    const res = await api.get('/v1/admin/menus', { headers: await authHeaders() })
    return res.data || []
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil menu')) }
}

// Admin: Ambil menu berdasarkan tipe
export async function getAdminMenusByType(type: 'static' | 'dynamic' | 'grup'): Promise<Menu[]> {
  try {
    const res = await api.get('/v1/admin/menus', { headers: await authHeaders() })
    const menus: Menu[] = res.data?.docs || res.data?.data || res.data || []
    return menus.filter(menu => menu.type === type)
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil menu')) }
}

// Alias untuk getAdminMenus (backward compat)
export const getAdminMenusFlat = getAdminMenus

// Admin: Ambil menu utama saja (untuk dropdown)
export async function getAdminParentMenus(): Promise<Menu[]> {
  try {
    const res = await api.get('/v1/admin/menus', { headers: await authHeaders() })
    const menus: Menu[] = res.data?.docs || res.data?.data || res.data || []

    return menus.filter(m => !m.parent_id)
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil menu')) }
}

// Admin: Ambil menu by ID
export async function getAdminMenuById(id: string): Promise<Menu> {
  try {
    const res = await api.get(`/v1/admin/menus/${id}`, { headers: await authHeaders() })
    return res.data
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil menu')) }
}

// Admin: Buat menu
export async function createMenuAction(_: unknown, formData: FormData) {
  const parentId = formData.get('parent_id')
  const payload = {
    title: formData.get('title'),
    slug: formData.get('slug') || '',
    type: formData.get('type') || 'custom',
    order: Number(formData.get('order')) || 0,
    status: Number(formData.get('status')) || 1,
    parent_id: ['', '0', '__none__'].includes(String(parentId)) ? null : parentId,
  }
  return tryAction(async () => {
    const res = await api.post('/v1/admin/menus', payload, { headers: await authHeaders() })
    // @ts-expect-error revalidateTag accepts 1-2 args
    revalidateTag(CACHE_TAGS.MENU)
    return res.data
  }, 'Gagal buat menu')
}

// Admin: Update menu
export async function updateMenuAction(id: string, _: unknown, formData: FormData) {
  const parentId = formData.get('parent_id')
  const payload = {
    title: formData.get('title'),
    slug: formData.get('slug') || '',
    type: formData.get('type') || 'custom',
    order: Number(formData.get('order')) || 0,
    status: Number(formData.get('status')) || 1,
    parent_id: ['', '0', '__none__'].includes(String(parentId)) ? null : parentId,
  }

  return tryAction(async () => {
    const res = await api.patch(`/v1/admin/menus/${id}`, payload, {
      headers: await authHeaders()
    })
    // @ts-expect-error revalidateTag accepts 1-2 args
    revalidateTag(CACHE_TAGS.MENU)
    return res.data
  }, 'Gagal update menu')
}

// Admin: Hapus menu
export async function deleteMenuAction(id: string) {
  return tryAction(async () => {
    const res = await api.delete(`/v1/admin/menus/${id}`, { headers: await authHeaders() })
    // @ts-expect-error revalidateTag accepts 1-2 args
    revalidateTag(CACHE_TAGS.MENU)
    return res.data
  }, 'Gagal hapus menu')
}

// Admin: Toggle status
export async function toggleMenuStatusAction(id: string) {
  return tryAction(async () => {
    const res = await api.patch(`/v1/admin/menus/${id}/toggle-status`, {}, {
      headers: await authHeaders()
    })
    // @ts-expect-error revalidateTag with options
    revalidateTag(CACHE_TAGS.MENU)
    return res.data
  }, 'Gagal ubah status')
}