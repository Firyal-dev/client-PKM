import { PageHeader } from "@/components/page-header"

export default async function AlbumDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

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