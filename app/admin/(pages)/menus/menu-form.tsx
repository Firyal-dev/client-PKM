'use client'

import { useActionState, useEffect, useState } from "react"
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
import { ActionResponse } from "@/services/utils"
import { Menu } from "@/services/menu/menu-service"
import { FieldDescription } from "@/components/ui/field"
import { cn } from "@/lib/utils"

type MenuFormProps = {
  action: (prevState: unknown, formData: FormData) => Promise<ActionResponse>
  initialData?: Menu
  parentMenus: Menu[]
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
}

export function MenuForm({ action, initialData, parentMenus }: MenuFormProps) {
  const router = useRouter()

  // State untuk menentukan level menu (Utama atau Submenu)
  const [menuLevel, setMenuLevel] = useState<"ROOT" | "SUB">(
    initialData?.parent?.id ? "SUB" : "ROOT"
  )

  const [autoSlug, setAutoSlug] = useState(initialData?.slug || "")
  const [isCustomSlug, setIsCustomSlug] = useState(false)

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isCustomSlug) {
      setAutoSlug(generateSlug(e.target.value))
    }
  }

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
            onChange={handleTitleChange}
          />
        </div>

        {/* --- PILIHAN LEVEL MENU --- */}
        <div className="grid gap-2">
          <Label>Level Menu</Label>
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setMenuLevel("ROOT")}
              className={cn(
                "flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all",
                menuLevel === "ROOT" 
                  ? "bg-white shadow-sm text-blue-600" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              Menu Utama
            </button>
            <button
              type="button"
              onClick={() => setMenuLevel("SUB")}
              className={cn(
                "flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all",
                menuLevel === "SUB" 
                  ? "bg-white shadow-sm text-blue-600" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              Sub Menu
            </button>
          </div>
          <FieldDescription>
            Tentukan apakah ini menu mandiri atau anak dari menu lain.
          </FieldDescription>
        </div>

        {/* --- SELECT MENU INDUK (CUMA MUNCUL KALO SUB MENU) --- */}
        {menuLevel === "SUB" ? (
          <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <Label htmlFor="parent_id">Pilih Menu Induk</Label>
            <Select
              name="parent_id"
              defaultValue={initialData?.parent?.id?.toString()}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="-- Pilih Induk --" />
              </SelectTrigger>
              <SelectContent>
                {parentMenus
                  .filter(menu => !initialData || menu.id !== initialData.id)
                  .map((menu) => (
                    <SelectItem key={menu.id} value={menu.id.toString()}>
                      {menu.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          /* Kirim value kosong kalau dia Menu Utama */
          <input type="hidden" name="parent_id" value="" />
        )}

        {/* Order */}
        <div className="grid gap-2">
          <Label htmlFor="order">Urutan Tampil</Label>
          <Input
            id="order"
            name="order"
            type="number"
            min="0"
            defaultValue={initialData?.order?.toString() || "0"}
            placeholder="0"
          />
        </div>

        {/* Status Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex flex-col">
            <Label htmlFor="status_switch" className="font-bold">Status Publikasi</Label>
            <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Munculkan menu di halaman depan</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded",
              initialData?.status !== 0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
            )}>
              {initialData?.status !== 0 ? 'AKTIF' : 'NON-AKTIF'}
            </span>
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
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Sedang Menyimpan..." : initialData ? "Simpan Perubahan" : "Tambahkan Menu"}
        </Button>
      </div>
    </form>
  )
}