'use client'

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RichEditor } from "@/components/admin/rich-editor"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ActionResponse } from "@/services/utils"
import { Page } from "@/services/page/page-service"
import { Menu } from "@/services/menu/menu-service"

type PageFormProps = {
  action: (prevState: unknown, formData: FormData) => Promise<ActionResponse>
  initialData?: Page
  menus?: Menu[]
}

export function PageForm({ action, initialData, menus = [] }: PageFormProps) {
  const router = useRouter()

  const [state, formAction, isPending] = useActionState(action, {
    success: false,
    error: "",
  })

  useEffect(() => {
    if (state.success) {
      toast.success(initialData ? "Halaman berhasil diperbarui" : "Halaman berhasil dibuat")
      router.push("/admin/pages")
      router.refresh()
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state, initialData, router])

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4">
        {/* Menu Selection */}
        <div className="grid gap-2">
          <Label htmlFor="menu_id">Menu</Label>
          <Select
            name="menu_id"
            defaultValue={initialData?.menu_id || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih menu" />
            </SelectTrigger>
            <SelectContent>
              {menus.map((menu) => (
                <SelectItem key={menu.id} value={menu.id}>
                  {menu.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Pilih menu yang akan menjadi konten halaman ini
          </p>
        </div>

        {/* Title */}
        <div className="grid gap-2">
          <Label htmlFor="title">Judul Halaman</Label>
          <Input
            id="title"
            name="title"
            defaultValue={initialData?.title || ""}
            placeholder="Masukkan judul halaman"
            required
          />
        </div>

        {/* Layout */}
        <div className="grid gap-2">
          <Label htmlFor="layout">Layout Tampilan</Label>
          <Select
            name="layout"
            defaultValue={initialData?.layout || "artikel"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="artikel">Artikel</SelectItem>
              <SelectItem value="cards">Kartu</SelectItem>
              <SelectItem value="list">Daftar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        <div className="grid gap-2">
          <Label htmlFor="content">Konten</Label>
          <RichEditor
            name="content"
            id="content"
            defaultValue={initialData?.content || ""}
          />
        </div>

        {/* Image URL */}
        <div className="grid gap-2">
          <Label htmlFor="image">URL Gambar (Opsional)</Label>
          <Input
            id="image"
            name="image"
            defaultValue={initialData?.image || ""}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <Switch
            id="status_switch"
            defaultChecked={initialData?.status !== 0}
            onCheckedChange={(checked) => {
              const el = document.getElementById('status_input') as HTMLInputElement
              if (el) el.value = checked ? "1" : "0"
            }}
          />
          <input
            type="hidden"
            id="status_input"
            name="status"
            defaultValue={initialData?.status ?? 1}
          />
          <Label htmlFor="status_switch">Halaman Aktif</Label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Menyimpan..." : initialData ? "Perbarui Halaman" : "Buat Halaman"}
        </Button>
      </div>
    </form>
  )
}
