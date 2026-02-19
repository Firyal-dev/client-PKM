'use client'

import { useState, useEffect, useActionState } from "react"
import { Banner } from "@/types/banner-prop"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Image as ImageIcon, Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { getMediaUrl } from "@/lib/getMediaUrl"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useImagePreview } from "@/hooks/use-photo-preview"

interface BannerFormProps {
    initialData?: Banner
    action: (prevState: any, formData: FormData) => Promise<any>
}

export function BannerForm({ initialData, action }: BannerFormProps) {
    const router = useRouter()
    const { previewUrl, handleFileChange } = useImagePreview()
    const [isPublish, setIsPublish] = useState(initialData?.is_publish ?? true)
    const [state, formAction, isPending] = useActionState(action, null)

    const displayImage = previewUrl || (initialData?.image_path ? getMediaUrl(initialData.image_path) : null)

    useEffect(() => {
        if (state?.success) {
            toast.success(initialData ? "Banner diperbarui" : "Banner diterbitkan")
            router.push('/admin/banner')
            router.refresh()
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state, initialData, router])

    return (
        <form action={formAction} className="space-y-8">
            <input type="hidden" name="is_publish" value={String(isPublish)} />
            {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

            <Card className="overflow-hidden border-2 border-dashed border-muted-foreground/20 bg-muted/30">
                <CardContent className="p-0">
                    <div className="relative aspect-[21/9] w-full group">
                        {displayImage ? (
                            <>
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
                                <span className="text-lg font-bold">Upload Gambar Banner</span>
                                <span className="text-sm text-muted-foreground mt-1 text-center max-w-xs">
                                    Disarankan ukuran 1920x820 pixel (Rasio 21:9) untuk hasil terbaik.
                                </span>
                            </label>
                        )}
                        <input type="file" id="image" name="image" accept="image/*" className="hidden" onChange={handleFileChange} required={!initialData} />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Judul</Label>
                        <Input id="title" name="title" placeholder="Masukkan judul banner..." className="focus-visible:ring-primary" defaultValue={initialData?.title} required />
                        
                        <Label htmlFor="description" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Deskripsi (Opsional)</Label>
                        <Textarea id="description" name="description" placeholder="Masukkan pesan atau deskripsi singkat..." className="min-h-[120px] resize-none focus-visible:ring-primary" defaultValue={initialData?.description} />
                    </div>
                </div>

                <div className="space-y-6 bg-muted/30 p-6 rounded-2xl border border-border/50 h-fit">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Status Banner</Label>
                            <p className="text-xs text-muted-foreground">Tentukan apakah banner ini akan langsung tampil.</p>
                        </div>
                        <Switch checked={isPublish} onCheckedChange={setIsPublish} />
                    </div>

                    <div className="pt-4 border-t border-border">
                        {/* 4. Gunakan isPending di Tombol Submit */}
                        <Button type="submit" disabled={isPending} className="w-full sm:w-auto px-10 font-bold">
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                initialData ? "Simpan Perubahan" : "Terbitkan Banner"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}