import { PageHeader } from "@/components/admin/page-header"
import { Folder } from "lucide-react"
import { AlbumCard } from "./album-card"
import { getAlbums } from "@/services/album/album-service"
import { PaginationControl } from "@/components/admin/pagination-control"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { CreateAlbumDialog } from "./create-album-dialog"
import { Album } from "@/types/album-prop"

export default async function AlbumsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams
    const currentPage = Number(params.page) || 1
    const { data, totalPages } = await getAlbums(currentPage, 9)

    return (
        <div className="px-5 pb-10">
            <PageHeader title="Albums">
                <CreateAlbumDialog />
            </PageHeader>

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
                        {data.map((item: Album) => (
                            <AlbumCard
                                key={item._id}
                                {...item}
                            />
                        ))}
                    </div>
                )}
            </div>

            {totalPages > 1 && <PaginationControl totalPages={totalPages} currentPage={currentPage} />}
        </div>
    )
}