'use server'

import api from "@/services/api"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { Agenda } from "@/types/agenda-prop"

const getToken = async () => (await cookies()).get("token")?.value

export const getAgendas = async (page: number = 1, limit: number = 10): Promise<{ data: Agenda[], totalPages: number, currentPage: number }> => {
    try {
        const response = await api.get(`/v1/admin/agenda?page=${page}&limit=${limit}`)
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
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Gagal mengambil data agenda")
    }
}

export const createAgenda = async (prevState: any, formData: FormData) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    const activity_name = formData.get("activity_name")
    const date = formData.get("date")
    const time = formData.get("time")
    const location = formData.get("location")
    const effective_date = formData.get("effective_date")

    try {
        await api.post('/v1/admin/agenda', {
            activity_name,
            date,
            time,
            location,
            effective_date
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        revalidatePath('/admin/agenda')
        return { success: true, error: undefined }
    } catch (error: any) {
        return {
            success: false,
            error: error?.response?.data?.message || "Gagal membuat agenda"
        }
    }
}

export const deleteAgenda = async (id: string) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    try {
        await api.delete(`/v1/admin/agenda/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        revalidatePath('/admin/agenda')
        return { success: true }
    } catch (error: any) {
        return { error: error?.response?.data?.message || "Gagal menghapus agenda" }
    }
}
export const getAgendaById = async (id: string): Promise<Agenda> => {
    try {
        const response = await api.get(`/v1/admin/agenda/${id}`)
        return response.data
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Gagal mengambil detail agenda")
    }
}

export const updateAgenda = async (id: string, prevState: any, formData: FormData) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    const activity_name = formData.get("activity_name")
    const date = formData.get("date")
    const time = formData.get("time")
    const location = formData.get("location")
    const effective_date = formData.get("effective_date")

    try {
        await api.put(`/v1/admin/agenda/${id}`, {
            activity_name,
            date,
            time,
            location,
            effective_date
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        revalidatePath('/admin/agenda')
        return { success: true, error: undefined }
    } catch (error: any) {
        return {
            success: false,
            error: error?.response?.data?.message || "Gagal memperbarui agenda"
        }
    }
}
