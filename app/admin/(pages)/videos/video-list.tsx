'use client'

import { useState, useMemo, useTransition } from "react"
import { Trash2, Film, ExternalLink, Loader2, Clock } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { id as localeId } from "date-fns/locale"

import { Video, deleteVideoAction } from "@/services/video/video-service"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { SearchFilter } from "@/components/admin/SearchFilter"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getMediaUrl } from "@/lib/getMediaUrl"

import '@vidstack/react/player/styles/base.css'
import '@vidstack/react/player/styles/plyr/theme.css'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import { PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr'

export function VideoList({ videos }: { videos: Video[] }) {
    const [isPending, startTransition] = useTransition()
    const [globalFilter, setGlobalFilter] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")

    const filteredVideos = useMemo(() => {
        let result = [...videos]

        // Search filter
        if (globalFilter) {
            const search = globalFilter.toLowerCase()
            result = result.filter(v =>
                v.video_title?.toLowerCase().includes(search) ||
                v.video_desc?.toLowerCase().includes(search)
            )
        }

        // Type filter (embed/upload)
        if (typeFilter !== "all") {
            const isEmbed = typeFilter === "embed"
            result = result.filter(v => v.is_embed === isEmbed)
        }

        return result
    }, [videos, globalFilter, typeFilter])

    const hasFilter = !!globalFilter || typeFilter !== "all"

    const handleReset = () => {
        setGlobalFilter("")
        setTypeFilter("all")
    }

    const handleDelete = (id: string) =>
        startTransition(async () => {
            const res = await deleteVideoAction(id)
            res.success
                ? toast.success("Video berhasil dihapus")
                : toast.error(res.error || "Gagal menghapus video")
        })

    return (
        <div className="space-y-4">
            {/* Filter row */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <SearchFilter
                    searchValue={globalFilter}
                    onSearchChange={setGlobalFilter}
                    filters={[
                        {
                            value: typeFilter,
                            onChange: setTypeFilter,
                            options: [
                                { value: "all", label: "Semua" },
                                { value: "embed", label: "YouTube" },
                                { value: "upload", label: "Upload" },
                            ],
                            placeholder: "Tipe"
                        }
                    ]}
                    onReset={handleReset}
                    hasActiveFilter={hasFilter}
                    searchPlaceholder="Cari video..."
                />
                <div className="text-xs text-muted-foreground bg-muted/50 border border-border/50 px-3 py-1.5 rounded-full font-medium">
                    {filteredVideos.length} video
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredVideos.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-sm text-muted-foreground">Tidak ada video yang cocok dengan filter.</p>
                    </div>
                ) : (
                    filteredVideos.map((video) => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            onDelete={() => handleDelete(video.id)}
                            isPending={isPending}
                        />
                    )))}
            </div>
        </div>
    )
}

function VideoCard({ video, onDelete, isPending }: { video: Video; onDelete: () => void; isPending: boolean }) {
    const [isDelOpen, setIsDelOpen] = useState(false)

    // Convert embed path to full URL for local videos
    const videoSrc = video.is_embed ? video.embed : getMediaUrl(video.embed, 'uploads/videos')

    return (
        <div className="group flex flex-col gap-2.5 rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">

            {/* Player — no pointer-events blocking */}
            <div className="relative aspect-video bg-black overflow-hidden">
                {videoSrc ? (
                    <MediaPlayer
                        title={video.video_title}
                        src={videoSrc}
                        className="w-full h-full"
                        playsInline
                    >
                        <MediaProvider />
                        <PlyrLayout icons={plyrLayoutIcons} />
                    </MediaPlayer>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900">
                        <p className="text-slate-500 text-sm">Video tidak tersedia</p>
                    </div>
                )}
            </div>

            {/* Info + actions */}
            <div className="flex items-start justify-between gap-2 px-3 pb-3">
                <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold truncate text-foreground" title={video.video_title}>
                        {video.video_title}
                    </h3>

                    {video.video_desc && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {video.video_desc}
                        </p>
                    )}

                    <div className="flex items-center gap-3 mt-1.5">
                        <span className={cn(
                            "inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider",
                            video.is_embed ? "text-blue-500" : "text-muted-foreground"
                        )}>
                            {video.is_embed
                                ? <><ExternalLink className="w-3 h-3" /> YouTube</>
                                : <><Film className="w-3 h-3" /> Upload</>
                            }
                        </span>

                        {video.upload_date && (
                            <>
                                <span className="text-border">·</span>
                                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/60">
                                    <Clock className="w-3 h-3" />
                                    {formatDistanceToNow(new Date(video.upload_date), { addSuffix: true, locale: localeId })}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <ConfirmDialog
                    open={isDelOpen}
                    onOpenChange={setIsDelOpen}
                    title="Hapus Video?"
                    description="Video ini akan dihapus secara permanen."
                    confirmText="Hapus"
                    onConfirm={onDelete}
                    trigger={
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={isPending}
                            className="h-8 w-8 shrink-0 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            {isPending
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <Trash2 className="h-3.5 w-3.5" />
                            }
                        </Button>
                    }
                />
            </div>
        </div>
    )
}