'use client'

import { Checkbox } from "@/components/ui/checkbox"
import { getMediaUrl } from "@/lib/getMediaUrl"
import Image from "next/image"
import type { GalleryCard } from "@/types/gallery-prop"

export function GalleryCard({ gallery, isSelected, onSelect }: GalleryCard) {
    const imageUrl = getMediaUrl(gallery.image) || "/placeholder.jpg"

    return (
        <div
            className="group relative cursor-pointer"
            onClick={() => onSelect(gallery.id)}
        >
            {/* Image container */}
            <div className={`relative aspect-square overflow-hidden rounded-2xl transition-all duration-300 ${isSelected
                    ? "ring-2 ring-white ring-offset-2 ring-offset-background"
                    : "ring-0"
                }`}>
                <Image
                    src={imageUrl}
                    alt={gallery.image_title || "Foto Galeri"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    unoptimized
                />

                {/* Gradient overlay — selalu ada, makin tebal saat hover/selected */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`} />

                {/* Caption */}
                <div className={`absolute bottom-0 left-0 right-0 p-3.5 translate-y-1 transition-all duration-300 ${isSelected ? "opacity-100 translate-y-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-y-0"
                    }`}>
                    {gallery.image_title && (
                        <p className="text-white text-sm font-semibold leading-snug truncate">
                            {gallery.image_title}
                        </p>
                    )}
                    {gallery.description && (
                        <p className="text-white/70 text-xs truncate mt-0.5">
                            {gallery.description}
                        </p>
                    )}
                </div>

                {/* Selected tint */}
                {isSelected && (
                    <div className="absolute inset-0 bg-blue-500/15 transition-opacity duration-200" />
                )}
            </div>

            {/* Checkbox */}
            <div
                className={`absolute top-2.5 right-2.5 z-20 transition-all duration-200 ${isSelected ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isSelected ? "bg-white" : "bg-black/30 backdrop-blur-sm border border-white/40"
                    }`}>
                    <Checkbox
                        className="h-4 w-4 border-0 bg-transparent data-[state=checked]:bg-transparent data-[state=checked]:text-white"
                        checked={isSelected}
                        onCheckedChange={() => onSelect(gallery.id)}
                    />
                </div>
            </div>
        </div>
    )
}