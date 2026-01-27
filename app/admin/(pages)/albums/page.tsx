import { PageHeader } from "@/components/page-header"
import { Empty } from "@/components/ui/empty"
import { Folder } from "lucide-react"
import { AlbumList } from "./album-list"

const DUMMY_ALBUMS = [
    { id: "1", title: "Kegiatan Puskesmas 2025", count: 24, updatedAt: "2 hari lalu" },
    { id: "2", title: "Vaksinasi Door to Door", count: 12, updatedAt: "5 hari lalu" },
    { id: "3", title: "Rapat Koordinasi Dinkes", count: 8, updatedAt: "1 minggu lalu" },
    { id: "4", title: "Layanan Lansia Terpadu", count: 45, updatedAt: "2 minggu lalu" },
    { id: "5", title: "Sosialisasi Stunting", count: 15, updatedAt: "3 minggu lalu" },
    { id: "6", title: "Cek Kesehatan Gratis", count: 30, updatedAt: "1 bulan lalu" },
]

export default function AlbumsPage() {
    const albums = DUMMY_ALBUMS

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Albums"
                description="Kelola daftar album"
                linkHref="/admin/albums/create-album"
                linkLabel="Buat Album"
            />
            <div className="rounded-xl bg-muted/50 mt-5 p-5">
                {albums.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Empty>
                            <Folder className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">Belum ada album</h3>
                            <p className="text-muted-foreground text-sm">Buat album pertama lu untuk merapikan foto.</p>
                        </Empty>
                    </div>
                ) : (
                    /* Grid Album: 1 kolom di HP, 2 di tablet, 3 di desktop */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {albums.map((album) => (
                            <AlbumList
                                key={album.id}
                                title={album.title}
                                count={album.count}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}