'use client'

import { useState, useTransition } from "react"
import { Trash2, Play, Film, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { id as localeId } from "date-fns/locale"

import { Video, deleteVideoAction } from "@/services/video/video-service"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { getYouTubeEmbedUrl, getYouTubeThumbnail } from "@/lib/video-utils"

export function VideoList({ videos }: { videos: Video[] }) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = (id: string) =>
        startTransition(async () => {
            const res = await deleteVideoAction(id)
            if (res.success) {
                toast.success("Video berhasil dihapus")
            } else {
                toast.error(res.error || "Gagal menghapus video")
            }
        })

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
                <VideoCard
                    key={video.id}
                    video={video}
                    onDelete={() => handleDelete(video.id)}
                    isPending={isPending}
                />
            ))}
        </div>
    )
}

function VideoCard({ video, onDelete, isPending }: { video: Video; onDelete: () => void; isPending: boolean }) {
    const [isDelOpen, setIsDelOpen] = useState(false)
    const isEmbed = video.is_embed
    const rawUrl = video.embed
    const embedUrl = isEmbed ? getYouTubeEmbedUrl(rawUrl) : rawUrl
    const thumbnail = isEmbed ? getYouTubeThumbnail(rawUrl) : null

    return (
        <Card className="group overflow-hidden border-none shadow-none bg-transparent">
            <CardContent className="p-0">
                {/* Visual Preview Container */}
                <div className="relative aspect-video overflow-hidden rounded-[1.5rem] bg-slate-900 border border-border/50">
                    {isEmbed ? (
                        <iframe
                            src={embedUrl}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <video
                            src={embedUrl}
                            className="w-full h-full object-cover"
                            controls
                        />
                    )}

                    {/* Hover Overlay (Gallery Style) */}
                    <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] pointer-events-none">
                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 pointer-events-auto">
                            <h3 className="text-white font-bold text-lg line-clamp-1 flex items-center gap-2">
                                {isEmbed ? <ExternalLink className="w-4 h-4 text-primary" /> : <Film className="w-4 h-4 text-primary" />}
                                {video.video_title}
                            </h3>
                            <p className="text-white/80 text-sm line-clamp-2 mt-1 italic">
                                {video.video_desc || "Tidak ada deskripsi"}
                            </p>

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest leading-none">
                                    {video.upload_date
                                        ? formatDistanceToNow(new Date(video.upload_date), { addSuffix: true, locale: localeId })
                                        : '-'}
                                </span>

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
                                            className="h-9 w-9 rounded-xl bg-white/10 hover:bg-red-500 hover:text-white text-white/70 transition-all border border-white/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    }
                                />
                            </div>
                        </div>

                        {/* Center Play Icon for visual cues */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="h-12 w-12 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30 scale-75 group-hover:scale-100 transition-transform duration-500">
                                <Play className="h-5 w-5 text-white fill-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info below for clarity if not hovered (Optional, but let's keep it clean like Gallery) */}
                <div className="mt-3 px-2 group-hover:opacity-0 transition-opacity duration-300">
                    <h3 className="font-semibold text-sm line-clamp-1">{video.video_title}</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5 uppercase tracking-wider font-medium">
                        {isEmbed ? "Embed Link" : "Local Video"}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
