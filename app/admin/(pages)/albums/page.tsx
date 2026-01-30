import { PageHeader } from "@/components/admin/page-header"
import { Folder } from "lucide-react"
import { AlbumCard } from "./album-card"
import { getAlbums } from "@/services/album/album-service"
import { PaginationControl } from "@/components/admin/pagination-control"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { CustomLink } from "@/components/ui/link"

export default async function AlbumsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams
    const currentPage = Number(params.page) || 1
    const limit = 9

    const response = await getAlbums(currentPage, limit)

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Albums"
                description="Kelola daftar album"
                linkHref="/admin/albums/create-album"
                linkLabel="Buat Album"
            />
            <div className="rounded-xl bg-muted/50 border border-border mt-5 p-5 min-h-[500px]">
                {!response.data || response.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] py-20 w-full">
                        <Empty className="flex flex-col items-center text-center">
                            <EmptyHeader className="flex flex-col items-center">
                                <EmptyMedia variant="icon" className="mb-4 bg-muted/50 p-4 rounded-full">
                                    <Folder className="w-10 h-10 text-muted-foreground" />
                                </EmptyMedia>
                                <EmptyTitle className="text-xl font-semibold">Album kosong</EmptyTitle>
                                <EmptyDescription className="max-w-[300px] mx-auto">
                                    Tidak ada album. Tambahkan album untuk memulai koleksi.
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent className="mt-6">
                                <CustomLink href="/admin/albums/create-album">
                                    Buat Album
                                </CustomLink>
                            </EmptyContent>
                        </Empty>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {response.data.map((item: any) => (
                            <AlbumCard
                                key={item._id}
                                id={item._id}
                                title={item.album_title}
                                count={item.count}
                            />
                        ))}
                    </div>
                )}
            </div>

            {response.totalPages > 1 && (
                <div className="mt-10 py-4 border-t border-border">
                    <PaginationControl
                        totalPages={response.totalPages}
                        currentPage={response.currentPage}
                    />
                </div>
            )}
        </div>
    )
}