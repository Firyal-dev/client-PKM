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
  const formRef = useRef<HTMLFormElement>(null)

  const [pageType, setPageType] = useState<'halaman' | 'pdf' | 'kartu'>(initialData?.type || 'halaman')
  const [showImageField, setShowImageField] = useState(!!initialData?.image)

  // State for menu linkage check - now checks all page types
  const [selectedMenuId, setSelectedMenuId] = useState<string>(initialData?.menu_id || "")
  const [existingPage, setExistingPage] = useState<{
    hasPages: boolean;
    pageCount: number;
    existingType: string;
    pages: { id: string; title: string; type: string }[];
    menu_title: string;
  } | null>(null)
  const [showTypeMismatchWarning, setShowTypeMismatchWarning] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  // Handle menu selection change
  const handleMenuChange = async (menuId: string) => {
    setSelectedMenuId(menuId)
    setShowTypeMismatchWarning(false)

    // Skip check if no menu selected
    if (!menuId) {
      setExistingPage(null)
      return
    }

    // Skip check if same menu as initial (editing existing page)
    if (menuId === initialData?.menu_id) {
      setExistingPage(null)
      return
    }

    // Check if menu already has any pages linked
    setIsChecking(true)
    try {
      const result = await checkMenuPageLink(menuId)
      if (result && result.hasPages) {
        // Menu already has pages - check if types match
        if (result.existingType !== pageType) {
          // Type mismatch - show warning, prevent selection
          setExistingPage(result)
          setShowTypeMismatchWarning(true)
        } else {
          // Same type - allow (for pdf/kartu which support multiple pages)
          setExistingPage(null)
          setShowTypeMismatchWarning(false)
        }
      } else {
        setExistingPage(null)
        setShowTypeMismatchWarning(false)
      }
    } catch (error) {
      console.error("Error checking menu link:", error)
      setExistingPage(null)
      setShowTypeMismatchWarning(false)
    } finally {
      setIsChecking(false)
    }
  }

  const handlePageTypeChange = async (val: string) => {
    const newType = val as 'halaman' | 'pdf' | 'kartu'
    setPageType(newType)
    setShowTypeMismatchWarning(false)

    if (selectedMenuId && selectedMenuId !== initialData?.menu_id) {
      setIsChecking(true)
      try {
        const result = await checkMenuPageLink(selectedMenuId)
        if (result && result.hasPages) {
          if (result.existingType !== newType) {
            setExistingPage(result)
            setShowTypeMismatchWarning(true)
          } else {
            setExistingPage(null)
          }
        }
      } catch (error) {
        console.error("Error checking menu link:", error)
      } finally {
        setIsChecking(false)
      }
    }
  }

  const handleResetMenuSelection = () => {
    setShowTypeMismatchWarning(false)
    setExistingPage(null)
    setSelectedMenuId("")
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

  return (
    <>
      <form ref={formRef} action={formAction} className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="menu_id">Menu</Label>
            <Select
              name="menu_id"
              value={selectedMenuId}
              onValueChange={handleMenuChange}
              disabled={isChecking}
            >
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
            {showTypeMismatchWarning && existingPage && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Perhatian: Menu ini sudah memiliki halaman dengan tipe "{existingPage.existingType}" ({existingPage.pageCount} halaman). Tidak boleh mencampur tipe halaman. Silakan pilih menu lain.
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Tipe Halaman</Label>
            <Select
              value={pageType}
              onValueChange={handlePageTypeChange}
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

        {/* Hidden field for force_replace */}
        <input type="hidden" name="force_replace" id="force_replace_input" value="false" />

        {/* Type mismatch warning */}
        {showTypeMismatchWarning && existingPage && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300 font-medium">
             Tidak dapat menyimpan: Menu ini sudah memiliki halaman dengan tipe "{existingPage.existingType}"
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              Menu hanya boleh memiliki satu tipe halaman. Silakan pilih menu lain atau gunakan tipe yang sama.
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Button 
            type="submit" 
            disabled={isPending || isChecking || showTypeMismatchWarning} 
            className="w-full"
          >
            {isPending ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Buat Halaman"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>
    </>
  )
}
