'use server'

import api from "@/services/api";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(prevState: any, formData: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { error: "Sesi habis, silakan login lagi" };

    try {
        const response = await api.put("/v1/admin/update-profile", formData, {
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