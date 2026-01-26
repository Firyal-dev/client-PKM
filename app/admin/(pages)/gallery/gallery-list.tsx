'use client'

import { useState } from "react"
import { GalleryCard } from "@/components/gallery-card"
import { Button } from "@/components/ui/button"
import { Gallery } from "@/types/gallery-card-prop"

export function GalleryList({ initialGallery }: { initialGallery: Gallery[] }) {
    const [selected, setSelected] = useState<string[]>([])

    const handleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    const handleClear = () => setSelected([])

    return (
        <>
            {selected.length > 0 && (
                <div className="mb-4 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                    <p className="text-sm font-medium">{selected.length} foto dipilih</p>
                    <Button size="sm" variant="destructive" onClick={handleClear}>
                        Batal Pilih
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-500 border-red-500">
                        Hapus Permanen
                    </Button>
                </div>
            )}

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
        </>
    )
}