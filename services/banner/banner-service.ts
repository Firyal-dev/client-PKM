'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import api from "@/services/api"
import { Banner } from "@/types/banner-prop"
import { handleServiceError, tryAction } from "../utils"

const getToken = async () => (await cookies()).get("token")?.value

/**
 * Get all banners for admin
 */
export const getBanners = async (): Promise<Banner[]> => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    try {
        const response = await api.get(`/v1/admin/banner`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    } catch (error) {
        throw new Error(handleServiceError(error, "Gagal mengambil data banner"))
    }
}

/**
 * Get banner detail by ID
 */
export const getBannerDetail = async (id: string): Promise<Banner> => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    try {
        const response = await api.get(`/v1/admin/banner/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    } catch (error) {
        throw new Error(handleServiceError(error, "Gagal mengambil detail banner"))
    }
}

/**
 * Create a new banner
 */
export const createBanner = async (prevState: any, data: FormData) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    const result = await tryAction(async () => {
        await api.post('/v1/admin/banner', data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        revalidatePath('/admin/banners')
    }, "Gagal membuat banner baru")

    if (result.success) {
        redirect('/admin/banners')
    }
    return result
}

/**
 * Update an existing banner
 */
export const updateBanner = async (id: string, prevState: any, data: FormData) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    const result = await tryAction(async () => {
        await api.put(`/v1/admin/banner/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        revalidatePath('/admin/banners')
    }, "Gagal memperbarui banner")

    if (result.success) {
        redirect('/admin/banners')
    }
    return result
}

/**
 * Delete a banner
 */
export const deleteBanner = async (id: string) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    return tryAction(async () => {
        await api.delete(`/v1/admin/banner/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidatePath('/admin/banners')
        return { success: true }
    }, "Gagal menghapus banner")
}

/**
 * Toggle publish status of a banner
 */
export const togglePublishBanner = async (id: string, is_publish: boolean) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    return tryAction(async () => {
        await api.put(`/v1/admin/banner/${id}`, { is_publish }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidatePath('/admin/banners')
        return { success: true }
    }, "Gagal mengubah status publish")
}

/**
 * Get banners for public users
 */
export const getBannersPublic = async (): Promise<Banner[]> => {
    try {
        const response = await api.get(`/v1/banner`)
        return response.data
    } catch (error) {
        throw new Error(handleServiceError(error, "Gagal mengambil data banner"))
    }
}
