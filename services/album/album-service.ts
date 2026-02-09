'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import api from "@/services/api"
import { Album } from "@/types/album-prop"
import { handleServiceError, tryAction } from "../utils"

const getToken = async () => (await cookies()).get("token")?.value

/**
 * Get all albums with pagination
 */
export const getAlbums = async (page: number, limit: number): Promise<{ data: Album[], totalPages: number, currentPage: number }> => {
    const token = await getToken();
    if (!token) redirect("/admin/login")

    try {
        const response = await api.get(`/v1/admin/album?page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return {
            data: response.data.docs,
            totalPages: response.data.totalPages,
            currentPage: response.data.page
        }
    } catch (error) {
        throw new Error(handleServiceError(error, "Gagal mengambil data album"))
    }
}

/**
 * Get album detail by ID
 */
export const getAlbumDetail = async (id: string): Promise<Album> => {
    const token = await getToken();
    if (!token) redirect("/admin/login")

    try {
        const response = await api.get(`/v1/admin/album/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw new Error(handleServiceError(error, "Gagal mengambil detail album"))
    }
}

/**
 * Create a new album
 */
export const createAlbum = async (prevState: any, data: FormData) => {
    const token = await getToken();
    if (!token) redirect("/admin/login")

    return tryAction(async () => {
        const payload = {
            album_title: data.get('album_title'),
            description: data.get('description') || "",
            album_cover: null,
            photo_ids: []
        };

        const res = await api.post('/v1/admin/album', payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        revalidatePath('/admin/albums');
        return res.data;
    }, "Gagal membuat album baru")
}

/**
 * Update album name only
 */
export const updateAlbumName = async (id: string, newTitle: string) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    return tryAction(async () => {
        await api.put(`/v1/admin/album/${id}`, {
            album_title: newTitle
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })

        revalidatePath('/admin/albums')
        return { success: true }
    }, "Gagal update nama album")
}

/**
 * Update album details
 */
export const updateAlbum = async (id: string, data: FormData) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    return tryAction(async () => {
        const payload = {
            album_title: data.get('album_title'),
            description: data.get('description')
        };

        await api.put(`/v1/admin/album/${id}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        revalidatePath('/admin/albums');
        return { success: true };
    }, "Gagal update album")
}

/**
 * Delete an album
 */
export const deleteAlbum = async (id: string) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    return tryAction(async () => {
        await api.delete(`/v1/admin/album/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidatePath('/admin/albums')
        return { success: true }
    }, "Gagal menghapus album")
}

/**
 * Add multi photos to an album
 */
export const addPhotosToAlbum = async (albumId: string, photoIds: string[]) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    return tryAction(async () => {
        await api.put('/v1/admin/gallery/album', {
            photo_ids: photoIds,
            album_id: albumId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })

        revalidatePath(`/admin/albums/${albumId}`)
        return { success: true }
    }, "Gagal menambahkan foto ke album")
}
