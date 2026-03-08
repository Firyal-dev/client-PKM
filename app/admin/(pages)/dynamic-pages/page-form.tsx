"use client"

import { useState, useActionState, useEffect, useRef } from "react"
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
import { Page, checkMenuPageLink } from "@/services/page/page-service"
import { Menu } from "@/services/menu/menu-service"
import { FileText, LayoutGrid, File, AlertTriangle, ImageIcon, X } from "lucide-react"

import dynamic from 'next/dynamic'
import Image from "next/image"
import { getMediaUrl } from "@/lib/getMediaUrl"

const RichEditor = dynamic(() => import('@/components/admin/rich-editor'), { ssr: false })

interface PageFormProps {
  action: (state: any, formData: FormData) => Promise<any>
  initialData?: Page
  menus: Menu[]
}

const pageTypeOptions = [
  {
    value: "halaman",
    icon: FileText,
    label: "Halaman",
    desc: "Konten tunggal",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
  },
  {
    value: "kartu",
    icon: LayoutGrid,
    label: "Kartu",
    desc: "Berita / Artikel",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
  },
  {
    value: "pdf",
    icon: File,
    label: "PDF",
    desc: "Dokumen",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
]

export function PageForm({ action, initialData, menus }: PageFormProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(action, null)
  const formRef = useRef<HTMLFormElement>(null)

  const [pageType, setPageType] = useState<'halaman' | 'pdf' | 'kartu'>(initialData?.type || 'halaman')
  const [showImageField, setShowImageField] = useState(!!initialData?.image)
  const [selectedMenuId, setSelectedMenuId] = useState<string>(initialData?.menu_id || "")
  const [existingPage, setExistingPage] = useState<{
    hasPages: boolean
    pageCount: number
    existingType: string
    pages: { id: string; title: string; type: string }[]
    menu_title: string
  } | null>(null)
  const [showTypeMismatchWarning, setShowTypeMismatchWarning] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  const checkLink = async (menuId: string, type: string) => {
    if (!menuId || menuId === initialData?.menu_id) {
      setExistingPage(null)
      setShowTypeMismatchWarning(false)
      return
    }
    setIsChecking(true)
    try {
      const result = await checkMenuPageLink(menuId)
      if (result?.hasPages) {
        const blocked = type === 'halaman' || result.existingType !== type
        setExistingPage(result)
        setShowTypeMismatchWarning(blocked)
      } else {
        setExistingPage(null)
        setShowTypeMismatchWarning(false)
      }
    } catch {
      setExistingPage(null)
      setShowTypeMismatchWarning(false)
    } finally {
      setIsChecking(false)
    }
  }

  const handleMenuChange = (menuId: string) => {
    setSelectedMenuId(menuId)
    checkLink(menuId, pageType)
  }

  const handlePageTypeChange = (val: string) => {
    const newType = val as 'halaman' | 'pdf' | 'kartu'
    setPageType(newType)
    checkLink(selectedMenuId, newType)
  }

  useEffect(() => {
    if (state?.success) {
      toast.success(initialData ? "Halaman diperbarui!" : "Halaman dibuat!")
      router.push("/admin/dynamic-pages")
      router.refresh()
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state, initialData, router])

  const warningMessage = existingPage && showTypeMismatchWarning
    ? pageType === 'halaman'
      ? `Menu ini sudah punya halaman. Tipe "Halaman" hanya boleh 1 per menu.`
      : `Menu ini sudah punya halaman tipe "${existingPage.existingType}". Tidak boleh dicampur.`
    : null

  return (
    <form ref={formRef} action={formAction} className="space-y-5">

      {/* ── Menu ── */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Menu</Label>
        <Select
          name="menu_id"
          value={selectedMenuId}
          onValueChange={handleMenuChange}
          disabled={isChecking}
        >
          <SelectTrigger className={showTypeMismatchWarning ? "border-destructive" : ""}>
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
        <input type="hidden" name="menu_id_input" defaultValue={initialData?.menu_id} />

        {warningMessage && (
          <p className="text-xs text-destructive flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            {warningMessage}
          </p>
        )}
      </div>

      {/* ── Tipe Halaman ── */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tipe Halaman</Label>
        <div className="grid grid-cols-3 gap-2">
          {pageTypeOptions.map(({ value, icon: Icon, label, desc, color, bg, border }) => {
            const isSelected = pageType === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => handlePageTypeChange(value)}
                className={`flex flex-col items-start gap-1.5 p-3 rounded-xl border text-left transition-all ${isSelected
                    ? `${bg} ${border} border`
                    : "border-border bg-muted/20 hover:bg-muted/40"
                  }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? color : "text-muted-foreground"}`} />
                <div>
                  <p className={`text-xs font-semibold leading-snug ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                    {label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </button>
            )
          })}
        </div>
        <input type="hidden" name="type" value={pageType} readOnly />
      </div>

      {/* ── Judul ── */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">Judul</Label>
        <Input
          id="title"
          name="title"
          placeholder="Masukkan judul halaman"
          defaultValue={initialData?.title}
          required
        />
      </div>

      {/* ── Konten: halaman & kartu ── */}
      {(pageType === 'halaman' || pageType === 'kartu') && (
        <>
          {/* Foto */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Foto Utama</Label>
              <button
                type="button"
                onClick={() => setShowImageField(!showImageField)}
                className={`text-xs px-2 py-1 rounded-md border transition-colors ${showImageField
                    ? "border-border bg-muted/50 text-muted-foreground"
                    : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40"
                  }`}
              >
                {showImageField ? "Sembunyikan" : "Tambah Foto"}
              </button>
            </div>

            {showImageField && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                {initialData?.image && (
                  <div className="relative w-full aspect-video rounded-lg border border-border overflow-hidden">
                    <Image
                      src={getMediaUrl(initialData.image) || ""}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <Input type="file" name="image" accept="image/*" />
              </div>
            )}
          </div>

          {/* Rich Editor */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Konten</Label>
            <RichEditor
              name="dynamic_content"
              id="dynamic_content"
              defaultValue={initialData?.dynamic_content || ""}
            />
          </div>
        </>
      )}

      {/* ── Konten: PDF ── */}
      {pageType === 'pdf' && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Dokumen PDF</Label>
          {initialData?.file && (
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-border bg-muted/20 text-sm">
              <File className="w-4 h-4 text-red-400 shrink-0" />
              <span className="truncate text-muted-foreground">{initialData.file}</span>
            </div>
          )}
          <Input type="file" name="file" accept="application/pdf" />
          <p className="text-[10px] text-muted-foreground">Maksimal 3MB</p>
          <input type="hidden" name="dynamic_content" value="-" />
        </div>
      )}

      {/* ── Status ── */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
        <div>
          <p className="text-sm font-medium">Publikasikan Halaman</p>
          <p className="text-xs text-muted-foreground mt-0.5">Tampilkan halaman ini ke pengunjung.</p>
        </div>
        <Switch
          id="status"
          name="status"
          defaultChecked={initialData?.status !== 0}
        />
      </div>

      <input type="hidden" name="force_replace" value="false" />

      {/* ── Warning block ── */}
      {showTypeMismatchWarning && existingPage && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl border border-destructive/30 bg-destructive/5">
          <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-destructive">Tidak dapat menyimpan</p>
            <p className="text-xs text-destructive/80">{warningMessage}</p>
          </div>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="flex gap-3 pt-2 border-t border-border">
        <Button
          type="submit"
          disabled={isPending || isChecking || showTypeMismatchWarning}
          className="flex-1 h-10 font-medium"
        >
          {isPending ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Buat Halaman"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="h-10 px-5"
        >
          Batal
        </Button>
      </div>
    </form>
  )
}