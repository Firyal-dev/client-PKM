import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { GalleryCardProp } from "@/types/gallery-card-prop"

export function GalleryCard({ gallery, isSelected, onSelect }: GalleryCardProp) {
    return (
        <Card className="group overflow-hidden border-none shadow-none bg-transparent cursor-pointer">
            <CardContent className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-muted">
                <Image
                    src={gallery.image}
                    alt={gallery.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white font-bold text-lg leading-tight truncate">
                        {gallery.title}
                    </p>
                    <p className="text-white/80 text-xs mt-1">
                        26 Jan 2026
                    </p>
                </div>

                <div className="absolute right-2 top-2 z-20">
                    <Checkbox
                        className="cursor-pointer h-7 w-7 rounded-full border-2 border-white bg-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground backdrop-blur-sm shadow-sm"
                        checked={isSelected}
                        onCheckedChange={() => onSelect(gallery.id)}
                    />
                </div>
            </CardContent>
        </Card>
    )
}