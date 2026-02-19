'use client'

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ActionResponse } from "@/services/utils"
import { Menu } from "@/services/menu/menu-service"

type MenuFormProps = {
  action: (prevState: unknown, formData: FormData) => Promise<ActionResponse>
  initialData?: Menu
  parentMenus: Menu[]
}

export function MenuForm({ action, initialData, parentMenus }: MenuFormProps) {
  const router = useRouter()

  const [state, formAction, isPending] = useActionState(action, {
    success: false,
    error: "",
  })
  useEffect(() => {
    if (state.success) {
      toast.success(initialData ? "Menu berhasil diperbarui" : "Menu berhasil dibuat")
      router.push("/admin/menus")
      router.refresh()
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state, initialData, router])

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4">
        {/* Title */}
        <div className="grid gap-2">
          <Label htmlFor="title">Judul Menu</Label>
          <Input
            id="title"
            name="title"
            defaultValue={initialData?.title || ""}
            placeholder="Masukkan judul menu"
            required
          />
        </div>

        {/* URL Target */}
        <div className="grid gap-2">
          <Label htmlFor="url_target">URL Target</Label>
          <Select
            name="url_target"
            defaultValue={initialData?.slug || "/"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih halaman" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="/">Beranda</SelectItem>
              <SelectItem value="/profil">Profil</SelectItem>
              <SelectItem value="/layanan">Layanan</SelectItem>
              <SelectItem value="/berita">Berita</SelectItem>
              <SelectItem value="/artikel">Artikel</SelectItem>
              <SelectItem value="/galeri">Galeri Foto</SelectItem>
              <SelectItem value="/video">Video</SelectItem>
              <SelectItem value="/agenda">Agenda</SelectItem>
              <SelectItem value="/ulasan">Ulasan</SelectItem>
              <SelectItem value="/kontak">Kontak</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Parent Menu */}
        <div className="grid gap-2">
          <Label htmlFor="parent_id">Menu Induk</Label>
          <Select
            name="parent_id"
            defaultValue={initialData?.parent_id ? initialData.parent_id.toString() : "__none__"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih menu induk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Menu Utama (Tanpa Induk)</SelectItem>
              {parentMenus
                .filter(menu => !initialData || menu.id !== initialData.id)
                .map((menu) => (
                  <SelectItem key={menu.id} value={menu.id}>
                    {menu.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Order */}
        <div className="grid gap-2">
          <Label htmlFor="order">Urutan</Label>
          <Input
            id="order"
            name="order"
            type="number"
            min="0"
            defaultValue={initialData?.order?.toString() || "0"}
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Menyimpan..." : initialData ? "Perbarui Menu" : "Buat Menu"}
        </Button>
      </div>
    </form>
  )
}