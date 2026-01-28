'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import api from "@/services/api"
import { Album } from "@/types/album-prop"

// --- Helper: Get Token ---
const getToken = async () => {
    const cookieStore = await cookies()
    return cookieStore.get("token")?.value
}

// --- 1. Get All Albums (Pagination) ---
export const getAlbums = async (page: number, limit: number) => {
    try {
        const response = await api.get("/v1/admin/album", {
            params: { page, limit } // Gunakan params axios biar lebih rapi
        })

        // Handle non-paginated response (array)
        if (Array.isArray(response.data)) {
            return {
                data: response.data as Album[],
                totalPages: 1,
                currentPage: 1
            }
        }

        // Handle paginated response
        return {
            data: response.data.docs as Album[],
            totalPages: response.data.totalPages,
            currentPage: response.data.page
        }
    } catch (error: any) {
        console.error("Error fetching albums:", error)
        return { data: [], totalPages: 1, currentPage: 1 } // Return safe default
    }
}

// --- 2. Create Album (Dengan Foto & Deskripsi) ---
interface CreateAlbumPayload {
    title: string
    description?: string
    photoIds: string[]
}

export const createAlbum = async (payload: CreateAlbumPayload) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    try {
        // Endpoint sesuai controller NestJS: @Post('create')
        const response = await api.post("/admin/album/create", {
            album_title: payload.title,      // ✅ Sesuaikan field backend
            description: payload.description,
            photo_ids: payload.photoIds      // ✅ Kirim array ID foto
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })

        revalidatePath('/admin/albums')
        return { success: true, data: response.data }

    } catch (error: any) {
        return {
            success: false,
            error: error?.response?.data?.message || "Gagal membuat album baru"
        }
    }
}

// --- 3. Update Album Name ---
export const updateAlbumName = async (id: string, newTitle: string) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    try {
        await api.put(`/admin/album/${id}`, {
            album_title: newTitle
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })

        revalidatePath('/admin/albums')
        return { success: true }
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Gagal update nama album")
    }
}

// --- 4. Delete Album ---
export const deleteAlbum = async (id: string) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    try {
        await api.delete(`/admin/album/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })

        revalidatePath('/admin/albums')
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Gagal menghapus album")
    }
}