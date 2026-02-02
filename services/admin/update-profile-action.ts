'use server'

import api from "@/services/api";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const getToken = async () => (await cookies()).get("token")?.value

export async function updateProfileAction(prevState: any, formData: FormData) {
    const token = await getToken()
    if (!token) return { error: "Sesi habis, silakan login lagi" };

    const photo = formData.get("photo") as File;

    if (!photo || photo.size === 0) {
        formData.delete("photo");
    }

    try {
        // ✅ API UPDATE: /v1/admin/profile (PUT)
        const response = await api.put("/v1/admin/profile", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        revalidatePath('/', 'layout');

        return { success: true, message: "Profil berhasil diupdate!" };
    } catch (error: any) {
        return {
            error: error?.response?.data?.message || "Gagal update profile ke server"
        };
    }
}