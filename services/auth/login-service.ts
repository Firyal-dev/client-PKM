'use server'

import api from "@/services/api";
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginService(_prevState: any, formData: FormData) {
    const name = formData.get("name");
    const password = formData.get("password");

    if (!name || !password) {
        return { error: "Username dan password wajib diisi" }
    }

    try {
        const res = await api.post("/v1/auth/login", { name, password })
        const cookieStore = await cookies();
        cookieStore.set("token", res.data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax',
            maxAge: 60 * 60 * 8, // 8 jam
            path: '/'
        });

    } catch (error: any) {
        return {
            error: error?.response?.data?.message || "Login gagal"
        }
    }

    redirect('/admin/dashboard');
}