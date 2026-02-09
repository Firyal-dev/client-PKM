"use server"

import api from "../api";
import { cookies } from "next/headers";
import { Reviews } from "@/types/review-prop";
import { handleServiceError, tryAction } from "../utils";

const getToken = async () => (await cookies()).get("token")?.value

/**
 * Mendapatkan daftar ulasan (admin)
 */
export const getReviews = async (page: number = 1, limit: number = 10): Promise<{ data: Reviews[], totalPages: number, currentPage: number }> => {
    try {
        const token = await getToken()
        const response = await api.get(`/v1/admin/reviews?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` }
        })

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
        throw new Error(handleServiceError(error, "Gagal mengambil data saran dan kritik"))
    }
}

/**
 * Update status publikasi ulasan
 */
export const updateReviewStatus = async (id: string, is_publish: boolean) => {
    const token = await getToken()

    return tryAction(async () => {
        const res = await api.put(`/v1/admin/reviews/${id}/status`,
            { is_publish },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        return res.data
    }, "Gagal mengubah status ulasan")
}

/**
 * Membuat ulasan
 */
export const createReview = async (data: Reviews) => {
    const token = await getToken()

    return tryAction(async () => {
        const res = await api.post(`/v1/reviews`,
            data,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        return res.data
    }, "Gagal membuat ulasan")
}
