import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { GalleryCardProp } from "@/types/gallery-card-prop"

export function GalleryCard({ gallery, isSelected, onSelect }: GalleryCardProp) {
    return (
        <Card className="group overflow-hidden border-none shadow-none bg-transparent">
            <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-muted">
                <Image
                    src={gallery.image}
                    alt={gallery.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                />

                <div className="absolute right-2 top-2 z-10">
                    <Checkbox
                        className="h-10 w-10 lg:h-7 lg:w-7 md:h-8 md:w-8 rounded-full border-2 border-white bg-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground backdrop-blur-sm cursor-pointer"
                        checked={isSelected}
                        onCheckedChange={() => onSelect(gallery.id)}
                    />
                </div>
            </div>
        </Card>
    )
}