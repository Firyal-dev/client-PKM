'use server'

import api from "@/services/api";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { tryAction } from "../utils";

const getToken = async () => (await cookies()).get("token")?.value

/**
 * Update admin profile including optional photo
 */
export async function updateProfileAction(prevState: any, formData: FormData) {
    const token = await getToken()
    if (!token) return { success: false, error: "Sesi habis, silakan login lagi" };

    const photo = formData.get("photo") as File;

    if (!photo || photo.size === 0) {
        formData.delete("photo");
    }

    return tryAction(async () => {
        const response = await api.put("/v1/admin/profile", formData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        revalidatePath('/', 'layout');
        return { message: "Profil berhasil diupdate!" };
    }, "Gagal update profile ke server")
}