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
import { SegmentedControl } from "@/components/ui/segmented-control"

type MenuFormProps = {
  action: (prevState: unknown, formData: FormData) => Promise<ActionResponse>
  initialData?: Menu
  parentMenus: Menu[]
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
}

export function MenuForm({ action, initialData, parentMenus }: MenuFormProps) {
  const router = useRouter()

  const [menuLevel, setMenuLevel] = useState<"ROOT" | "SUB">(
    initialData?.parent?.id ? "SUB" : "ROOT"
  )
  

  const [orderValue, setOrderValue] = useState<string>(
    initialData?.order?.toString() ?? "0"
  )

  const [autoSlug, setAutoSlug] = useState(initialData?.slug || "")
  const [isCustomSlug, setIsCustomSlug] = useState(false)
const [menuType, setMenuType] = useState<'static' | 'dynamic'>(
  (initialData?.type as 'static' | 'dynamic') || 'static'
)
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
    } <div className="grid gap-2">
      <Label>Jenis Menu</Label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMenuLevel("ROOT")}
          className={`flex-1 py-2 px-4 rounded border ${menuLevel === "ROOT" ? "bg-slate-800 text-white" : "bg-white border-slate-300"}`}
        >
          Menu Utama
        </button>
        <button
          type="button"
          onClick={() => setMenuLevel("SUB")}
          className={`flex-1 py-2 px-4 rounded border ${menuLevel === "SUB" ? "bg-slate-800 text-white" : "bg-white border-slate-300"}`}
        >
          Sub Menu
        </button>
      </div>
    </div>
  }, [state, initialData, router])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isCustomSlug) {
      setAutoSlug(generateSlug(e.target.value))
    }
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Nama Menu</Label>
          <Input
            id="title"
            name="title"
            defaultValue={initialData?.title || ""}
            placeholder="Masukkan nama menu"
            required
            onChange={handleNameChange}
          />
        </div>

        <div className="grid gap-2">
          <Label>Tipe Menu</Label>
          <Select
            value={menuType}
            onValueChange={(val) => setMenuType(val as 'static' | 'dynamic')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="-- Pilih Type Menu --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="static">Statis</SelectItem>
              <SelectItem value="dynamic">Dinamis</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" name="type" id="type_input" value={menuType} readOnly />
        </div>

   <div className="grid gap-2">
  <Label>Jenis Menu</Label>

  <SegmentedControl
    value={menuLevel}
    onChange={setMenuLevel}
    options={[
      { label: "Menu Utama", value: "ROOT" },
      { label: "Sub Menu", value: "SUB" },
    ]}
  />
</div>
        {menuLevel === "SUB" ? (
          <div className="grid gap-2">
            <Label htmlFor="parent_id">Menu Induk</Label>
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
          <input type="hidden" name="parent_id" value="" />
        )}

        <div className="grid gap-2">
          <Label htmlFor="order">Urutan</Label>
          <Input
            id="order"
            name="order"
            type="text"
            min="0"
            value={orderValue}
            onChange={(e) => {
              const value = e.target.value

              // Hanya izinkan angka
              if (!/^\d*$/.test(value)) return

              // 1 digit: boleh 0
              if (value.length === 1) {
                setOrderValue(value)
                return
              }

              // >1 digit: tidak boleh mulai dengan 0
              if (value.length > 1 && value.startsWith("0")) return

              setOrderValue(value)
            }}
          />
        </div>

        <div className="flex items-center justify-between border p-3 rounded">
          <Label htmlFor="status_switch">Status Aktif</Label>
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

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Tambah Menu"}
        </Button>
      </div>
    </form>
  )
}
