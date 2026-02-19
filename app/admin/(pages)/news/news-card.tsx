'use client'

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { Calendar, MoreVertical, Pencil, Trash2, FileText } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Berita } from "@/types/berita-prop"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { getMediaUrl } from "@/lib/getMediaUrl"
import { deleteNewsAction } from "@/services/news/news-service"

export function NewsCard({ id, title, content, image, publish_at, category }: Berita) {
    const [isDelOpen, setIsDelOpen] = useState(false)
    const fullImageUrl = getMediaUrl(image)

    const handleDelete = async () => {
        try {
            const result = await deleteNewsAction(id)
            if (result.success) {
                toast.success("Berita berhasil dihapus")
            } else {
                toast.error(result.error || "Gagal menghapus berita")
            }
        } catch {
            toast.error("Gagal menghapus berita")
        }
    }

    return (
        <div className="group flex flex-col rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            {/* Image */}
            <div className="relative aspect-[16/9] overflow-hidden">
                {fullImageUrl ? (
                    <>
                        <Image
                            src={fullImageUrl}
                            alt={title}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-500 rounded-t-2xl"
                        />

                        {/* Softer medical overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/5 to-transparent" />
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center bg-muted rounded-t-2xl">
                        <FileText className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                )}

                {/* Category Glass Badge */}
                {category && (
                    <div className="absolute left-4 top-4 z-10">
                        <Badge
                            className="
                                relative
                                px-3 py-1
                                text-xs font-semibold
                                text-white
                                bg-white/10
                                backdrop-blur-md
                                border border-white/20
                                shadow-lg
                                rounded-full
                                overflow-hidden
                            "
                        >
                            <span className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent opacity-40 pointer-events-none" />
                            <span
                                className="relative z-10"
                                dangerouslySetInnerHTML={{ __html: category }}
                            />
                        </Badge>
                    </div>
                )}

                {/* Action Menu Glass */}
                <div className="
                    absolute right-4 top-4 z-20
                    opacity-0 scale-95
                    group-hover:opacity-100 group-hover:scale-100
                    transition-all duration-300
                ">
                    <div className="
                        rounded-full
                        bg-white/10
                        backdrop-blur-md
                        border border-white/20
                        shadow-lg
                        hover:bg-white/20
                        hover:border-white/30
                        transition
                    ">
                        <NewsActions id={id} onDelete={() => setIsDelOpen(true)} />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col gap-3">

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                        {publish_at
                            ? formatDistanceToNow(new Date(publish_at), {
                                addSuffix: true,
                                locale: localeId,
                            })
                            : "Baru saja"}
                    </span>
                </div>

                {/* Title */}
                <h3 className="
                    text-base font-semibold leading-snug
                    line-clamp-2
                    group-hover:text-primary
                    transition-colors
                ">
                    {title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    <span dangerouslySetInnerHTML={{ __html: content }} />
                </p>
            </div>

            <ConfirmDialog
                open={isDelOpen}
                onOpenChange={setIsDelOpen}
                title="Hapus Berita?"
                description="Berita yang dihapus tidak dapat dikembalikan."
                onConfirm={handleDelete}
                confirmText="Hapus"
            />
        </div>
    )
}

// Action menu
function NewsActions({ id, onDelete }: { id: string; onDelete: () => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="
                        h-8 w-8
                        rounded-full
                        text-white
                        hover:bg-transparent
                    "
                >
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-44 rounded-xl shadow-lg"
            >
                <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                    <Link href={`/admin/news/${id}`}>
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault()
                        onDelete()
                    }}
                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
