'use server'

import api from "@/services/api"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { Agenda } from "@/types/agenda-prop"
import { handleServiceError, tryAction } from "../utils"

const getToken = async () => (await cookies()).get("token")?.value

/**
 * Fetch list of agendas with pagination
 */
export const getAgendas = async (page: number = 1, limit: number = 10): Promise<{ data: Agenda[], totalPages: number, currentPage: number }> => {
    try {
        const response = await api.get(`/v1/agenda?page=${page}&limit=${limit}`)
        if (response.data.docs) {
            return {
                data: response.data.docs,
                totalPages: response.data.totalPages,
                currentPage: response.data.page
            }
        }
        return {
            data: response.data,
            totalPages: 1,
            currentPage: 1
        }
    } catch (error) {
        throw new Error(handleServiceError(error, "Gagal mengambil data agenda"))
    }
}

/**
 * Create a new agenda
 */
export const createAgenda = async (prevState: any, formData: FormData) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    return tryAction(async () => {
        const payload = {
            activity_name: formData.get("activity_name"),
            date: formData.get("date"),
            time: formData.get("time"),
            location: formData.get("location"),
            effective_date: formData.get("effective_date")
        }

        const res = await api.post('/v1/admin/agenda', payload, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidatePath('/admin/agenda')
        return res.data
    }, "Gagal membuat agenda")
}

/**
 * Delete an agenda
 */
export const deleteAgenda = async (id: string) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    return tryAction(async () => {
        const res = await api.delete(`/v1/admin/agenda/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidatePath('/admin/agenda')
        return res.data
    }, "Gagal menghapus agenda")
}

/**
 * Get agenda details by ID
 */
export const getAgendaById = async (id: string): Promise<Agenda> => {
    try {
        const response = await api.get(`/v1/admin/agenda/${id}`)
        return response.data
    } catch (error) {
        throw new Error(handleServiceError(error, "Gagal mengambil detail agenda"))
    }
}

/**
 * Update an existing agenda
 */
export const updateAgenda = async (id: string, prevState: any, formData: FormData) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    return tryAction(async () => {
        const payload = {
            activity_name: formData.get("activity_name"),
            date: formData.get("date"),
            time: formData.get("time"),
            location: formData.get("location"),
            effective_date: formData.get("effective_date")
        }

        const res = await api.put(`/v1/admin/agenda/${id}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidatePath('/admin/agenda')
        return res.data
    }, "Gagal memperbarui agenda")
}
