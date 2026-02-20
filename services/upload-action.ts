'use server'

import { authHeaders } from "@/services/helpers"
import { tryAction } from "@/services/utils"

export async function uploadImageAction(formData: FormData) {
  return tryAction(async () => {
    // 1. Tentukan URL Backend Manual
    // Kita bypass instance 'api' (axios) agar tidak terkena interceptor yang merusak header file
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api"
    
    // Pastikan URL bersih (hapus trailing slash atau suffix v1 ganda jika ada)
    const cleanBaseUrl = baseUrl.replace(/\/v1\/?$/, '').replace(/\/api\/?$/, '')
    
    // Susun URL lengkap ke endpoint NestJS kamu
    // Hasil: http://localhost:3002/api/v1/admin/upload/editor
    const url = `${cleanBaseUrl}/api/v1/admin/upload/editor`

    // 2. Siapkan Header
    // Kita ambil token dari helper authHeaders
    const headers: any = await authHeaders()

    // ⚠️ CRITICAL FIX: Hapus header 'Content-Type'
    // Jangan set 'multipart/form-data' secara manual!
    // Biarkan fungsi fetch() yang mendeteksi FormData dan membuat boundary unik secara otomatis.
    delete headers['Content-Type']
    delete headers['content-type']

    // 3. Gunakan Native FETCH
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers, // Sertakan Authorization token
      },
      body: formData, // Kirim FormData mentah
      cache: 'no-store' // Pastikan tidak di-cache oleh Next.js
    })

    // 4. Handle Response
    if (!res.ok) {
      // Coba ambil pesan error dari backend jika ada
      const errorData = await res.json().catch(() => null)
      console.error("❌ Upload Failed:", res.status, errorData)
      throw new Error(errorData?.message || `Upload gagal dengan status: ${res.status}`)
    }

    const data = await res.json()
    
    // Debugging (Opsional, bisa dihapus nanti)
    console.log("✅ Upload Success:", JSON.stringify(data, null, 2))

    return data

  }, 'Gagal upload gambar')
}