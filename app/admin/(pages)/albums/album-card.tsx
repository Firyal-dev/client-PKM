'use client'

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { Folder, MoreVertical, Image as ImageIcon, Trash2, Pencil } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Album } from "@/types/album-prop"
import { updateAlbumNameAction, deleteAlbumAction } from "@/services/album/album-service"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { getMediaUrl } from "@/lib/getMediaUrl"

export function AlbumCard({ id, album_title, count, album_cover, created_at }: Album) {
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(album_title)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => setTitle(album_title), [album_title])

    // Fungsi untuk mengubah nama album
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
        } catch (error) {
            toast.error("Gagal mengubah nama")
            setTitle(album_title)
            setIsEditing(false)
        }
    }

    // Fungsi untuk memindahkan fokus ke input ketika mode edit aktif
    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus()
            inputRef.current?.select()
        }
    }, [isEditing])

    return (
        <div className="group flex flex-col gap-3 rounded-2xl border bg-card p-3 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            <AlbumCover id={id} count={count} disabled={isEditing} cover={album_cover} />

            <div className="flex items-start justify-between px-1 gap-2">
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
                            className="w-full bg-transparent border-b-2 border-primary outline-none text-sm font-bold py-1"
                        />
                    ) : (
                        <h3
                            onDoubleClick={() => setIsEditing(true)}
                            className="text-sm font-bold truncate cursor-text group-hover:text-primary transition-colors"
                        >
                            {title}
                        </h3>
                    )}
                    <p className="text-[11px] text-muted-foreground mt-1 font-medium uppercase tracking-wider">
                        {created_at ? formatDistanceToNow(new Date(created_at), { addSuffix: true, locale: localeId }) : "Baru saja"}
                    </p>
                </div>

                <AlbumActions id={id} onRename={() => setIsEditing(true)} />
            </div>
        </div>
    )
}

// Cover album
function AlbumCover({ id, count, disabled, cover }: { id: string, count: number, disabled: boolean, cover?: string | null }) {
    const fullUrl = getMediaUrl(cover)

    return (
        <Link
            href={`/admin/albums/${id}`}
            className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-xl bg-muted/50 transition-all",
                disabled ? "pointer-events-none opacity-50" : "group-hover:ring-4 group-hover:ring-primary/10"
            )}
        >
            {fullUrl ? (
                <>
                    <Image
                        src={fullUrl}
                        alt="Cover"
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </>
            ) : (
                <div className="flex h-full flex-col items-center justify-center bg-slate-50">
                    <div className="relative">
                        <Folder className="h-10 w-10 text-primary/10 group-hover:scale-110 transition-transform" />
                        <ImageIcon className="absolute inset-0 h-5 w-5 m-auto text-primary/30" />
                    </div>
                </div>
            )}

            <div className="absolute bottom-2 right-2 rounded-lg bg-black/70 px-2 py-1 text-[10px] text-white backdrop-blur-md font-bold z-10">
                {count} FOTO
            </div>
        </Link>
    )
}

// Aksi album
function AlbumActions({ id, onRename }: { id: string, onRename: () => void }) {
    const [isDelOpen, setIsDelOpen] = useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-xl">
                    <DropdownMenuItem onClick={onRename} className="gap-2 cursor-pointer">
                        <Pencil className="h-4 w-4" /> Ubah Nama
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={(e) => { e.preventDefault(); setIsDelOpen(true) }}
                        className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                    >
                        <Trash2 className="h-4 w-4" /> Hapus Album
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmDialog
                open={isDelOpen}
                onOpenChange={setIsDelOpen}
                title="Hapus Album?"
                description="Data foto di dalamnya tidak akan terhapus, hanya albumnya saja yang hilang."
                onConfirm={() => deleteAlbumAction(id)}
                confirmText="Hapus"
            />

        </>
    )
}