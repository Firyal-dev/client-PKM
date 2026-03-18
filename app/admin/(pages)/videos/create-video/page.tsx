'use client'

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload, Link as LinkIcon, Film, ChevronLeft, X } from "lucide-react"
import { toast } from "sonner"
import { useImagePreview } from "@/hooks/use-photo-preview"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel } from "@/components/ui/field"
import { createVideoAction } from "@/services/video/video-service"
import Link from "next/link"
import { PageHeader } from "@/components/admin/page-header"
import { cn } from "@/lib/utils"
import { getYouTubeEmbedUrl } from "@/lib/video-utils"

export default function CreateVideoPage() {
    const router = useRouter()
    const [isEmbed, setIsEmbed] = useState(false)
    const [embedUrl, setEmbedUrl] = useState("")
    const [state, formAction, isPending] = useActionState(createVideoAction, null)
    const { previewUrl, handleFileChange, resetPreview } = useImagePreview()

    useEffect(() => {
        if (state?.success) {
            toast.success("Video berhasil dibuat")
            resetPreview()
            router.push('/admin/videos')
            router.refresh()
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state, router])

    // Reset state when switching mode
    const handleModeSwitch = (embed: boolean) => {
        setIsEmbed(embed)
        if (embed) resetPreview()
        else setEmbedUrl("")
    }

    // Determine what to show in preview
    const previewSrc = isEmbed ? embedUrl : previewUrl

    return (
        <div className="px-5 pb-10">
            <PageHeader title="Tambah Video" description="Tambah video baru ke website">
                <Link href="/admin/videos">
                    <Button variant="outline" className="gap-2 rounded-xl">
                        <ChevronLeft className="w-4 h-4" /> Kembali
                    </Button>
                </Link>
            </PageHeader>

            <form action={formAction} className="mt-6 max-w-5xl">
                <input type="hidden" name="is_embed" value={isEmbed ? "true" : "false"} />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                    {/* ── Left column: form fields (3/5) ── */}
                    <div className="lg:col-span-3 space-y-4">

                        {/* Video source toggle */}
                        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sumber Video</p>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleModeSwitch(false)}
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
                                    onClick={() => handleModeSwitch(true)}
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
                                    ? "Tempel tautan dari YouTube."
                                    : "Unggah file video langsung (MP4, WebM, AVI)."}
                            </p>
                        </div>

                        {/* Video info */}
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

                        {/* Upload or Embed input */}
                        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {isEmbed ? "Tautan Embed" : "File Video"}
                            </p>

                            {isEmbed ? (
                                <Field className="space-y-1.5">
                                    <FieldLabel htmlFor="embed_url" className="text-sm font-medium">URL YouTube</FieldLabel>
                                    <Input
                                        id="embed_url"
                                        name="embed_url"
                                        placeholder="https://www.youtube.com/embed/xxxxx"
                                        required={isEmbed}
                                        value={embedUrl}
                                        onChange={(e) => setEmbedUrl(e.target.value)}
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
                                        onChange={handleFileChange}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* ── Right column: preview + save (2/5) ── */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* Save card */}
                        <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Simpan</p>
                            <p className="text-xs text-muted-foreground/70 leading-relaxed">
                                Video akan ditambahkan ke daftar konten website.
                            </p>
                            <Button type="submit" disabled={isPending} className="w-full rounded-xl font-semibold">
                                {isPending ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
                                ) : "Simpan Video"}
                            </Button>
                        </div>

                        {/* Preview card */}
                        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preview</p>

                            <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                                {previewSrc ? (
                                    <>
                                        {isEmbed ? (
                                            <iframe
                                                src={getYouTubeEmbedUrl(embedUrl)}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <video
                                                key={previewUrl}
                                                src={previewUrl!}
                                                controls
                                                className="w-full h-full"
                                            />
                                        )}

                                        {/* Reset button — only for uploaded file */}
                                        {!isEmbed && (
                                            <button
                                                type="button"
                                                onClick={resetPreview}
                                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors z-10"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground/40 select-none py-8">
                                        <Film className="w-8 h-8" />
                                        <p className="text-xs">
                                            {isEmbed ? "Masukkan URL untuk preview" : "Pilih file untuk preview"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    )
}