'use server'

import api from '@/services/api'
import { authHeaders, buildParams } from '@/services/helpers'
import { tryAction, handleServiceError } from '@/services/utils'

export interface Consultation {
    id: number
    username: string
    email?: string
    subject: string
    message: string
    answer?: string
    is_answer: boolean
    is_publish: boolean
    created_at: string
    updated_at: string
}

// Publik: Buat konsultasi
export async function createConsultationAction(data: Omit<Consultation, 'id' | 'is_answer' | 'is_publish' | 'created_at' | 'updated_at' | 'answer'>) {
    return tryAction(async () => {
        await api.post('/v1/consultation', data)
        return { message: 'Konsultasi terkirim!' }
    }, 'Gagal mengirim konsultasi')
}

// Admin: Ambil konsultasi (paginated)
export async function getAdminConsultationList(page = 1, limit = 10, search?: string) {
    try {
        const params = buildParams(page, limit, search ? { search } : undefined)
        const res = await api.get(`/v1/admin/consultation?${params}`, { headers: await authHeaders() })
        const docs = res.data.data || []
        return { data: docs, totalPages: res.data.last_page || 1, currentPage: res.data.page || page }
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil konsultasi')) }
}

// Admin: Balas konsultasi (kirim email + simpan ke DB)
export async function replyConsultationAction(id: number, answer: string) {
    return tryAction(async () => {
        await api.post(`/v1/admin/consultation/${id}/reply`, { answer }, { headers: await authHeaders() })
        return { message: 'Balasan berhasil dikirim!' }
    }, 'Gagal mengirim balasan')
}

// Admin: Update konsultasi
export async function updateConsultationAction(id: number, data: Partial<Consultation>) {
    return tryAction(async () => {
        await api.put(`/v1/admin/consultation/${id}`, data, { headers: await authHeaders() })
        return { message: 'Konsultasi diperbarui!' }
    }, 'Gagal memperbarui konsultasi')
}

// Admin: Hapus konsultasi
export async function deleteConsultationAction(id: number) {
    return tryAction(async () => {
        await api.delete(`/v1/admin/consultation/${id}`, { headers: await authHeaders() })
        return { message: 'Konsultasi dihapus!' }
    }, 'Gagal menghapus konsultasi')
}
