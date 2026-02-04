// app/admin/(pages)/albums/album-card.tsx
'use client'

import { useState, useRef, useEffect } from "react"
import { Folder, MoreVertical, Image as ImageIcon, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { updateAlbumName, deleteAlbum } from "@/services/album/album-service"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import Image from "next/image" // 👈 1. Import Image

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Album } from "@/types/album-prop"

export function AlbumCard({ _id, album_title, count, album_cover, created_at }: Album) {
    const actualId = _id
    const actualTitle = album_title
    const [isEditing, setIsEditing] = useState(false)
    const [albumTitle, setAlbumTitle] = useState(actualTitle)
    const inputRef = useRef<HTMLInputElement>(null)

    // Sync state if props change
    useEffect(() => {
        setAlbumTitle(actualTitle)
    }, [actualTitle])

    const handleRename = async () => {
        if (!albumTitle || albumTitle.trim() === "" || albumTitle === actualTitle) {
            setAlbumTitle(actualTitle)
            setIsEditing(false)
            return
        }
        try {
            await updateAlbumName(actualId, albumTitle)
            toast.success("Nama album berhasil diperbarui")
            setIsEditing(false)
        } catch (error) {
            toast.error("Gagal ganti nama")
            setAlbumTitle(actualTitle)
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
        <div className="group relative flex flex-col gap-3 rounded-2xl border bg-card p-3 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            {/* 👈 3. Kirim coverUrl ke sub-component */}
            <AlbumCover id={actualId} count={count} disabled={isEditing} album_cover={album_cover} />

            <div className="flex items-start justify-between px-1 gap-2">
                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            value={albumTitle}
                            onChange={(e) => setAlbumTitle(e.target.value)}
                            onBlur={handleRename}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRename()
                                if (e.key === 'Escape') { setAlbumTitle(actualTitle); setIsEditing(false); }
                            }}
                            className="w-full bg-background border-b-2 border-primary outline-none text-sm font-bold py-1"
                        />
                    ) : (
                        <h3
                            onDoubleClick={() => setIsEditing(true)}
                            className="text-sm font-bold leading-tight truncate cursor-text select-none group-hover:text-primary transition-colors"
                        >
                            {albumTitle}
                        </h3>
                    )}
                    <p className="text-[11px] text-muted-foreground mt-1 font-medium uppercase tracking-wider">
                        {created_at ? `Dibuat ${formatDistanceToNow(new Date(created_at), { addSuffix: true, locale: id })}` : "Waktu tidak diketahui"}
                    </p>
                </div>

                <AlbumActions
                    id={actualId}
                    onRename={() => setIsEditing(true)}
                />
            </div>
        </div>
    )
}

// 👈 4. Terima props di sini
function AlbumCover({ id, count, disabled, album_cover }: { id: string, count: number, disabled: boolean, album_cover?: string | null }) {

    // Sesuaikan Base URL Server Backend kamu (hapus /api jika gambar di root public)
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const BASE_URL = API_URL?.replace(/\/api$/, '')

    const fullImageUrl = album_cover ? `${BASE_URL}${album_cover}` : null

    return (
        <Link
            href={`/admin/albums/${id}`}
            className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-xl bg-muted/50 transition-all duration-500",
                disabled ? "pointer-events-none opacity-50" : "group-hover:ring-2 group-hover:ring-primary/20"
            )}
        >
            {/* 👈 5. LOGIKA UTAMA: Tampilkan Gambar jika ada, Icon jika tidak */}
            {fullImageUrl ? (
                <div className="relative h-full w-full">
                    <Image
                        src={fullImageUrl}
                        alt="Cover"
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
            ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3">
                    <div className="relative">
                        <Folder className="h-12 w-12 text-primary/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
                        <ImageIcon className="absolute inset-0 h-6 w-6 m-auto text-primary/40" />
                    </div>
                </div>
            )}

            <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2.5 py-1.5 text-[10px] text-white backdrop-blur-md font-bold shadow-lg border border-white/10 z-10">
                {count} FOTO
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Link>
    )
}

function AlbumActions({ id, onRename }: { id: string, onRename: () => void }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-50 rounded-xl shadow-xl border-border/50">
                    <DropdownMenuItem onClick={onRename} className="cursor-pointer gap-2">
                        <Pencil className="h-4 w-4" />
                        <span>Ubah Nama</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer gap-2"
                        onSelect={(e) => {
                            e.preventDefault()
                            setShowDeleteDialog(true)
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span>Hapus Album</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Album?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak bisa dibatalkan. Menghapus album ini berarti semua referensi foto di dalamnya akan dilepas.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteAlbum(id)}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog >
        </>
    )
}