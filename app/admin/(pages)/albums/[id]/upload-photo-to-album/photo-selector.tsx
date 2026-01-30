// app/admin/(pages)/albums/[id]/upload-photo-to-album/photo-selector.tsx
'use client'

import { useState, useTransition } from "react"
import { Gallery } from "@/types/gallery-prop"
import { GalleryCard } from "@/components/admin/gallery-card"
import { Button } from "@/components/ui/button"
import { addPhotosToAlbum } from "@/services/album/album-service"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle2, X } from "lucide-react"

export function PhotoSelector({
    initialGallery,
    albumId
}: {
    initialGallery: Gallery[],
    albumId: string
}) {
    const [selected, setSelected] = useState<string[]>([])
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    const handleSave = () => {
        if (selected.length === 0) {
            toast.error("Pilih minimal satu foto")
            return
        }

        startTransition(async () => {
            try {
                await addPhotosToAlbum(albumId, selected)
                toast.success(`${selected.length} foto berhasil ditambahkan ke album`)
                router.push(`/admin/albums/${albumId}`)
                router.refresh()
            } catch (error: any) {
                toast.error(error.message)
            }
        })
    }

    return (
        <div className="relative">
            {selected.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-primary text-primary-foreground px-6 py-4 rounded-2xl shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-4 border border-white/10 backdrop-blur-md">
                    <div className="flex flex-col border-r border-primary-foreground/20 pr-4">
                        <span className="text-xs opacity-70 uppercase font-bold tracking-wider">Terpilih</span>
                        <span className="text-xl font-black leading-none">{selected.length} Foto</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            className="text-primary-foreground hover:bg-white/10 rounded-xl font-bold cursor-pointer"
                            onClick={() => setSelected([])}
                            disabled={isPending}
                        >
                            <X className="w-4 h-4 mr-2" /> Batal
                        </Button>

                        <Button
                            onClick={handleSave}
                            className="bg-white text-primary hover:bg-white/90 rounded-xl font-bold shadow-lg px-6 cursor-pointer"
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
        </div>
    )
}
