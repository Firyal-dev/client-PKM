'use client'

import { useActionState, useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Link as LinkIcon, Info } from "lucide-react"

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

// ── Helper buat bikin pohon hirarki dengan Breadcrumb Path ──
type FlatMenuItem = { id: string; title: string; level: number; pathString: string }

function buildFlattenedTree(menus: Menu[], excludeId?: string): FlatMenuItem[] {
  const flattened: FlatMenuItem[] = []

  const traverse = (parentId: string | null, level: number, currentPath: string) => {
    const children = menus.filter(m => 
        (parentId === null ? !m.parent : m.parent?.id === parentId)
    )

    children.forEach(child => {
      // Jangan masukin menu yang lagi diedit & anak-anaknya
      if (child.id === excludeId) return

      // Bikin string jejak path (Contoh: Induk ➔ Anak ➔ Cucu)
      const newPath = currentPath ? `${currentPath} ➔ ${child.title}` : child.title

      flattened.push({
        id: child.id,
        title: child.title,
        level: level,
        pathString: newPath
      })

      traverse(child.id, level + 1, newPath)
    })
  }

  traverse(null, 0, "")
  return flattened
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
    }
  }, [state, initialData, router])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isCustomSlug) {
      setAutoSlug(generateSlug(e.target.value))
    }
  }

  const hierarchicalMenuOptions = useMemo(() => {
    return buildFlattenedTree(parentMenus, initialData?.id)
  }, [parentMenus, initialData?.id])

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-5">
        
        {/* ── NAMA MENU & PREVIEW URL ── */}
        <div className="grid gap-2 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl">
          <Label htmlFor="title" className="text-base font-semibold">Nama Menu</Label>
          <Input
            id="title"
            name="title"
            defaultValue={initialData?.title || ""}
            placeholder="Contoh: Sejarah Puskesmas"
            required
            onChange={handleNameChange}
            className="bg-white dark:bg-slate-950"
          />
          
          {/* Live URL Preview Box */}
          <div className="flex items-start gap-2 mt-2 p-3 bg-blue-50/50 dark:bg-slate-800/40 border border-blue-100 dark:border-slate-700/60 rounded-lg text-sm transition-all">
            <LinkIcon className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <div>
                <p className="text-slate-600 dark:text-slate-300 font-medium mb-0.5">Preview Destinasi Link:</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Menu ini akan mengarahkan pengunjung ke halaman:</p>
                <code className="inline-block mt-1 px-2 py-1 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 font-mono text-blue-600 dark:text-blue-400 font-semibold">
                    /{autoSlug || 'url-otomatis-disini'}
                </code>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* ── TIPE MENU ── */}
            <div className="grid gap-2">
            <Label>Tipe Konten</Label>
            <Select
                value={menuType}
                onValueChange={(val) => setMenuType(val as 'static' | 'dynamic')}
            >
                <SelectTrigger className="w-full">
                <SelectValue placeholder="-- Pilih Type Menu --" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="static">Halaman Statis (Tentang Kami, dll)</SelectItem>
                <SelectItem value="dynamic">Halaman Dinamis (Berita, Layanan, dll)</SelectItem>
                </SelectContent>
            </Select>
            <input type="hidden" name="type" id="type_input" value={menuType} readOnly />
            </div>

            {/* ── URUTAN ── */}
            <div className="grid gap-2">
            <Label htmlFor="order">Nomor Urutan Tampil</Label>
            <Input
                id="order"
                name="order"
                type="text"
                min="0"
                value={orderValue}
                onChange={(e) => {
                const value = e.target.value
                if (!/^\d*$/.test(value)) return
                if (value.length === 1) { setOrderValue(value); return }
                if (value.length > 1 && value.startsWith("0")) return
                setOrderValue(value)
                }}
            />
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Info className="w-3 h-3" /> Angka kecil tampil lebih dulu (kiri/atas).
            </p>
            </div>
        </div>

        {/* ── POSISI HIERARKI MENU ── */}
        <div className="grid gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl">
            <Label className="text-base font-semibold">Posisi Menu</Label>
            <SegmentedControl
                value={menuLevel}
                onChange={setMenuLevel}
                options={[
                { label: "Menu Utama (Root)", value: "ROOT" },
                { label: "Sub Menu (Anak)", value: "SUB" },
                ]}
            />

            {menuLevel === "SUB" ? (
                <div className="grid gap-2 mt-2 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="parent_id">Pilih Induk Menu</Label>
                    <Select
                        name="parent_id"
                        defaultValue={initialData?.parent?.id?.toString()}
                        required
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="-- Pilih Induk Menu Terlebih Dahulu --" />
                        </SelectTrigger>
                        <SelectContent>
                            {hierarchicalMenuOptions.map((menu) => (
                                <SelectItem key={menu.id} value={menu.id.toString()}>
                                    {/* Tampilan Breadcrumb Path (Induk ➔ Anak) */}
                                    <span className={menu.level > 0 ? "text-slate-600 dark:text-slate-400 text-xs" : "font-medium"}>
                                        {menu.pathString}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                        <Info className="w-3 h-3" /> Menu ini akan disisipkan di bawah menu induk yang dipilih.
                    </p>
                </div>
            ) : (
                <input type="hidden" name="parent_id" value="" />
            )}
        </div>

        {/* ── STATUS AKTIF ── */}
        <div className="flex items-center justify-between border border-slate-200 dark:border-slate-800 p-4 rounded-xl bg-white dark:bg-slate-950 shadow-sm">
          <div>
              <Label htmlFor="status_switch" className="text-base">Publikasikan Menu</Label>
              <p className="text-xs text-slate-500 mt-1">Matikan jika menu ini belum siap ditampilkan ke pengunjung.</p>
          </div>
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

      <div className="flex gap-4 pt-4 border-t dark:border-slate-800">
        <Button type="submit" disabled={isPending} className="w-full h-11 text-md font-medium">
          {isPending ? "Menyimpan Data..." : initialData ? "Simpan Perubahan Menu" : "Tambah Menu Baru"}
        </Button>
      </div>
    </form>
  )
}