"use server"

import api from "@/services/api"
import { authHeaders, getBaseUrl } from "@/services/helpers"
import { tryAction, handleServiceError, SSG_REVALIDATE_TIME, CACHE_TAGS } from "@/services/utils"
import { revalidateTag } from "next/cache"

// Tipe Menu
export interface Menu {
  id: string
  title: string
  slug: string
  parent_id: string | null
  order: number
  status: number
  children?: Menu[]
  created_at: string
  updated_at: string
}

// Publik: Ambil semua menu aktif
export async function getPublicMenus(): Promise<Menu[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/v1/menus`, {
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
      next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.MENU] }
    })
    if (!res.ok) throw new Error('Gagal ambil menu')
    return await res.json()
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil menu')) }
}

// Admin: Ambil semua menu
export async function getAdminMenus(): Promise<Menu[]> {
  try {
    const res = await api.get('/v1/admin/menus', { headers: await authHeaders() })
    return res.data || []
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil menu')) }
}

// Admin: Menu flat (dropdown)
export async function getAdminMenusFlat(): Promise<Menu[]> {
  try {
    const res = await api.get('/v1/admin/menus/flat', { headers: await authHeaders() })
    return res.data || []
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil menu')) }
}

// Admin: Menu utama saja (dropdown)
export async function getAdminParentMenus(): Promise<Menu[]> {
  try {
    const res = await api.get('/v1/admin/menus', { headers: await authHeaders() })
    const menus: Menu[] = res.data?.docs || res.data?.data || res.data || []
    // Filter only parent menus (no parent_id)
    return menus.filter(menu => !menu.parent_id)
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
    url_target: formData.get('url_target') || '/',
    order: Number(formData.get('order')) || 0,
    parent_id: ['', '0', '__none__'].includes(String(parentId)) ? null : parentId,
  }
  return tryAction(async () => {
    const res = await api.post('/v1/admin/menus', payload, { headers: await authHeaders() })
    revalidateTag(CACHE_TAGS.MENU, 'max')
    return res.data
  }, 'Gagal buat menu')
}

// Admin: Update menu
export async function updateMenuAction(id: string, _: unknown, formData: FormData) {
  const parentId = formData.get('parent_id')
  const payload = {
    title: formData.get('title'),
    url_target: formData.get('url_target') || '/',
    order: Number(formData.get('order')) || 0,
    parent_id: ['', '0', '__none__'].includes(String(parentId)) ? null : parentId,
  }
  return tryAction(async () => {
    const res = await api.put(`/v1/admin/menus/${id}`, payload, { headers: await authHeaders() })
    revalidateTag(CACHE_TAGS.MENU, 'max')
    return res.data
  }, 'Gagal update menu')
}

// Admin: Hapus menu
export async function deleteMenuAction(id: string) {
  return tryAction(async () => {
    const res = await api.delete(`/v1/admin/menus/${id}`, { headers: await authHeaders() })
    revalidateTag(CACHE_TAGS.MENU, 'max')
    return res.data
  }, 'Gagal hapus menu')
}

// Admin: Toggle status
export async function toggleMenuStatusAction(id: string) {
  return tryAction(async () => {
    const res = await api.put(`/v1/admin/menus/${id}/toggle-status`, {}, { headers: await authHeaders() })
    revalidateTag(CACHE_TAGS.MENU, 'max')
    return res.data
  }, 'Gagal ubah status')
}
