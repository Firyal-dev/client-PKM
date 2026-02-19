'use client'

import { useState } from "react"
import { useTransition } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { Edit, Trash2, Play, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Video } from "@/services/video/video-service"
import { deleteVideoAction } from "@/services/video/video-service"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function VideoList({ videos }: { videos: Video[] }) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = (id: string) =>
        startTransition(async () => {
            const res = await deleteVideoAction(id)
            res.success
                ? toast.success("Video berhasil dihapus")
                : toast.error(res.error || "Gagal menghapus video")
        })

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
                <VideoCard key={video.id} video={video} onDelete={handleDelete} isPending={isPending} />
            ))}
        </div>
    )
}

function VideoCard({ video, onDelete, isPending }: { video: Video; onDelete: (id: string) => void; isPending: boolean }) {
    const [isDelOpen, setIsDelOpen] = useState(false)

    // Get video URL from data field
    const videoUrl = video.data
    const isEmbed = video.is_embed

    return (
        <Card className="group overflow-hidden border-muted hover:shadow-md transition-all">
            {/* Video Preview */}
            <div className="relative aspect-video bg-slate-900">
                {isEmbed ? (
                    // Embed video (YouTube/Vimeo)
                    <iframe
                        src={videoUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    // Regular video file
                    <video
                        src={videoUrl}
                        className="w-full h-full object-cover"
                        controls
                    />
                )}

                {/* Play overlay for non-embed */}
                {!isEmbed && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center">
                            <Play className="h-6 w-6 text-black ml-1" />
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <CardContent className="p-4">
                <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {video.video_title}
                </h3>
                {video.video_desc && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {video.video_desc}
                    </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                    {video.created_at
                        ? formatDistanceToNow(new Date(video.created_at), { addSuffix: true, locale: localeId })
                        : '-'}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4">
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex-1"
                    >
                        <Link href={`/admin/videos/${video.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Link>
                    </Button>

                    <ConfirmDialog
                        open={isDelOpen}
                        onOpenChange={setIsDelOpen}
                        title="Hapus Video?"
                        description="Video ini akan dihapus secara permanen."
                        confirmText="Hapus"
                        onConfirm={() => onDelete(video.id)}
                        trigger={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        }
                    />
                </div>
            </CardContent>
        </Card>
    )
}
