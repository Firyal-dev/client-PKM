'use server'

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api/v1";

export async function updateProfileAction(prevState: any, formData: FormData) {
    // HttpOnly Cookie
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
        return { error: "Sesi habis, silakan login ulang." }
    }

    try {

        const res = await fetch(`${API_URL}/admin/update-profile`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { error: errorData.message || "Gagal mengupdate profil" }
        }

        revalidatePath('/admin')
        return { success: true, message: "Profil berhasil diperbarui!" }

    } catch (error) {
        console.error("Update Profile Error:", error)
        return { error: "Terjadi kesalahan koneksi ke server." }
    }
}