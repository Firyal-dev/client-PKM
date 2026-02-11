'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle2, X, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"

import { Gallery } from "@/types/gallery-prop"
import { GalleryCard } from "@/components/admin/gallery-card"
import { Button } from "@/components/ui/button"
import { addPhotosToAlbumAction } from "@/services/album/album-service"

export function PhotoSelector({ initialGallery, albumId }: { initialGallery: Gallery[], albumId: string }) {
    const [selected, setSelected] = useState<string[]>([])
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    const handleSave = () => {
        if (selected.length === 0) return toast.error("Pilih minimal satu foto")

        startTransition(async () => {
            try {
                const result = await addPhotosToAlbumAction(albumId, selected)
                if (result?.success) {
                    toast.success(`${selected.length} foto berhasil ditambahkan`)
                    router.push(`/admin/albums/${albumId}`)
                    router.refresh()
                } else {
                    toast.error(result?.error || "Gagal menambahkan foto")
                }
            } catch (error: any) {
                toast.error(error.message || "Gagal menambahkan foto")
            }
        })
    }

    return (
        <div className="relative pb-24">
            {/* Floating action bar */}
            {selected.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-6 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in slide-in-from-bottom-10 border border-white/10 backdrop-blur-xl">
                    <div className="flex items-center gap-3 border-r border-white/20 pr-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                            <ImageIcon className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] opacity-50 uppercase font-black tracking-tighter">Terpilih</span>
                            <span className="text-lg font-bold tabular-nums leading-none">{selected.length} <span className="text-sm font-medium opacity-70">Foto</span></span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl font-semibold h-10"
                            onClick={() => setSelected([])}
                            disabled={isPending}
                        >
                            <X className="w-4 h-4 mr-2" /> Batal
                        </Button>

                        <Button
                            size="sm"
                            onClick={handleSave}
                            className="bg-primary hover:bg-primary/90 text-white rounded-xl font-bold px-6 h-10 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                            )}
                            Simpan ke Album
                        </Button>
                    </div>
                </div>
            )}

            {/* Galeri */}
            {initialGallery.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/30 rounded-3xl border border-dashed">
                    <ImageIcon className="h-12 w-12 opacity-20 mb-4" />
                    <p className="text-sm font-medium">Belum ada foto di galeri</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {initialGallery.map((item) => (
                        <GalleryCard
                            key={item.id}
                            gallery={item}
                            isSelected={selected.includes(item.id)}
                            onSelect={handleSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}