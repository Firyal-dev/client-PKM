'use client'

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload, ImageIcon, X } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { getMediaUrl } from "@/lib/getMediaUrl"
import { Berita } from "@/types/berita-prop"
import { useImagePreview } from "@/hooks/use-photo-preview"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { kategoriBerita } from "@/constants/kategori-berita"
import { RichEditor } from "@/components/admin/rich-editor"

interface NewsFormProps {
    initialData?: Berita
    action: (prevState: any, formData: FormData) => Promise<any>
}

export function NewsForm({ initialData, action }: NewsFormProps) {
    const router = useRouter()
    const { previewUrl, handleFileChange, resetPreview } = useImagePreview();

    const [state, formAction, isPending] = useActionState(action, null)
    const displayImage = previewUrl || (initialData?.image ? getMediaUrl(initialData.image) : null)

    useEffect(() => {
        if (state?.success) {
            toast.success(initialData ? "Berita berhasil diperbarui" : "Berita berhasil dibuat")
            router.push('/admin/news')
            router.refresh()
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state, initialData, router])

    return (
        <Card className="shadow-md rounded-2xl">
            <CardContent className="p-6 md:p-8">
                <form action={formAction} className="space-y-6">

                    {/* Image Upload Area */}
                    <Card className="overflow-hidden border-2 border-dashed border-muted-foreground/20 bg-muted/30">
                        <CardContent className="p-0">
                            <div className="relative aspect-[16/9] w-full group">
                                {displayImage ? (
                                    <>
                                        <Button variant="destructive" onClick={resetPreview} className="z-10 absolute top-2 right-2">
                                            <X className="w-4 h-4" />
                                        </Button>
                                        <Image src={displayImage} alt="Preview" fill unoptimized className="object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <label htmlFor="image" className="cursor-pointer bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 border border-white/30 transition-all">
                                                <Upload className="w-4 h-4" /> Ganti Gambar
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <label htmlFor="image" className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-muted/50 transition-colors">
                                        <div className="p-4 rounded-full bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
                                            <ImageIcon className="w-10 h-10 text-primary" />
                                        </div>
                                        <span className="text-lg font-bold">Upload Gambar Berita</span>
                                    </label>
                                )}
                                <input type="file" id="image" name="image" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </div>
                        </CardContent>
                    </Card>

                    <FieldGroup>
                        <Field className="space-y-2 pt-4">
                            <FieldLabel htmlFor="category">Kategori</FieldLabel>
                            <Select name="category" defaultValue={initialData?.category?.toString()}>
                                <SelectTrigger className="h-12 bg-slate-50/50">
                                    <SelectValue placeholder="Pilih Kategori Berita" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kategoriBerita.map((item) => (
                                        <SelectItem key={item.id} value={item.name}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field className="space-y-2">
                            <FieldLabel htmlFor="title">Judul Berita</FieldLabel>
                            <Input id="title" name="title" defaultValue={initialData?.title} placeholder="Contoh: Puskesmas Mengadakan Vaksinasi Massal" required className="h-12 bg-slate-50/50" />
                        </Field>

                        <Field className="space-y-2 pt-4">
                            <FieldLabel htmlFor="content">Konten Berita</FieldLabel>
                            <RichEditor
                                id="content"
                                name="content"
                                defaultValue={initialData?.content}
                                placeholder="Tuliskan isi berita di sini..."
                                className="bg-slate-50/50"
                            />
                        </Field>
                    </FieldGroup>

                    <div className="flex justify-end border-slate-100 pt-4">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                initialData ? "Perbarui Berita" : "Simpan Berita"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}