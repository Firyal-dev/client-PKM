import { PageHeader } from "@/components/admin/page-header"
import { Folder } from "lucide-react"
import { AlbumCard } from "./album-card"
import { getAlbums } from "@/services/album/album-service"
import { PaginationControl } from "@/components/pagination-control"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { CreateAlbumDialog } from "./create-album-dialog"
import { Album } from "@/types/album-prop"
import { cn } from "@/lib/utils"

export default async function AlbumsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams
    const currentPage = Number(params.page) || 1
    const { data, totalPages } = await getAlbums(currentPage, 9)

    return (
        <div className="px-5 pb-10">
            <PageHeader title="Albums" description="Daftar Album">
                <CreateAlbumDialog />
            </PageHeader>

            <div className={cn(
                "rounded-xl bg-muted/50 border border-border mt-5 p-5 min-h-[500px] flex flex-col",
                !data?.length && "justify-center"
            )}>
                {!data?.length ? (
                    <Empty className="flex flex-col items-center text-center">
                        <EmptyHeader className="flex flex-col items-center">
                            <EmptyMedia variant="icon" className="mb-4 bg-background p-4 rounded-full shadow-sm">
                                <Folder className="w-10 h-10 text-primary/40" />
                            </EmptyMedia>
                            <EmptyTitle className="text-xl font-bold">
                                Tidak ada album
                            </EmptyTitle>
                            <EmptyDescription className="max-w-[300px] mx-auto text-muted-foreground">
                                Belum ada album yang dibuat.
                            </EmptyDescription>
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

            {totalPages > 1 && (
                <div className="mt-8">
                    <PaginationControl totalPages={totalPages} currentPage={currentPage} />
                </div>
            )}
        </div>
    )
}