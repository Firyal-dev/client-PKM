import { getGallery } from "@/services/gallery/gallery-service"
import { GalleryList } from "./gallery-list"
import { CustomLink } from "@/components/ui/link"
import { PaginationControl } from "@/components/pagination-control"

export default async function GalleryPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const params = await searchParams
    const currentPage = Number(params.page) || 1
    const limit = 12

    const response = await getGallery(currentPage, limit)

    return (
        <div className="px-5 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Galeri</h1>
                    <p className="text-muted-foreground text-sm">
                        Kelola daftar foto dan dokumentasi
                    </p>
                </div>
                <CustomLink href="/admin/gallery/upload-photo">
                    Tambah Foto
                </CustomLink>
            </div>

            <div className="rounded-xl bg-muted/30 border border-border mt-5 p-5 min-h-[500px]">
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