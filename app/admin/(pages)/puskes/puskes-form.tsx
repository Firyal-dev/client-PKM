'use client'

import { useEffect, useActionState, useState } from "react"
import { Puskesmas } from "@/services/puskesmas/puskesmas-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Image as ImageIcon, Upload, Loader2, Save, Building2 } from "lucide-react"
import Image from "next/image"
import { getMediaUrl } from "@/lib/getMediaUrl"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useImagePreview } from "@/hooks/use-photo-preview"

interface PuskesmasFormProps {
    initialData?: Puskesmas
    action: (prevState: any, formData: FormData) => Promise<any>
}

export function PuskesmasForm({ initialData, action }: PuskesmasFormProps) {
    const router = useRouter()
    const { previewUrl, handleFileChange } = useImagePreview()
    const [status, setStatus] = useState<string>(initialData?.status || 'ACTIVE')
    const [state, formAction, isPending] = useActionState(action, null)

    const displayLogo = previewUrl || (initialData?.logo_path ? getMediaUrl(initialData.logo_path) : null)

    useEffect(() => {
        if (state?.success) {
            toast.success(initialData ? "Puskes diperbarui" : "Puskes ditambahkan")
            router.push('/admin/puskes')
            router.refresh()
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state, initialData, router])

    return (
        <form action={formAction} className="space-y-8">
            {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

            <div className="grid md:grid-cols-2 gap-6">
                {/* General Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            Informasi Dasar
                        </CardTitle>
                        <CardDescription>Nama dan identitas puskes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Puskesmas</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Contoh: Puskesmas Sehat Selalu"
                                defaultValue={initialData?.name}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (URL)</Label>
                            <Input
                                id="slug"
                                name="slug"
                                placeholder="Contoh: sehat-selalu"
                                defaultValue={initialData?.slug}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Slug digunakan untuk URL akses website (contoh: domain.com/puskes/sehat-selalu)
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="alamat">Alamat</Label>
                            <Textarea
                                id="alamat"
                                name="alamat"
                                placeholder="Masukkan alamat lengkap puskes..."
                                defaultValue={initialData?.alamat}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <input type="hidden" name="status" value={status} />
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Aktif</SelectItem>
                                    <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                                    <SelectItem value="SUSPENDED">Ditangguhkan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Logo & Visual */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5" />
                            Logo & Warna
                        </CardTitle>
                        <CardDescription>Identitas visual puskes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Logo Puskesmas</Label>
                            <div className="relative aspect-square w-32 h-32 mx-auto group cursor-pointer border-2 border-dashed rounded-lg overflow-hidden">
                                {displayLogo ? (
                                    <>
                                        <Image src={displayLogo} alt="Logo Preview" fill unoptimized className="object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <label htmlFor="logo" className="cursor-pointer">
                                                <Upload className="w-6 h-6 text-white" />
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <label htmlFor="logo" className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-muted/50 transition-colors">
                                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground mt-1">Upload</span>
                                    </label>
                                )}
                                <input
                                    type="file"
                                    id="logo"
                                    name="logo"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground text-center">
                                Format: JPG, JPEG, PNG (Maks. 3MB)
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="primary_color">Warna Utama</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="primary_color"
                                    name="primary_color"
                                    type="color"
                                    className="w-16 h-10 p-1"
                                    defaultValue={initialData?.primary_color || "#3b82f6"}
                                />
                                <Input
                                    placeholder="#3b82f6"
                                    defaultValue={initialData?.primary_color || "#3b82f6"}
                                    className="flex-1"
                                    onChange={(e) => {
                                        const colorInput = document.getElementById('primary_color') as HTMLInputElement
                                        if (colorInput) colorInput.value = e.target.value
                                    }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Warna utama用于主题和品牌
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" disabled={isPending} className="px-8">
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            {initialData ? 'Perbarui' : 'Simpan'}
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
