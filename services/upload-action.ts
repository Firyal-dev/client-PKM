'use server'

import { authHeaders } from "@/services/server-helpers"
import { tryAction } from "@/services/utils"

export async function uploadImageAction(formData: FormData) {
  return tryAction(async () => {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api')
      .replace(/\/api\/?$/, '')

    const url = `${baseUrl}/api/v1/admin/upload/editor`
    const headers = await authHeaders()
    // Remove Content-Type so fetch can set it automatically with boundary for FormData
    delete (headers as any)['Content-Type']

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
      cache: 'no-store',
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      throw new Error(errorData?.message || `Upload gagal dengan status: ${res.status}`)
    }

    return res.json()
  }, 'Gagal upload gambar')
}
