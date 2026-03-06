"use server"

import api from "@/services/api"
import { getBaseUrl, buildParams } from "@/services/helpers"
import {authHeaders, getTenantHeader} from "@/services/server-helpers"
import { tryAction, handleServiceError, SSG_REVALIDATE_TIME, CACHE_TAGS } from "@/services/utils"
import { revalidateTag } from "next/cache"

// Tipe Static Page
export interface StaticPage {
  id: string
  menu_id?: string
  menu?: { id: string; title: string }
  title: string
  static_content: string
  createdAt: string
  updatedAt: string
}

// Publik: Ambil semua halaman statis
export async function getPublicStaticPages(): Promise<StaticPage[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/v1/static-pages`, {
      headers: await getTenantHeader(),
      next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.STATIC_PAGE] }
    })
    if (!res.ok) throw new Error('Gagal ambil halaman statis')
    return await res.json() || []
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil halaman statis')) }
}

// Publik: Ambil halaman statis by ID
export async function getPublicStaticPageById(id: string): Promise<StaticPage> {
  try {
    const res = await fetch(`${getBaseUrl()}/v1/static-pages/${id}`, {
      headers: await getTenantHeader(),
      next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.STATIC_PAGE] }
    })
    if (!res.ok) throw new Error('Gagal ambil halaman statis')
    return await res.json()
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil halaman statis')) }
}

// Publik: Ambil halaman statis by menu ID
export async function getPublicStaticPageByMenuId(menuId: string): Promise<StaticPage> {
  try {
    const res = await fetch(`${getBaseUrl()}/v1/static-pages/menu/${menuId}`, {
      headers: await getTenantHeader(),
      next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.STATIC_PAGE] }
    })
    if (!res.ok) throw new Error('Gagal ambil halaman statis')
    return await res.json()
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil halaman statis')) }
}

// Admin: Ambil semua halaman statis (paginated)
export async function getAdminStaticPages(page = 1, limit = 10) {
  try {
    const res = await api.get(`/v1/admin/static-pages?${buildParams(page, limit)}`, { headers: await authHeaders() })
    const data = res.data
    return {
      data: data.data || [],
      total: data.total || 0,
      page: data.page || page,
      lastPage: data.lastPage || 1,
    }
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil halaman statis')) }
}

// Admin: Ambil halaman statis by ID
export async function getAdminStaticPageById(id: string): Promise<StaticPage> {
  try {
    const res = await api.get(`/v1/admin/static-pages/${id}`, { headers: await authHeaders() })
    return res.data
  } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil halaman statis')) }
}

// Admin: Buat halaman statis
export async function createStaticPageAction(_: unknown, formData: FormData) {
  const photo = formData.get('image') as File

  if (!photo || photo.size === 0) formData.delete('image')

  return tryAction(async () => {
    const res = await api.post('/v1/admin/static-pages', formData, { headers: await authHeaders() })
    revalidateTag(CACHE_TAGS.STATIC_PAGE, 'max')
    return res.data
  }, 'Gagal buat halaman statis')
}

// Admin: Update halaman statis
export async function updateStaticPageAction(id: string, _: unknown, formData: FormData) {
  const photo = formData.get('image') as File

  if (!photo || photo.size === 0) formData.delete('image')

  return tryAction(async () => {
    const res = await api.patch(`/v1/admin/static-pages/${id}`, formData, { headers: await authHeaders() })
    revalidateTag(CACHE_TAGS.STATIC_PAGE, 'max')
    return res.data
  }, 'Gagal update halaman statis')
}

// Admin: Hapus halaman statis
export async function deleteStaticPageAction(id: string) {
  return tryAction(async () => {
    const res = await api.delete(`/v1/admin/static-pages/${id}`, { headers: await authHeaders() })
    revalidateTag(CACHE_TAGS.STATIC_PAGE, 'max')
    return res.data
  }, 'Gagal hapus halaman statis')
}

// Check if menu already has a static page linked
export async function checkMenuStaticPageLink(menuId: string): Promise<{ id: string; title: string; menu_id: string; menu_title: string } | null> {
  try {
    const res = await api.get(`/v1/admin/static-pages/check-menu?menu_id=${menuId}`, { headers: await authHeaders() })
    return res.data
  } catch (e) {
    // If not found or error, return null
    return null
  }
}
