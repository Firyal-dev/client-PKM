'use client'

import { useActionState, useEffect, useState } from "react"
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

// Dummy data untuk halaman dinamis (nanti bisa diganti dengan fetch dari API/DB)
const DUMMY_DYNAMIC_PAGES = [
  { slug: "/berita/puskesmas-raih-penghargaan", title: "Berita: Puskesmas Raih Penghargaan" },
  { slug: "/profil/sejarah", title: "Profil: Sejarah Puskesmas" },
  { slug: "/program/posyandu-lansia", title: "Program: Posyandu Lansia" },
]

export function MenuForm({ action, initialData, parentMenus }: MenuFormProps) {
  const router = useRouter()

  const [state, formAction, isPending] = useActionState(action, {
    success: false,
    error: "",
  })

  // State untuk menentukan apakah link statis atau dinamis
  // Cek jika initialData.slug ada di data dummy, maka set 'dinamis', sisanya 'statis'
  const isInitialDynamic = DUMMY_DYNAMIC_PAGES.some(p => p.slug === initialData?.slug)
  const [targetType, setTargetType] = useState<"statis" | "dinamis">(
    isInitialDynamic ? "dinamis" : "statis"
  )

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

        {/* Pemilih Tipe Tautan */}
        <div className="grid gap-2">
          <Label>Tipe Tautan</Label>
          <Select 
            value={targetType} 
            onValueChange={(val: "statis" | "dinamis") => setTargetType(val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih tipe tautan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="statis">Halaman Statis (Bawaan Sistem)</SelectItem>
              <SelectItem value="dinamis">Halaman Dinamis (CMS / Pages)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* URL Target (Conditional Rendering) */}
        <div className="grid gap-2">
          <Label htmlFor="url_target">URL Target</Label>
          
          {targetType === "statis" ? (
            <Select
              name="url_target"
              defaultValue={!isInitialDynamic ? (initialData?.slug || "/layanan") : undefined}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih halaman statis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="/layanan">Layanan</SelectItem>
                <SelectItem value="/tentang-kami">Tentang Kami</SelectItem>
                <SelectItem value="/kontak">Kontak</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Select
              name="url_target"
              defaultValue={isInitialDynamic ? initialData?.slug : undefined}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih halaman dinamis dari sistem" />
              </SelectTrigger>
              <SelectContent>
                {DUMMY_DYNAMIC_PAGES.map((page) => (
                  <SelectItem key={page.slug} value={page.slug}>
                    {page.title} ({page.slug})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Parent Menu */}
        <div className="grid gap-2">
          <Label htmlFor="parent_id">Menu Induk</Label>
          <Select
            name="parent_id"
            defaultValue={initialData?.parent?.id ? initialData.parent.id.toString() : "__none__"}
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