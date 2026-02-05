'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import api from "@/services/api"
import { Banner } from "@/types/banner-prop"

const getToken = async () => (await cookies()).get("token")?.value

export const getBanners = async (): Promise<Banner[]> => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    try {
        const response = await api.get(`/v1/admin/banner`, {
            headers: { Authorization: `Bearer ${token}` }
        })

        return response.data
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Gagal mengambil data banner")
    }
}

export const getBannerDetail = async (id: string): Promise<Banner> => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    try {
        const response = await api.get(`/v1/admin/banner/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Gagal mengambil detail banner")
    }
}

export const createBanner = async (prevState: any, data: FormData) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    try {
        await api.post('/v1/admin/banner', data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
    } catch (error: any) {
        return { error: error?.response?.data?.message || "Gagal membuat banner baru" }
    }
    redirect('/admin/banners')
}

export const updateBanner = async (id: string, prevState: any, data: FormData) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    try {
        await api.put(`/v1/admin/banner/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
    } catch (error: any) {
        return { error: error?.response?.data?.message || "Gagal memperbarui banner" }
    }
    redirect('/admin/banners')
}

export const deleteBanner = async (id: string) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    try {
        await api.delete(`/v1/admin/banner/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidatePath('/admin/banners')
        return { success: true }
    } catch (error: any) {
        return { error: error?.response?.data?.message || "Gagal menghapus banner" }
    }
}

export const togglePublishBanner = async (id: string, is_publish: boolean) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    try {
        await api.put(`/v1/admin/banner/${id}`, { is_publish }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidatePath('/admin/banners')
        return { success: true }
    } catch (error: any) {
        return { error: error?.response?.data?.message || "Gagal mengubah status publish" }
    }
}
