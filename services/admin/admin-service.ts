import api from "@/services/api"
import { cookies } from "next/headers"
import { AdminProfileProp } from "@/types/admin-profile-prop"

export async function getAdminProfile(): Promise<AdminProfileProp> {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
        throw new Error("Unauthorized")
    }

    try {
        const response = await api.get("/v1/admin/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        return response.data
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Gagal mengambil data admin")
    }
}