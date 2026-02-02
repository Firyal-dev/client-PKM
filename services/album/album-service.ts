'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import api from "@/services/api"
import { Album } from "@/types/album-prop"

const getToken = async () => (await cookies()).get("token")?.value

export const getAlbums = async (page: number, limit: number): Promise<{ data: Album[], totalPages: number, currentPage: number }> => {
    try {
        const response = await api.get(`/v1/admin/album?page=${page}&limit=${limit}`)

        return {
            data: response.data.docs,
            totalPages: response.data.totalPages,
            currentPage: response.data.page
        }
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Gagal mengambil data album")
    }
}

export const getAlbumDetail = async (id: string): Promise<Album> => {
    try {
        const response = await api.get(`/v1/admin/album/${id}`)
        return response.data
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Gagal mengambil detail album")
    }
}

export const createAlbum = async (prevState: any, data: FormData) => {
    const token = await getToken();

    const payload = {
        album_title: data.get('album_title'),
        description: data.get('description'),
        album_cover: null,
        photo_ids: []
    };

    try {
        const response = await api.post('/v1/admin/album', payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        revalidatePath('/admin/albums');
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Gagal membuat album baru")
    }

    redirect('/admin/albums')
}

export const updateAlbumName = async (id: string, newTitle: string) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    try {
        await api.put(`/v1/admin/album/${id}`, {
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

export const updateAlbum = async (id: string, data: FormData) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    const payload = {
        album_title: data.get('album_title'),
        description: data.get('description')
    };

    try {
        await api.put(`/v1/admin/album/${id}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        revalidatePath('/admin/albums');
        return { success: true };
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Gagal update album");
    }
}

export const deleteAlbum = async (id: string) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    try {
        await api.delete(`/v1/admin/album/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })

        revalidatePath('/admin/albums')
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Gagal menghapus album")
    }
}

export const addPhotosToAlbum = async (albumId: string, photoIds: string[]) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    try {
        await api.put('/v1/admin/gallery/album', {
            photo_ids: photoIds,
            album_id: albumId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })

        revalidatePath(`/admin/albums/${albumId}`)
        return { success: true }
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Gagal menambahkan foto ke album")
    }
}