"use client"

import { useState, useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ImageIcon, Plus, X, FileText, Download, LayoutGrid, BookOpen, Info } from "lucide-react"
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
import { cn } from "@/lib/utils"
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
  
  // State Utama
  const [layout, setLayout] = useState(initialData?.layout || "artikel")
  const [showImageField, setShowImageField] = useState(!!initialData?.image)
  const [showFileField, setShowFileField] = useState(!!initialData?.file)

  useEffect(() => {
    if (state?.success) {
      toast.success(initialData ? "Halaman diperbarui!" : "Halaman dibuat!")
      router.push("/admin/pages")
      router.refresh()
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state, initialData, router])

  return (
    <form action={formAction} className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: KONFIGURASI UTAMA */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-blue-600" />
              Konfigurasi
            </h3>

            {/* Menu Terkait */}
            <div className="grid gap-2">
              <Label htmlFor="menu_id" className="text-sm font-semibold">Menu Terkait</Label>
              <Select name="menu_id" defaultValue={initialData?.menu_id || undefined}>
                <SelectTrigger className="w-full h-11 rounded-xl">
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

            {/* Layout Selection */}
            <div className="grid gap-2">
              <Label htmlFor="layout" className="text-sm font-semibold">Layout Tampilan</Label>
              <Select
                value={layout}
                onValueChange={(val) => setLayout(val)}
              >
                <SelectTrigger className="w-full h-11 rounded-xl">
                  <SelectValue placeholder="Pilih layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="artikel">Artikel (Satu Kolom)</SelectItem>
                  <SelectItem value="cards">Kartu (Grid Beranda)</SelectItem>
                  <SelectItem value="list">Dokumen (List Download)</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="layout" id="layout_input" value={layout} />
            </div>

            {/* Status Publikasi */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <div className="grid gap-1">
                <Label htmlFor="status" className="font-bold">Status Aktif</Label>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Muncul di website</p>
              </div>
              <Switch
                id="status"
                name="status"
                defaultChecked={initialData?.status !== 0}
              />
            </div>
          </div>

          {/* TIPS DINAMIS */}
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="grid gap-2">
                <p className="text-sm font-bold text-blue-900">Info Layout {layout === 'cards' ? 'Kartu' : layout === 'list' ? 'Dokumen' : 'Artikel'}</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  {layout === 'cards' && "Gunakan layout ini untuk menampilkan link layanan di halaman beranda. Masukkan deskripsi singkat agar menarik."}
                  {layout === 'list' && "Cukup upload file PDF saja. Judul halaman akan otomatis diambil dari nama file dokumen yang Anda upload."}
                  {layout === 'artikel' && "Layout standar untuk konten edukasi atau informasi publik satu kolom."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: INPUT KONTEN DYNAMIS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[600px] space-y-8">
            
            {/* 1. INPUT TITLE - Sembunyikan jika Dokumen (Auto) */}
            {layout !== 'list' && (
              <div className="grid gap-2 animate-in slide-in-from-top-2 duration-500">
                <Label htmlFor="title" className="text-lg font-black text-slate-900 tracking-tight uppercase">Judul Halaman</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Masukkan judul halaman..."
                  defaultValue={initialData?.title}
                  className="h-14 text-xl font-bold border-none bg-slate-50 rounded-2xl px-6 focus:ring-4 focus:ring-blue-100 transition-all"
                  required={layout !== 'list'}
                />
              </div>
            )}

            {/* 2. INPUT DESCRIPTION - Hanya untuk Kartu */}
            {layout === 'cards' && (
              <div className="grid gap-2 animate-in slide-in-from-top-2 duration-500">
                <Label htmlFor="description" className="text-sm font-bold text-slate-500 uppercase tracking-widest">Deskripsi Singkat (Preview Card)</Label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={initialData?.description}
                  placeholder="Ringkasan singkat tentang layanan atau informasi ini..."
                  className="w-full min-h-[100px] p-5 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-blue-100 transition-all text-slate-700 font-medium leading-relaxed"
                />
              </div>
            )}

            {/* 3. INPUT FOTO - Hanya untuk Kartu & Artikel */}
            {layout !== 'list' && (
              <div className="grid gap-4 animate-in slide-in-from-top-2 duration-500">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Foto Utama
                  </Label>
                  <Switch checked={showImageField} onCheckedChange={setShowImageField} />
                </div>
                
                {showImageField && (
                  <div className="p-6 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 space-y-4">
                    {initialData?.image && (
                      <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-inner bg-white border">
                        <Image src={getMediaUrl(initialData.image) || ""} alt="Current Preview" fill className="object-cover" />
                      </div>
                    )}
                    <div className="grid gap-2">
                      <p className="text-[11px] font-bold text-slate-400 mb-1">Pilih File Gambar (JPG, PNG, WEBP)</p>
                      <Input type="file" name="image" accept="image/*" className="bg-white rounded-xl h-11 py-2 cursor-pointer" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. INPUT FILE PDF - Hanya untuk Dokumen */}
            {layout === 'list' && (
              <div className="grid gap-6 animate-in zoom-in-95 duration-500 py-10">
                <div className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-blue-100 rounded-[3rem] bg-blue-50/30 text-center space-y-6">
                  <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-200">
                    <FileText className="w-12 h-12 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-slate-900">Upload Dokumen PDF</h4>
                    <p className="text-slate-500 max-w-[300px] mx-auto">Judul halaman akan otomatis diambil dari nama file yang Anda pilih.</p>
                  </div>
                  <div className="w-full max-w-sm">
                    <Input 
                      type="file" 
                      name="file" 
                      accept=".pdf" 
                      required={!initialData?.file} 
                      className="h-14 rounded-2xl border-none shadow-lg bg-white p-4 cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-blue-50 file:text-blue-700"
                    />
                  </div>
                  {initialData?.file && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                      <Download className="w-3 h-3" />
                      File sudah terupload: {initialData.file.split('/').pop()}
                    </div>
                  )}
                </div>
                {/* Judul Hidden - Biar Server yang handle auto-title */}
                <input type="hidden" name="title" value={initialData?.title || ""} />
              </div>
            )}

            {/* 5. RICH TEXT EDITOR - Untuk Kartu & Artikel */}
            {layout !== 'list' && (
              <div className="grid gap-3 animate-in fade-in duration-700">
                <Label htmlFor="content" className="text-sm font-bold text-slate-500 uppercase tracking-widest">Isi Konten Utama</Label>
                <div className="min-h-[400px] border border-slate-100 rounded-[2rem] overflow-hidden focus-within:ring-4 focus-within:ring-blue-100 transition-all shadow-sm">
                  <RichEditor
                    name="content"
                    id="content"
                    defaultValue={initialData?.content || ""}
                  />
                </div>
              </div>
            )}

            {/* Hidden Content jika Dokumen */}
            {layout === 'list' && (
              <input type="hidden" name="content" value={initialData?.content || "-"} />
            )}
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="sticky bottom-6 left-0 w-full animate-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white/80 backdrop-blur-xl p-4 rounded-[2rem] shadow-2xl border border-white/50 flex gap-4 max-w-2xl mx-auto">
          <Button 
            type="submit" 
            disabled={isPending} 
            className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 text-lg font-black tracking-tight"
          >
            {isPending ? "Sedang Memproses..." : initialData ? "Simpan Perubahan" : "Terbitkan Halaman"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="h-14 px-8 rounded-2xl font-bold border-slate-200"
            onClick={() => router.back()}
          >
            Batal
          </Button>
        </div>
      </div>
    </form>
  )
}
