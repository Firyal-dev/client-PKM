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

interface AlbumCardProps {
    id: string
    title: string
    count: number
}

export function AlbumCard({ id, title, count }: AlbumCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [albumTitle, setAlbumTitle] = useState(title)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleRename = async () => {
        if (albumTitle.trim() === "" || albumTitle === title) {
            setAlbumTitle(title)
            setIsEditing(false)
            return
        }
        try {
            await updateAlbumName(id, albumTitle)
            toast.success("Nama album berhasil diperbarui")
            setIsEditing(false)
        } catch (error) {
            toast.error("Gagal ganti nama")
            setAlbumTitle(title)
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
        <div className="group relative flex flex-col gap-3 rounded-2xl border bg-card p-3 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/20 hover:-translate-y-1">
            <AlbumCover id={id} count={count} disabled={isEditing} />
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
                                if (e.key === 'Escape') { setAlbumTitle(title); setIsEditing(false); }
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
                        Update 2 hari lalu
                    </p>
                </div>

                <AlbumActions
                    id={id}
                    onRename={() => setIsEditing(true)}
                />
            </div>
        </div>
    )
}

function AlbumCover({ id, count, disabled }: { id: string, count: number, disabled: boolean }) {
    return (
        <Link
            href={`/admin/albums/${id}`}
            className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-xl bg-muted/50 transition-all duration-500",
                disabled ? "pointer-events-none opacity-50" : "group-hover:ring-2 group-hover:ring-primary/20"
            )}
        >
            <div className="flex h-full flex-col items-center justify-center gap-3">
                <div className="relative">
                    <Folder className="h-12 w-12 text-primary/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
                    <ImageIcon className="absolute inset-0 h-6 w-6 m-auto text-primary/40" />
                </div>
            </div>

            <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2.5 py-1.5 text-[10px] text-white backdrop-blur-md font-bold shadow-lg border border-white/10">
                {count} FOTO
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
    )
}

function AlbumActions({ id, onRename }: { id: string, onRename: () => void }) {
    return (
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
                        if (confirm("Yakin mau hapus album ini? Semua referensi foto bakal dilepas.")) {
                            deleteAlbum(id)
                        }
                    }}
                >
                    <Trash2 className="h-4 w-4" />
                    <span>Hapus Album</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
