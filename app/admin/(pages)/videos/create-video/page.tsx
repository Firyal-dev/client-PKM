'use client'

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload, Link as LinkIcon, Film } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { createVideoAction } from "@/services/video/video-service"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { PageHeader } from "@/components/admin/page-header"

export default function CreateVideoPage() {
    const router = useRouter()
    const [isEmbed, setIsEmbed] = useState(false)
    const [state, formAction, isPending] = useActionState(createVideoAction, null)

    useEffect(() => {
        if (state?.success) {
            toast.success("Video berhasil dibuat")
            router.push('/admin/videos')
            router.refresh()
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state, router])

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Tambah Video"
                description="Tambah video baru ke website"
            >
                <Link href="/admin/videos">
                    <Button variant="outline" className="gap-2 rounded-xl">
                        <ChevronLeft className="w-4 h-4" /> Kembali
                    </Button>
                </Link>
            </PageHeader>

            <div className="mt-8 max-w-2xl">
                <Card className="shadow-md rounded-2xl">
                    <CardContent className="p-6 md:p-8">
                        <form action={formAction} className="space-y-6">
                            {/* Video Type Toggle */}
                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    {isEmbed ? (
                                        <LinkIcon className="h-5 w-5 text-primary" />
                                    ) : (
                                        <Film className="h-5 w-5 text-primary" />
                                    )}
                                    <div>
                                        <p className="font-medium">
                                            {isEmbed ? "Video Embed (YouTube/Vimeo)" : "Upload Video"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {isEmbed
                                                ? "Gunakan tautan video dari YouTube atau Vimeo"
                                                : "Unggah file video langsung"}
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    checked={isEmbed}
                                    onCheckedChange={setIsEmbed}
                                    name="is_embed"
                                    value={isEmbed ? "true" : "false"}
                                />
                                <input type="hidden" name="is_embed" value={isEmbed ? "true" : "false"} />
                            </div>

                            <FieldGroup>
                                <Field className="space-y-2">
                                    <FieldLabel htmlFor="video_title">Judul Video</FieldLabel>
                                    <Input
                                        id="video_title"
                                        name="video_title"
                                        placeholder="Contoh: Layanan Kesehatan Puskesmas"
                                        required
                                        className="h-12 bg-slate-50/50"
                                    />
                                </Field>

                                <Field className="space-y-2 pt-4">
                                    <FieldLabel htmlFor="video_desc">Deskripsi</FieldLabel>
                                    <Textarea
                                        id="video_desc"
                                        name="video_desc"
                                        placeholder="Tuliskan deskripsi video di sini..."
                                        className="bg-slate-50/50 min-h-[100px]"
                                    />
                                </Field>

                                {isEmbed ? (
                                    <Field className="space-y-2 pt-4">
                                        <FieldLabel htmlFor="embed_url">URL Video (YouTube/Vimeo)</FieldLabel>
                                        <Input
                                            id="embed_url"
                                            name="embed_url"
                                            placeholder="Contoh: https://www.youtube.com/embed/xxxxx"
                                            required={isEmbed}
                                            className="h-12 bg-slate-50/50"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Masukkan URL embed video (misalnya dari YouTube atau Vimeo)
                                        </p>
                                    </Field>
                                ) : (
                                    <Field className="space-y-2 pt-4">
                                        <FieldLabel>File Video</FieldLabel>
                                        <Card className="overflow-hidden border-2 border-dashed border-muted-foreground/20 bg-muted/30">
                                            <CardContent className="p-0">
                                                <div className="relative aspect-video w-full group">
                                                    <label htmlFor="video_file" className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-muted/50 transition-colors">
                                                        <div className="p-4 rounded-full bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
                                                            <Upload className="w-10 h-10 text-primary" />
                                                        </div>
                                                        <span className="text-lg font-bold">Upload Video</span>
                                                        <span className="text-sm text-muted-foreground mt-1">MP4, WebM, atau AVI</span>
                                                    </label>
                                                    <input
                                                        type="file"
                                                        id="video_file"
                                                        name="video_file"
                                                        accept="video/*"
                                                        required={!isEmbed}
                                                        className="hidden"
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Field>
                                )}
                            </FieldGroup>

                            <div className="flex justify-end border-slate-100 pt-4">
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        "Simpan Video"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
