'use client'

import { GalleryCard } from "@/components/gallery-card"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const sampleData = [
    { id: "1", title: "June Collection", image: "/authBg.jpg" },
    { id: "2", title: "Summer Essentials", image: "/authBg.jpg" },
    { id: "3", title: "Premium Bundle", image: "/authBg.jpg" },
    { id: "4", title: "Premium Bundle", image: "/authBg.jpg" },
]

export default function GalleryPage() {
    const [selected, setSelected] = useState<string[]>([])

    const handleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        )
    }

    return (
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <div className="flex items-center px-6 pt-4 gap-2">
                <Link href="/admin/gallery/upload-photo" className="btn-add-item">Tambah Foto</Link>
                <Button variant="destructive" onClick={() => setSelected([])}>Hapus</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
                {sampleData.map((item) => (
                    <GalleryCard
                        key={item.id}
                        gallery={item}
                        isSelected={selected.includes(item.id)}
                        onSelect={handleSelect}
                    />
                ))}
            </div>
        </div>
    );
}