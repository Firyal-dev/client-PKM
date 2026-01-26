'use client'

import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImagePlus, X } from "lucide-react"
import { useActionState } from 'react'
import { uploadPhoto } from '@/services/gallery/gallery-service'
import { useImagePreview } from '@/hooks/use-photo-preview'

export default function Page() {
    const [state, formAction, isPending] = useActionState(uploadPhoto, null)
    const { previewUrl, handleFileChange, resetPreview } = useImagePreview();

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4">
            <div className="flex-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Galeri</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={formAction} className="grid gap-6">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="title">Judul</FieldLabel>
                                    <Input id="title" name="image_title" type="text" placeholder="Masukkan judul foto" required />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="image">Pilih Foto</FieldLabel>
                                    <Input id="image" onChange={handleFileChange} name="image" type="file" required className="cursor-pointer" />
                                    <FieldDescription>
                                        Format: JPG, PNG atau JPEG (Maks. 2MB)
                                    </FieldDescription>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="desc">Deskripsi</FieldLabel>
                                    <Textarea id="desc" name="description" placeholder="Tuliskan deskripsi foto di sini..." className="min-h-[100px]" />
                                </Field>
                                {state?.error && (
                                    <p className="text-sm font-medium text-destructive text-center mb-2">{state.error}</p>
                                )}
                                <Button type="submit" disabled={isPending} className="w-full lg:w-max">
                                    {isPending ? "Memuat..." : "Unggah Sekarang"}
                                </Button>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <div className="flex-1">
                <Card className="h-full border-dashed flex flex-col items-center justify-center min-h-[400px] lg:min-h-full bg-muted/30 overflow-hidden relative">
                    {previewUrl ? (
                        <div className="relative w-full h-full flex items-center justify-center p-4">
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-4 right-4 z-10 rounded-full shadow-lg"
                                onClick={resetPreview}
                            >
                                <X className="w-4 h-4 cursor-pointer" />
                            </Button>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="max-w-full max-h-[500px] object-contain rounded-lg shadow-md"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-muted-foreground gap-4">
                            <div className="p-4 rounded-full bg-muted">
                                <ImagePlus className="w-12 h-12 opacity-50" />
                            </div>
                            <div className="text-center">
                                <p className="font-medium">Preview Foto</p>
                                <p className="text-sm opacity-70">Foto yang dipilih akan muncul di sini</p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}