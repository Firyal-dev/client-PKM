// 'use server'

// import { cookies } from "next/headers"
// import { redirect } from "next/navigation"
// import api from "@/services/api"
// import { Album } from "@/types/album-prop"
// import { revalidatePath } from "next/cache"

// const getToken = async () => (await cookies()).get("token")?.value

// export const getAlbums = async (page: number, limit: number): Promise<{data: Album[], totalPages: number, currentPage: number}> => {
//     try {
//         const response = await api.get(`/v1/admin/album?page=${page}&limit=${limit}`)
//         return {
//             data: response.data.docs,
//             totalPages: response.data.totalPages,
//             currentPage: response.data.page
//         }
//     } catch (error: any) {
//         throw new Error(error?.response?.data?.message || "Gagal mengambil data album")
//     }
// }

// export const createAlbum = async (albumName: string): Promise<Album> => {
//     const token = await getToken()
//     if (!token) redirect("/admin/login")

//     try {
//         const response = await api.post(`/v1/admin/album`, { album_name: albumName }, {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         })
//         revalidatePath('/admin/albums')
//         return response.data
//     } catch (error: any) {
//         throw new Error(error?.response?.data?.message || "Gagal membuat album baru")
//     }
// }

// export const updateAlbumName = async (id: string, albumName: string): Promise<Album> => {
//     const token = await getToken()
//     if (!token) redirect("/admin/login")

//     try {
//         const response = await api.put(`/v1/admin/album/${id}`, { album_name: albumName }, {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         })
//         revalidatePath('/admin/albums')
//         return response.data
//     } catch (error: any) {
//         throw new Error(error?.response?.data?.message || "Gagal mengupdate nama album")
//     }
// }

// export const deleteAlbum = async (id: string): Promise<void> => {
//     const token = await getToken()
//     if (!token) redirect("/admin/login")

//     try {
//         await api.delete(`/v1/admin/album/${id}`, {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         })
//         revalidatePath('/admin/albums')
//     } catch (error: any) {
//         throw new Error(error?.response?.data?.message || "Gagal menghapus album")
//     }
// }