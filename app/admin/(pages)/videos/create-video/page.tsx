'use client'

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload, Link as LinkIcon, Film, ChevronLeft } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { createVideoAction } from "@/services/video/video-service"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { PageHeader } from "@/components/admin/page-header"
import { cn } from "@/lib/utils"

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
            <PageHeader title="Tambah Video" description="Tambah video baru ke website">
                <Link href="/admin/videos">
                    <Button variant="outline" className="gap-2 rounded-xl">
                        <ChevronLeft className="w-4 h-4" /> Kembali
                    </Button>
                </Link>
            </PageHeader>

            <form action={formAction} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl">
                <input type="hidden" name="is_embed" value={isEmbed ? "true" : "false"} />

                {/* Main fields */}
                <div className="md:col-span-2 space-y-4">

                    {/* Video type toggle */}
                    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sumber Video</p>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setIsEmbed(false)}
                                className={cn(
                                    "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
                                    !isEmbed
                                        ? "border-primary/40 bg-primary/8 text-primary"
                                        : "border-border/50 text-muted-foreground hover:bg-muted/50"
                                )}
                            >
                                <Upload className="h-4 w-4 shrink-0" />
                                Upload File
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEmbed(true)}
                                className={cn(
                                    "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
                                    isEmbed
                                        ? "border-primary/40 bg-primary/8 text-primary"
                                        : "border-border/50 text-muted-foreground hover:bg-muted/50"
                                )}
                            >
                                <LinkIcon className="h-4 w-4 shrink-0" />
                                Embed URL
                            </button>
                        </div>

                        <p className="text-xs text-muted-foreground/70">
                            {isEmbed
                                ? "Tempel tautan dari YouTube atau Vimeo."
                                : "Unggah file video langsung (MP4, WebM, AVI)."}
                        </p>
                    </div>

                    {/* Info kegiatan */}
                    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Informasi Video</p>

                        <Field className="space-y-1.5">
                            <FieldLabel htmlFor="video_title" className="text-sm font-medium">Judul Video</FieldLabel>
                            <Input
                                id="video_title"
                                name="video_title"
                                placeholder="Contoh: Layanan Kesehatan Puskesmas"
                                required
                                className="rounded-xl h-10"
                            />
                        </Field>

                        <Field className="space-y-1.5">
                            <FieldLabel htmlFor="video_desc" className="text-sm font-medium">
                                Deskripsi <span className="font-normal text-muted-foreground/60">(opsional)</span>
                            </FieldLabel>
                            <Textarea
                                id="video_desc"
                                name="video_desc"
                                placeholder="Tuliskan deskripsi video di sini..."
                                className="rounded-xl min-h-[90px] resize-none"
                            />
                        </Field>
                    </div>

                    {/* Upload / Embed */}
                    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {isEmbed ? "Tautan Embed" : "File Video"}
                        </p>

                        {isEmbed ? (
                            <Field className="space-y-1.5">
                                <FieldLabel htmlFor="embed_url" className="text-sm font-medium">URL YouTube / Vimeo</FieldLabel>
                                <Input
                                    id="embed_url"
                                    name="embed_url"
                                    placeholder="https://www.youtube.com/embed/xxxxx"
                                    required={isEmbed}
                                    className="rounded-xl h-10 font-mono text-sm"
                                />
                            </Field>
                        ) : (
                            <label
                                htmlFor="video_file"
                                className="flex flex-col items-center justify-center gap-3 aspect-video w-full rounded-xl border border-dashed border-border/60 bg-muted/10 cursor-pointer hover:bg-muted/30 transition-colors group"
                            >
                                <div className="p-3.5 rounded-2xl bg-primary/8 border border-primary/15 group-hover:scale-105 transition-transform duration-200">
                                    <Film className="w-7 h-7 text-primary/50" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-foreground/60">Klik untuk pilih file video</p>
                                    <p className="text-xs text-muted-foreground/50 mt-0.5">MP4, WebM, atau AVI</p>
                                </div>
                                <input
                                    type="file"
                                    id="video_file"
                                    name="video_file"
                                    accept="video/*"
                                    required={!isEmbed}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-3 h-fit">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Simpan</p>
                        <p className="text-xs text-muted-foreground/70 leading-relaxed">
                            Video akan ditambahkan ke daftar konten website.
                        </p>
                        <div className="pt-1">
                            <Button type="submit" disabled={isPending} className="w-full rounded-xl font-semibold">
                                {isPending ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
                                ) : "Simpan Video"}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}