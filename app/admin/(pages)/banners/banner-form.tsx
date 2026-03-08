'use client'

import { useState, useEffect, useActionState } from "react"
import { Banner } from "@/types/banner-prop"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Image as ImageIcon, Upload, Loader2, Eye, EyeOff, ImagePlus } from "lucide-react"
import Image from "next/image"
import { getMediaUrl } from "@/lib/getMediaUrl"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useImagePreview } from "@/hooks/use-photo-preview"
import { cn } from "@/lib/utils"

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
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="is_publish" value={String(isPublish)} />
            {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

            {/* Image Upload */}
            <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden border border-border/60 bg-muted/30 group">
                {displayImage ? (
                    <>
                        <Image src={displayImage} alt="Preview" fill unoptimized className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <label htmlFor="image" className="cursor-pointer flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-sm font-medium px-5 py-2.5 rounded-full border border-white/25 transition-all">
                                <Upload className="w-4 h-4" />
                                Ganti Gambar
                            </label>
                        </div>
                    </>
                ) : (
                    <label htmlFor="image" className="flex flex-col items-center justify-center h-full cursor-pointer transition-colors hover:bg-muted/50">
                        <div className="flex flex-col items-center gap-3 text-center px-4">
                            <div className="p-4 rounded-2xl bg-primary/8 border border-primary/15 group-hover:scale-105 transition-transform duration-200">
                                <ImagePlus className="w-8 h-8 text-primary/50" />
                            </div>
                            <div>
                                <p className="font-semibold text-foreground/70 text-sm">Klik untuk upload gambar</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Disarankan 1920×820px · Rasio 21:9</p>
                            </div>
                        </div>
                    </label>
                )}
                <input type="file" id="image" name="image" accept="image/*" className="hidden" onChange={handleFileChange} required={!initialData} />
            </div>

            {/* Fields + Sidebar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Left: Inputs */}
                <div className="md:col-span-2 space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Judul Banner
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Masukkan judul banner..."
                            className="rounded-xl focus-visible:ring-primary/50"
                            defaultValue={initialData?.title}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Deskripsi <span className="normal-case font-normal text-muted-foreground/60">(opsional)</span>
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Masukkan pesan atau deskripsi singkat..."
                            className="min-h-[110px] resize-none rounded-xl focus-visible:ring-primary/50"
                            defaultValue={initialData?.description}
                        />
                    </div>
                </div>

                {/* Right: Sidebar */}
                <div className="space-y-4 bg-muted/30 border border-border/60 rounded-2xl p-4 h-fit">
                    {/* Publish toggle */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</p>
                            <p className="text-xs text-muted-foreground/70 leading-relaxed">
                                {isPublish ? "Banner akan langsung tampil." : "Banner disimpan sebagai draft."}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 pt-0.5">
                            <span className={cn(
                                "text-xs font-medium transition-colors",
                                isPublish ? "text-green-500" : "text-muted-foreground/50"
                            )}>
                                {isPublish ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                            </span>
                            <Switch
                                checked={isPublish}
                                onCheckedChange={setIsPublish}
                                className="data-[state=checked]:bg-green-500"
                            />
                        </div>
                    </div>

                    <div className="border-t border-border/50 pt-4">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full font-semibold rounded-xl"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : initialData ? "Simpan Perubahan" : "Terbitkan Banner"}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}