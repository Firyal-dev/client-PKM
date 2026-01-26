import { cookies } from "next/headers"
import { AdminProfileProp } from "@/types/admin-profile-prop"

export async function getAdminProfile(): Promise<AdminProfileProp> {
    const token = (await cookies()).get("token")?.value

    if (!token) {
        throw new Error("Unauthorized")
    }

    const res = await fetch("http://localhost:3030/api/v1/admin/profile", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    })

    if (!res.ok) {
        throw new Error("Failed to fetch admin profile")
    }

    return res.json()
}
