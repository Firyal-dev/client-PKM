import { getGallery } from "@/services/gallery/gallery-service"
import { GalleryList } from "./gallery-list"
import { PaginationControl } from "@/components/pagination-control"
import { PageHeader } from "@/components/page-header"

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams
    const currentPage = Number(params.page) || 1
    const limit = 12

    const response = await getGallery(currentPage, limit)

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Galeri"
                description="Kelola daftar foto dan dokumentasi"
                linkHref="/admin/gallery/upload-photo"
                linkLabel="Tambah Foto"
            />

            <div className="rounded-xl bg-muted/50 border border-border mt-5 p-5 min-h-[500px]">
                <GalleryList initialGallery={response.data} />

                {response.totalPages > 1 && (
                    <div className="mt-10 py-4 border-t border-border">
                        <PaginationControl
                            totalPages={response.totalPages}
                            currentPage={response.currentPage}
                        />
                        <p className="text-center text-xs text-muted-foreground mt-2">
                            Menampilkan halaman {response.currentPage} dari {response.totalPages}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}