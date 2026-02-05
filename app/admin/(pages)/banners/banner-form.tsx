'use client'

import { useState, useEffect } from "react"
import { Banner } from "@/types/banner-prop"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Image as ImageIcon, Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { useFormStatus } from "react-dom"
import { useBaseUrl } from "@/hooks/use-base-url"

interface BannerFormProps {
    initialData?: Banner
    action: (prevState: any, formData: FormData) => Promise<any>
}

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto px-10 font-bold">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                </>
            ) : label}
        </Button>
    )
}

export function BannerForm({ initialData, action }: BannerFormProps) {
    const [preview, setPreview] = useState<string | null>(null)
    const [isPublish, setIsPublish] = useState(initialData?.is_publish ?? true)
    const [error, setError] = useState<string | null>(null)

    const baseUrl = useBaseUrl()

    useEffect(() => {
        if (initialData?.image_path) {
            setPreview(`${baseUrl}${initialData.image_path}`)
        }
    }, [initialData, baseUrl])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const clientAction = async (formData: FormData) => {
        formData.set('is_publish', String(isPublish))
        const result = await action(null, formData)
        if (result?.error) {
            setError(result.error)
        }
    }

    return (
        <form action={clientAction} className="space-y-8">
            <Card className="overflow-hidden border-2 border-dashed border-muted-foreground/20 bg-muted/30">
                <CardContent className="p-0">
                    <div className="relative aspect-[21/9] w-full group">
                        {preview ? (
                            <>
                                <Image
                                    src={preview}
                                    alt="Preview"
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <label htmlFor="image" className="cursor-pointer bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 border border-white/30 transition-all">
                                        <Upload className="w-4 h-4" />
                                        Ganti Gambar
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
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                            required={!initialData}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Deskripsi (Opsional)</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Masukkan pesan atau deskripsi singkat yang akan muncul di banner..."
                            className="min-h-[120px] resize-none focus-visible:ring-primary"
                            defaultValue={initialData?.description}
                        />
                    </div>
                </div>

                <div className="space-y-6 bg-muted/30 p-6 rounded-2xl border border-border/50 h-fit">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Status Banner</Label>
                            <p className="text-xs text-muted-foreground">Tentukan apakah banner ini akan langsung tampil.</p>
                        </div>
                        <Switch
                            checked={isPublish}
                            onCheckedChange={setIsPublish}
                        />
                    </div>

                    <div className="pt-4 border-t border-border">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs flex items-center gap-2">
                                <X className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}
                        <SubmitButton label={initialData ? "Simpan Perubahan" : "Terbitkan Banner"} />
                    </div>
                </div>
            </div>
        </form>
    )
}
