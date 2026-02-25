"use client"

import { useState, useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Page } from "@/services/page/page-service"
import { Menu } from "@/services/menu/menu-service"
import dynamic from 'next/dynamic'
import Image from "next/image"
import { getMediaUrl } from "@/lib/getMediaUrl"

const RichEditor = dynamic(() => import('@/components/admin/rich-editor'), { ssr: false })

interface PageFormProps {
  action: (state: any, formData: FormData) => Promise<any>
  initialData?: Page
  menus: Menu[]
}

export function PageForm({ action, initialData, menus }: PageFormProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(action, null)

  const [pageType, setPageType] = useState<'halaman' | 'pdf' | 'kartu'>(initialData?.type || 'halaman')
  const [showImageField, setShowImageField] = useState(!!initialData?.image)

  useEffect(() => {
    if (state?.success) {
      toast.success(initialData ? "Halaman diperbarui!" : "Halaman dibuat!")
      router.push("/admin/dynamic-pages")
      router.refresh()
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state, initialData, router])

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="menu_id">Menu</Label>
          <Select name="menu_id" defaultValue={initialData?.menu_id || undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih menu..." />
            </SelectTrigger>
            <SelectContent>
              {menus.map((menu) => (
                <SelectItem key={menu.id} value={menu.id}>
                  {menu.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="menu_id_input" id="menu_id_input" defaultValue={initialData?.menu_id} />
        </div>

        <div className="grid gap-2">
          <Label>Tipe Halaman</Label>
          <Select
            value={pageType}
            onValueChange={(val) => setPageType(val as 'halaman' | 'pdf' | 'kartu')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="halaman">Halaman</SelectItem>
              <SelectItem value="kartu">Kartu (Berita / Artikel)</SelectItem>
              <SelectItem value="pdf">Dokumen PDF</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" name="type" id="type_input" value={pageType} readOnly />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="title">Judul</Label>
          <Input
            id="title"
            name="title"
            placeholder="Masukkan judul halaman"
            defaultValue={initialData?.title}
            required
          />
        </div>

        {(pageType === 'halaman' || pageType === 'kartu') && (
          <>
            <div className="grid gap-2">
              <Label>Foto Utama / Thumbnail</Label>
              <div className="flex items-center gap-2">
                <Switch checked={showImageField} onCheckedChange={setShowImageField} />
                <span className="text-sm text-muted-foreground">Tampilkan input foto</span>
              </div>
              {showImageField && (
                <div className="space-y-2">
                  {initialData?.image && (
                    <div className="relative w-full aspect-video rounded border">
                      <Image src={getMediaUrl(initialData.image) || ""} alt="Preview" fill className="object-cover" unoptimized />
                    </div>
                  )}
                  <Input type="file" name="image" accept="image/*" />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dynamic_content">Konten</Label>
              <RichEditor
                name="dynamic_content"
                id="dynamic_content"
                defaultValue={initialData?.dynamic_content || ""}
              />
            </div>
          </>
        )}

        {pageType === 'pdf' && (
          <>
            <div className="grid gap-2">
              <Label>Dokumen (PDF)</Label>
              <div className="space-y-2">
                {initialData?.file && (
                  <div className="p-3 border rounded bg-muted">
                    <p className="text-sm text-muted-foreground">Dokumen saat ini:</p>
                    <p className="text-sm font-medium truncate">{initialData.file}</p>
                  </div>
                )}
                <Input type="file" name="file" accept="application/pdf" />
                <p className="text-xs text-muted-foreground">Unggah file PDF maksimal 3MB</p>
              </div>
            </div>
            <input type="hidden" name="dynamic_content" value="-" />
          </>
        )}

        <div className="flex items-center gap-4 border p-3 rounded">
          <Label htmlFor="status">Status Aktif</Label>
          <Switch
            id="status"
            name="status"
            defaultChecked={initialData?.status !== 0}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Buat Halaman"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
      </div>
    </form>
  )
}
