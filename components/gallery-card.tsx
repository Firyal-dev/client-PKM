'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { GalleryCardProp } from "@/types/gallery-card-prop"

export function GalleryCard({ gallery, isSelected, onSelect }: GalleryCardProp) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL!;
    const BASE_URL = API_URL.replace('/api', '');

    const imageUrl = gallery.image.startsWith('http')
        ? gallery.image
        : `${BASE_URL}${gallery.image}`;

    return (
        <Card
            className="group overflow-hidden border-none shadow-none bg-transparent cursor-pointer"
            onClick={() => onSelect(gallery._id)}
        >
            <CardContent className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-muted p-0">
                <Image
                    src={imageUrl}
                    alt={gallery.image_title || "Foto Gallery"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized
                />

                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white font-bold text-lg leading-tight truncate">
                        {gallery.image_title}
                    </p>
                </div>

                <div className="absolute right-3 top-3 z-20" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                        className="h-6 w-6 rounded-full border-white bg-white/20 backdrop-blur-md"
                        checked={isSelected}
                        onCheckedChange={() => onSelect(gallery._id)}
                    />
                </div>
            </CardContent>
        </Card>
    )
}