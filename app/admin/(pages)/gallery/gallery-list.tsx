'use client'

import { useState, useTransition } from "react" 
import { GalleryCard } from "@/components/gallery-card"
import { Button } from "@/components/ui/button"
import { Gallery } from "@/types/gallery-card-prop"
import { deleteGalleryBatch } from "@/services/gallery/gallery-service" 
import { Loader2, Trash2 } from "lucide-react" 

export function GalleryList({ initialGallery }: { initialGallery: Gallery[] }) {
    const [selected, setSelected] = useState<string[]>([])
    const [isPending, startTransition] = useTransition() 

    const handleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    const handleClear = () => setSelected([])

    const handleDelete = () => {
        if (!confirm("Apakah anda yakin ingin menghapus foto yang dipilih?")) return;

        startTransition(async () => {
            const result = await deleteGalleryBatch(selected);
            
            if (result?.error) {
                alert(result.error); 
            } else {    
                setSelected([]); 
            }
        });
    }

    return (
        <>
            {selected.length > 0 && (
                <div className="mb-4 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 sticky top-4 z-50 bg-background/80 backdrop-blur p-2 rounded-lg border shadow-sm">
                    <p className="text-sm font-medium px-2">{selected.length} foto dipilih</p>
                    
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={handleClear}
                        disabled={isPending}
                    >
                        Batal
                    </Button>

                    <Button 
                        size="sm" 
                        variant="destructive" 
                        className="gap-2"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Menghapus...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                Hapus ({selected.length})
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* State kalau kosong */}
            {initialGallery.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p>Belum ada foto di galeri.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
        </>
    )
}