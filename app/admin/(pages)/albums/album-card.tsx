'use client'

import { useState, useRef, useEffect, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { Folder, MoreVertical, Image as ImageIcon, Trash2, Pencil, Clock } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Album } from "@/types/album-prop"
import { updateAlbumNameAction, deleteAlbumAction } from "@/services/album/album-service"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { getMediaUrl } from "@/lib/getMediaUrl"

export function AlbumCard({ id, album_title, count, album_cover, created_at }: Album) {
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(album_title)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => setTitle(album_title), [album_title])

    const handleRename = async () => {
        const trimmedTitle = title.trim()
        if (!trimmedTitle || trimmedTitle === album_title) {
            setTitle(album_title)
            setIsEditing(false)
            return
        }
        try {
            const result = await updateAlbumNameAction(id, trimmedTitle)
            if (result.success) {
                toast.success("Nama album diperbarui")
                setIsEditing(false)
            } else {
                toast.error(result.error || "Gagal mengubah nama")
                setTitle(album_title)
                setIsEditing(false)
            }
        } catch {
            toast.error("Gagal mengubah nama")
            setTitle(album_title)
            setIsEditing(false)
        }
    }

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus()
            inputRef.current?.select()
        }
    }, [isEditing])

    return (
        <div className="group relative flex flex-col rounded-2xl overflow-hidden border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30">
            {/* Cover */}
            <AlbumCover id={id} count={count} disabled={isEditing} cover={album_cover} />

            {/* Footer info */}
            <div className="flex items-center justify-between px-4 py-3 gap-2 bg-card">
                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleRename}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRename()
                                if (e.key === 'Escape') { setTitle(album_title); setIsEditing(false) }
                            }}
                            className="w-full bg-transparent border-b-2 border-primary outline-none text-sm font-semibold py-0.5 text-foreground"
                        />
                    ) : (
                        <h3
                            onDoubleClick={() => setIsEditing(true)}
                            className="text-sm font-semibold truncate cursor-text text-foreground group-hover:text-primary transition-colors duration-200"
                            title={title}
                        >
                            {title}
                        </h3>
                    )}
                    <div className="flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3 text-muted-foreground/60" />
                        <p className="text-[11px] text-muted-foreground/70 font-medium">
                            {created_at
                                ? formatDistanceToNow(new Date(created_at), { addSuffix: true, locale: localeId })
                                : "Baru saja"}
                        </p>
                    </div>
                </div>

                <AlbumActions id={id} onRename={() => setIsEditing(true)} />
            </div>
        </div>
    )
}

function AlbumCover({ id, count, disabled, cover }: { id: string; count: number; disabled: boolean; cover?: string | null }) {
    const fullUrl = getMediaUrl(cover)

    return (
        <Link
            href={`/admin/albums/${id}`}
            className={cn(
                "relative aspect-[16/10] overflow-hidden bg-muted/40 block",
                disabled && "pointer-events-none opacity-50"
            )}
        >
            {fullUrl ? (
                <>
                    <Image
                        src={fullUrl}
                        alt="Cover"
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />
                </>
            ) : (
                <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-muted/60 to-muted/20">
                    <div className="relative flex items-center justify-center">
                        <Folder className="h-14 w-14 text-primary/15 transition-transform duration-300 group-hover:scale-110" />
                        <ImageIcon className="absolute h-6 w-6 text-primary/35" />
                    </div>
                    <p className="mt-2 text-[11px] text-muted-foreground/50 font-medium tracking-widest uppercase">Kosong</p>
                </div>
            )}

            {/* Photo count badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/60 backdrop-blur-sm px-2.5 py-1 z-10 border border-white/10">
                <ImageIcon className="h-3 w-3 text-white/80" />
                <span className="text-[11px] text-white font-bold tracking-wide">{count}</span>
            </div>
        </Link>
    )
}

function AlbumActions({ id, onRename }: { id: string; onRename: () => void }) {
    const [isDelOpen, setIsDelOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteAlbumAction(id)
            if (result.success) {
                toast.success("Album berhasil dihapus")
                setIsDelOpen(false)
            } else {
                toast.error(result.error || "Gagal menghapus album")
            }
        })
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full shrink-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-lg border border-border/80">
                    <DropdownMenuItem onClick={onRename} className="gap-2 cursor-pointer rounded-lg text-sm">
                        <Pencil className="h-3.5 w-3.5" /> Ubah Nama
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={(e) => { e.preventDefault(); setIsDelOpen(true) }}
                        className="gap-2 cursor-pointer rounded-lg text-sm text-destructive focus:text-destructive"
                    >
                        <Trash2 className="h-3.5 w-3.5" /> Hapus Album
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmDialog
                open={isDelOpen}
                onOpenChange={setIsDelOpen}
                title="Hapus Album?"
                description="Data foto di dalamnya tidak akan terhapus, hanya albumnya saja yang hilang."
                onConfirm={handleDelete}
                confirmText="Hapus"
                isLoading={isPending}
            />
        </>
    )
}