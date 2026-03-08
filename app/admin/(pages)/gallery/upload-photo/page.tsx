'use client'

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ImagePlus, X, Upload } from "lucide-react"
import { useActionState, useEffect, useRef } from 'react'
import { uploadPhotoAction } from '@/services/gallery/gallery-service'
import { useImagePreview } from '@/hooks/use-photo-preview'
import { CustomLink } from '@/components/ui/link'
import { toast } from 'sonner'
import { useRouter } from "next/navigation"

export default function UploadPhotoPage() {
    const [state, formAction, isPending] = useActionState(uploadPhotoAction, null)
    const { previewUrl, handleFileChange, resetPreview } = useImagePreview()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    useEffect(() => {
        if (state?.success) {
            toast.success("Foto berhasil diunggah!")
            router.push('/admin/gallery')
            router.refresh()
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state, router])

    return (
        <div className="px-5 pb-10">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Tambah Foto</h1>
                <p className="text-sm text-muted-foreground mt-1">Upload foto baru ke galeri</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-5">

                {/* ── Form ── */}
                <div className="flex-1 rounded-xl border border-border bg-muted/30 p-5">
                    <form action={formAction} className="space-y-5">

                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-medium">Judul Foto</Label>
                            <Input
                                id="title"
                                name="image_title"
                                type="text"
                                placeholder="Masukkan judul foto"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">File Foto</Label>
                            <div
                                className="relative border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-foreground/30 hover:bg-muted/40 transition-colors text-center"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                    <Upload className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">Klik untuk pilih foto</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, JPEG — maks. 2MB</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    required
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {previewUrl && (
                                <p className="text-xs text-emerald-500 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                                    Foto dipilih
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="desc" className="text-sm font-medium">Deskripsi</Label>
                            <Textarea
                                id="desc"
                                name="description"
                                placeholder="Tuliskan deskripsi singkat foto ini..."
                                className="min-h-[100px] resize-none"
                            />
                        </div>

                        {state?.error && (
                            <p className="text-xs text-destructive">{state.error}</p>
                        )}

                        <div className="flex gap-3 pt-2 border-t border-border">
                            <Button type="submit" disabled={isPending} className="flex-1 h-10 font-medium">
                                {isPending ? "Mengupload..." : "Upload Foto"}
                            </Button>
                            <CustomLink href="/admin/gallery" variant="outline" className="h-10 px-5">
                                Batal
                            </CustomLink>
                        </div>
                    </form>
                </div>

                {/* ── Preview ── */}
                <div className="flex-1 rounded-xl border border-border bg-muted/30 overflow-hidden min-h-[400px] flex items-center justify-center relative">
                    {previewUrl ? (
                        <>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-full object-contain max-h-[500px] p-4"
                            />
                            <button
                                type="button"
                                onClick={resetPreview}
                                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-muted-foreground/50 select-none">
                            <ImagePlus className="w-10 h-10" />
                            <div className="text-center">
                                <p className="text-sm font-medium">Preview</p>
                                <p className="text-xs mt-0.5">Foto akan tampil di sini</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}