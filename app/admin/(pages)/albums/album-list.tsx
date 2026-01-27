import { Folder, MoreVertical, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AlbumList({ title, count }: { title: string, count: number }) {
    return (
        <div className="group relative rounded-xl border bg-card p-2 shadow-sm transition-all hover:shadow-md">
            {/* Thumbnail Stack Effect */}
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
                </div>
                {/* Badge jumlah foto */}
                <div className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-[10px] text-white backdrop-blur-md">
                    {count} FOTO
                </div>
            </div>

            {/* Info Album */}
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <Folder className="h-4 w-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold leading-none">{title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">Update 2 hari lalu</p>
                    </div>
                </div>

                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}