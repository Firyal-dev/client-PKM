import { PageHeader } from "@/components/page-header"
import { GalleryList } from "../../gallery/gallery-list"

// Data dummy foto di dalam album
const DUMMY_PHOTOS_BY_ALBUM: Record<string, any[]> = {
    "1": [
        { _id: "p1", title: "Foto 1", imageUrl: "https://picsum.photos/400/300?sig=1" },
        { _id: "p2", title: "Foto 2", imageUrl: "https://picsum.photos/400/300?sig=2" },
    ],
    "2": [
        { _id: "p3", title: "Vaksin 1", imageUrl: "https://picsum.photos/400/300?sig=3" },
    ]
}

export default async function AlbumDetailPage({ 
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
    const { id } = await params
    
    // Simulasi cari data berdasarkan ID
    const photos = DUMMY_PHOTOS_BY_ALBUM[id] || []
    const albumTitle = id === "1" ? "Kegiatan Puskesmas 2025" : "Album Lainnya"

    return (
        <div className="px-5 pb-10">
            <PageHeader 
                title={albumTitle}
                description={`Menampilkan isi foto dari album ID: ${id}`}
                linkHref={`/admin/albums/${id}/upload`}
                linkLabel="Tambah Foto ke Album"
            />

            <div className="mt-8 rounded-xl bg-muted/30 border border-border p-5">
                {/* {photos.length > 0 ? (
                    <GalleryList initialGallery={photos} />
                ) : (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground italic">Album ini masih kosong, bre.</p>
                    </div>
                )} */}
                tes
            </div>
        </div>
    )
}