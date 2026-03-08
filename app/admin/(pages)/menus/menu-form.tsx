'use client'

import { useActionState, useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Link as LinkIcon, AlertTriangle, Info, Layers, FileText, Folder } from "lucide-react"

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
import { Menu, checkMenuSlugExists } from "@/services/menu/menu-service"
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

type FlatMenuItem = { id: string; title: string; level: number; pathString: string }

function buildFlattenedTree(menus: Menu[], excludeId?: string): FlatMenuItem[] {
  const flattened: FlatMenuItem[] = []
  const groupMenus = menus.filter(m => m.type === 'grup')

  const traverse = (parentId: string | null, level: number, currentPath: string) => {
    const children = groupMenus.filter(m => {
      if (parentId === null) return !m.parent_id && !m.parent
      return m.parent_id === parentId || m.parent?.id === parentId
    })
    children.forEach(child => {
      if (child.id === excludeId) return
      const newPath = currentPath ? `${currentPath} → ${child.title}` : child.title
      flattened.push({ id: child.id, title: child.title, level, pathString: newPath })
      traverse(child.id, level + 1, newPath)
    })
  }

  traverse(null, 0, "")
  return flattened
}

const menuTypeOptions = [
  {
    value: "static",
    icon: FileText,
    label: "Statis",
    desc: "Tentang Kami, Kontak, dll",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
  },
  {
    value: "dynamic",
    icon: Layers,
    label: "Dinamis",
    desc: "Berita, Layanan, dll",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
  },
  {
    value: "grup",
    icon: Folder,
    label: "Grup",
    desc: "Folder / Parent menu",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
]

export function MenuForm({ action, initialData, parentMenus }: MenuFormProps) {
  const router = useRouter()

  const [menuLevel, setMenuLevel] = useState<"ROOT" | "SUB">(
    initialData?.parent?.id ? "SUB" : "ROOT"
  )
  const [selectedParentId, setSelectedParentId] = useState<string>(
    initialData?.parent?.id?.toString() || ""
  )
  const [orderValue, setOrderValue] = useState<string>(
    initialData?.order?.toString() ?? "1"
  )
  const [autoSlug, setAutoSlug] = useState(initialData?.slug || "")
  const [isSlugDuplicate, setIsSlugDuplicate] = useState(false)
  const [isCheckingSlug, setIsCheckingSlug] = useState(false)
  const [isOrderDuplicate, setIsOrderDuplicate] = useState(false)
  const [menuType, setMenuType] = useState<'static' | 'dynamic' | 'grup'>(
    (initialData?.type as 'static' | 'dynamic' | 'grup') || 'static'
  )
  const [state, formAction, isPending] = useActionState(action, {
    success: false,
    error: "",
  })

  useEffect(() => {
    const checkSlug = async () => {
      const slug = generateSlug(autoSlug || '')
      if (!slug) { setIsSlugDuplicate(false); return }
      setIsCheckingSlug(true)
      try {
        const exists = await checkMenuSlugExists(slug, initialData?.id)
        setIsSlugDuplicate(exists)
      } catch {
        setIsSlugDuplicate(false)
      } finally {
        setIsCheckingSlug(false)
      }
    }
    const t = setTimeout(checkSlug, 500)
    return () => clearTimeout(t)
  }, [autoSlug, initialData?.id])

  useEffect(() => {
    const orderNum = parseInt(orderValue, 10)
    if (isNaN(orderNum) || orderNum < 1) { setIsOrderDuplicate(false); return }
    const menusAtSameLevel = parentMenus.filter(menu => {
      if (menuLevel === "ROOT") return !menu.parent_id
      return menu.parent_id === selectedParentId
    })
    const hasDuplicate = menusAtSameLevel.some(menu => {
      if (initialData?.id && menu.id === initialData.id) return false
      return menu.order === orderNum
    })
    setIsOrderDuplicate(hasDuplicate)
  }, [orderValue, selectedParentId, menuLevel, parentMenus, initialData?.id])

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
    setAutoSlug(generateSlug(e.target.value))
  }

  const hierarchicalMenuOptions = useMemo(() => {
    return buildFlattenedTree(parentMenus, initialData?.id)
  }, [parentMenus, initialData?.id])

  const handleSubmit = (e: React.FormEvent) => {
    if (isSlugDuplicate) {
      e.preventDefault()
      toast.error("Nama menu ini sudah digunakan.")
      return
    }
    if (isCheckingSlug) {
      e.preventDefault()
      toast.error("Sedang memeriksa ketersediaan nama.")
      return
    }
    if (isOrderDuplicate) {
      e.preventDefault()
      toast.error("Nomor urutan ini sudah digunakan.")
      return
    }
  }

  const submitLabel = isPending
    ? "Menyimpan..."
    : isCheckingSlug
      ? "Memeriksa..."
      : isSlugDuplicate
        ? "Nama Duplikat"
        : isOrderDuplicate
          ? "Urutan Duplikat"
          : initialData
            ? "Simpan Perubahan"
            : "Tambah Menu"

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-5">

      {/* ── Nama Menu ── */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">Nama Menu</Label>
        <Input
          id="title"
          name="title"
          defaultValue={initialData?.title || ""}
          placeholder="Contoh: Sejarah Puskesmas"
          required
          onChange={handleNameChange}
          className={isSlugDuplicate ? "border-destructive focus-visible:ring-destructive" : ""}
        />

        {isSlugDuplicate && (
          <p className="text-xs text-destructive flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            Nama ini sudah dipakai, gunakan nama lain.
          </p>
        )}

        {/* URL preview */}
        <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs transition-colors ${isSlugDuplicate
            ? "bg-destructive/5 border-destructive/30 text-destructive"
            : "bg-muted/40 border-border text-muted-foreground"
          }`}>
          <LinkIcon className="w-3.5 h-3.5 shrink-0" />
          <span>URL:</span>
          <code className="font-mono font-medium text-foreground">
            /{autoSlug || <span className="text-muted-foreground italic">otomatis</span>}
          </code>
        </div>
        <input type="hidden" name="slug" value={autoSlug} />
      </div>

      {/* ── Tipe Konten ── */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tipe Konten</Label>
        <div className="grid grid-cols-3 gap-2">
          {menuTypeOptions.map(({ value, icon: Icon, label, desc, color, bg, border }) => {
            const isSelected = menuType === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setMenuType(value as 'static' | 'dynamic' | 'grup')
                  if (value === 'grup') {
                    setMenuLevel('ROOT')
                    setSelectedParentId('')
                  }
                }}
                className={`relative flex flex-col items-start gap-1.5 p-3 rounded-xl border text-left transition-all ${isSelected
                    ? `${bg} ${border} border`
                    : "border-border bg-muted/20 hover:bg-muted/40"
                  }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? color : "text-muted-foreground"}`} />
                <div>
                  <p className={`text-xs font-semibold leading-snug ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                    {label}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{desc}</p>
                </div>
              </button>
            )
          })}
        </div>
        <input type="hidden" name="type" value={menuType} readOnly />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* ── Posisi ── */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Posisi</Label>
          <SegmentedControl
            value={menuLevel}
            onChange={(val: "ROOT" | "SUB") => {
              if (menuType === 'grup') return
              setMenuLevel(val)
              if (val === 'ROOT') setSelectedParentId('')
            }}
            options={[
              { label: "Utama", value: "ROOT" },
              ...(menuType !== 'grup' ? [{ label: "Sub Menu", value: "SUB" as const }] : []),
            ]}
          />
          {menuType === 'grup' && (
            <p className="text-[10px] text-amber-500 flex items-center gap-1">
              <Info className="w-3 h-3 shrink-0" />
              Grup hanya bisa menjadi menu utama.
            </p>
          )}
        </div>

        {/* ── Urutan ── */}
        <div className="space-y-2">
          <Label htmlFor="order" className="text-sm font-medium">Urutan Tampil</Label>
          <Input
            id="order"
            name="order"
            type="text"
            min="1"
            value={orderValue}
            onChange={(e) => {
              const v = e.target.value
              if (!/^\d*$/.test(v)) return
              if (v.length > 1 && v.startsWith("0")) return
              setOrderValue(v)
            }}
            className={isOrderDuplicate ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {isOrderDuplicate ? (
            <p className="text-[10px] text-destructive flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              Urutan ini sudah dipakai.
            </p>
          ) : (
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Info className="w-3 h-3 shrink-0" />
              Angka kecil tampil lebih dulu.
            </p>
          )}
        </div>
      </div>

      {/* ── Induk Menu (jika SUB) ── */}
      {menuLevel === "SUB" && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
          <Label htmlFor="parent_id" className="text-sm font-medium">Induk Menu</Label>
          <Select
            name="parent_id"
            defaultValue={initialData?.parent?.id?.toString()}
            onValueChange={setSelectedParentId}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih menu grup sebagai induk" />
            </SelectTrigger>
            <SelectContent>
              {hierarchicalMenuOptions.length > 0 ? (
                hierarchicalMenuOptions.map((menu) => (
                  <SelectItem key={menu.id} value={menu.id.toString()}>
                    <span className={menu.level > 0 ? "text-muted-foreground text-xs" : "font-medium"}>
                      {menu.pathString}
                    </span>
                  </SelectItem>
                ))
              ) : (
                <div className="p-3 text-sm text-muted-foreground text-center">
                  Tidak ada menu grup tersedia
                </div>
              )}
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Info className="w-3 h-3 shrink-0" />
            Hanya menu bertipe "Grup" yang bisa menjadi induk.
          </p>
        </div>
      )}

      {menuLevel !== "SUB" && <input type="hidden" name="parent_id" value="" />}

      {/* ── Status ── */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
        <div>
          <p className="text-sm font-medium">Publikasikan Menu</p>
          <p className="text-xs text-muted-foreground mt-0.5">Tampilkan menu ini ke pengunjung website.</p>
        </div>
        <Switch
          id="status_switch"
          defaultChecked={initialData?.status !== 0}
          onCheckedChange={(checked) => {
            const el = document.getElementById('status_input') as HTMLInputElement
            if (el) el.value = checked ? "1" : "0"
          }}
        />
        <input type="hidden" id="status_input" name="status" defaultValue={initialData?.status ?? 1} />
      </div>

      {/* ── Submit ── */}
      <div className="pt-2 border-t border-border">
        <Button
          type="submit"
          disabled={isPending || isSlugDuplicate || isCheckingSlug || isOrderDuplicate}
          className="w-full h-10 font-medium"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}