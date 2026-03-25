'use server'

import api from '@/services/api'
import { authHeaders } from '@/services/server-helpers'
import { tryAction } from '@/services/utils'
import { Admin, AdminFormData } from '@/types/admin'
import { revalidateTag } from 'next/cache'
import { parseResponse } from '@/services/helpers'

const CACHE_TAG = 'admin-data'

// Get all admins with pagination
export async function getAdmins(search?: string, role?: string, limit: number = 10, offset: number = 0): Promise<{ data: Admin[], total: number }> {
    try {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (role) params.set('role', role)
        params.set('limit', limit.toString())
        params.set('offset', offset.toString())

        const res = await api.get(`/v1/admin/admins?${params.toString()}`, {
            headers: await authHeaders()
        })

        const parsed = parseResponse<Admin>(res, Math.floor(offset / limit) + 1)
        return {
            data: parsed.data as Admin[],
            total: parsed.total
        }
    } catch (e) {
        console.error('Error fetching admins:', e)
        return { data: [], total: 0 }
    }
}

// Get admin by ID
export async function getAdminById(id: string): Promise<Admin | null> {
    try {
        const res = await api.get(`/v1/admin/admins/${id}`, {
            headers: await authHeaders()
        })
        return res.data
    } catch (e) {
        return null
    }
}

// Get available puskes for operator assignment (puskes with less than 2 operators)
export async function getAvailablePuskesForOperators(): Promise<{ id: string; name: string; operatorCount: number }[]> {
    try {
        const res = await api.get('/v1/admin/available-puskes', {
            headers: await authHeaders()
        })
        return res.data || []
    } catch (e) {
        console.error('Error fetching available puskes:', e)
        return []
    }
}

// Get all active puskes for dropdown
export async function getAllActivePuskes(): Promise<{ id: string; name: string }[]> {
    try {
        const res = await api.get('/v1/puskesmas?limit=1000', {
            headers: await authHeaders()
        })
        const data = res.data?.docs || res.data || []
        // Filter only ACTIVE puskes
        return data
            .filter((p: any) => p.status === 'ACTIVE')
            .map((p: any) => ({ id: p.id, name: p.name }))
    } catch (e) {
        console.error('Error fetching puskes:', e)
        return []
    }
}

// Create admin
export async function createAdmin(formData: FormData) {
    return await tryAction(async () => {
        const name = formData.get('name') as string
        const password = formData.get('password') as string
        const role = formData.get('role') as string || 'OPERATOR'
        const puskesmas_id = formData.get('puskesmas_id') as string || undefined

        await api.post('/v1/admin/admins', { name, password, role, puskesmas_id }, {
            headers: await authHeaders()
        })
        revalidateTag(CACHE_TAG, 'max')
        return { message: 'Admin berhasil dibuat!' }
    }, 'Gagal membuat admin')
}

// Update admin
export async function updateAdmin(id: string, data: AdminFormData) {
    return await tryAction(async () => {
        await api.patch(`/v1/admin/admins/${id}`, data, {
            headers: await authHeaders()
        })
        revalidateTag(CACHE_TAG, 'max')
        return { message: 'Admin berhasil diperbarui!' }
    }, 'Gagal memperbarui admin')
}

// Delete admin
export async function deleteAdmin(id: string) {
    return await tryAction(async () => {
        await api.delete(`/v1/admin/admins/${id}`, {
            headers: await authHeaders()
        })
        revalidateTag(CACHE_TAG, 'max')
        return { message: 'Admin berhasil dihapus!' }
    }, 'Gagal menghapus admin')
}
