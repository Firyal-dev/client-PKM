'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { ImageOff } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { useState, useTransition } from "react"
import { GalleryCard } from "@/components/gallery-card"
import { Gallery } from "@/types/gallery-card-prop"
import { deleteGalleryBatch } from "@/services/gallery/gallery-service"
import { Loader2, Trash2, X, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { CustomLink } from "@/components/ui/link"

export function GalleryList({ initialGallery }: { initialGallery: Gallery[] }) {
    const [selected, setSelected] = useState<string[]>([])
    const [isPending, startTransition] = useTransition()

    const handleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteGalleryBatch(selected);

            if (result?.success) {
                toast.success(`${selected.length} foto berhasil dihapus`);
                setSelected([]);
            } else {
                toast.error(result?.error || "Terjadi kesalahan");
            }
        });
    }

    return (
        <div className="relative">
            {selected.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-4">
                    <span className="text-sm font-bold border-r border-primary-foreground/20 pr-4">
                        {selected.length} Terpilih
                    </span>

                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-primary-foreground hover:bg-primary-foreground/10 h-8 rounded-full cursor-pointer"
                            onClick={() => setSelected([])}
                            disabled={isPending}
                        >
                            <X className="w-4 h-4 mr-1" /> Batal
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="bg-red-500 hover:bg-red-600 h-8 rounded-full shadow-lg cursor-pointer"
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                    <span className="ml-1">Hapus</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <div className="flex items-center gap-2 text-destructive mb-2">
                                        <AlertTriangle className="w-5 h-5" />
                                        <AlertDialogTitle>Hapus Foto?</AlertDialogTitle>
                                    </div>
                                    <AlertDialogDescription>
                                        Tindakan ini tidak bisa dibatalkan. Anda bakal menghapus <strong>{selected.length} foto</strong> dari galeri. Yakin?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                                    >
                                        Hapus
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            )}

            {initialGallery.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] py-20 w-full">
                    <Empty className="flex flex-col items-center text-center">
                        <EmptyHeader className="flex flex-col items-center">
                            <EmptyMedia variant="icon" className="mb-4 bg-muted/50 p-4 rounded-full">
                                <ImageOff className="w-10 h-10 text-muted-foreground" />
                            </EmptyMedia>
                            <EmptyTitle className="text-xl font-semibold">Galeri kosong</EmptyTitle>
                            <EmptyDescription className="max-w-[300px] mx-auto">
                                Tidak ada foto di galeri. Tambahkan foto untuk memulai koleksi lu.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent className="mt-6">
                            <CustomLink href="/admin/gallery/upload-photo">
                                Tambah foto
                            </CustomLink>
                        </EmptyContent>
                    </Empty>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {initialGallery.map((item) => (
                        <GalleryCard
                            key={item._id}
                            gallery={item}
                            isSelected={selected.includes(item._id)}
                            onSelect={handleSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}