import { PageHeader } from "@/components/page-header"
import { AlbumCard } from "./album-card"
import { getAlbums } from "@/services/album/album-service"
import { PaginationControl } from "@/components/pagination-control"
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Folder } from "lucide-react"

export default async function AlbumsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams
    const currentPage = Number(params.page) || 1
    const { data, totalPages } = await getAlbums(currentPage, 9)

    return (
        <div className="px-5 pb-10">
            <PageHeader title="Albums" linkHref="/admin/albums/create-album" linkLabel="Buat Album" />
            
            <div className="rounded-xl bg-muted/50 border border-border mt-5 p-5 min-h-[500px]">
                {!data?.length ? (
                    <Empty className="flex flex-col items-center py-20">
                        <EmptyHeader>
                            <EmptyMedia variant="icon"><Folder className="w-10 h-10" /></EmptyMedia>
                            <EmptyTitle>Album Kosong</EmptyTitle>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.map((item: any) => (
                            <AlbumCard
                                key={item._id}
                                id={item._id}
                                title={item.album_title}
                                count={item.count}
                                coverUrl={item.album_cover} // ✅ INI WAJIB ADA
                            />
                        ))}
                    </div>
                )}
            </div>
            
            {totalPages > 1 && <PaginationControl totalPages={totalPages} currentPage={currentPage} />}
        </div>
    )
}