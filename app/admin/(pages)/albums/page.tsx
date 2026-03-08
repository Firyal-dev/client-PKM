import { PageHeader } from "@/components/admin/page-header"
import { Folder, Images } from "lucide-react"
import { AlbumCard } from "./album-card"
import { AlbumSearchClient } from "./album-search-client"
import { getAdminAlbumList } from "@/services/album/album-service"
import { PaginationControl } from "@/components/pagination-control"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { CreateAlbumDialog } from "./create-album-dialog"
import { Album } from "@/types/album-prop"
import { cn } from "@/lib/utils"

export default async function AlbumsPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string; status?: string }> }) {
    const params = await searchParams
    const currentPage = Number(params.page) || 1
    const search = params.search || ""
    const status = params.status || "all"
    const { data, totalPages } = await getAdminAlbumList(currentPage, 10, search, status)

    return (
        <div className="px-5 pb-10">
            <PageHeader title="Albums" description="Daftar Album">
                <CreateAlbumDialog />
            </PageHeader>

            <div className={cn(
                "rounded-2xl bg-muted/30 border border-border/60 mt-5 p-5 min-h-[500px] flex flex-col",
                !data?.length && !search && status === "all" && "justify-center items-center"
            )}>
                {/*
                  The search bar and stats should remain visible whenever the
                  user has entered a search term or changed the status filter.
                  Only when the list is empty *and* there are no active filters
                  do we show the “belum ada album” prompt with the create
                  button, centred vertically.
                */}

                {(data.length === 0 && !search && status === "all") ? (
                    <Empty className="flex flex-col items-center text-center max-w-xs mx-auto">
                        <EmptyHeader className="flex flex-col items-center gap-3">
                            <EmptyMedia variant="icon" className="mb-2 bg-background border border-border/60 p-5 rounded-2xl shadow-sm">
                                <Folder className="w-10 h-10 text-primary/30" />
                            </EmptyMedia>
                            <EmptyTitle className="text-lg font-bold text-foreground">
                                Belum ada album
                            </EmptyTitle>
                            <EmptyDescription className="text-sm text-muted-foreground leading-relaxed">
                                Mulai buat album pertamamu untuk mengorganisir foto-foto kamu dengan rapi.
                            </EmptyDescription>
                        </EmptyHeader>
                        <div className="mt-5">
                            <CreateAlbumDialog />
                        </div>
                    </Empty>
                ) : (
                    <>
                        {/* Search + Stats sejajar — sama kayak gallery-list */}
                        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                            <AlbumSearchClient searchValue={search} />
                            <div className="text-xs text-muted-foreground bg-muted/50 border border-border/50 px-3 py-1.5 rounded-full font-medium shrink-0">
                                {data.length} album
                                {totalPages > 1 && (
                                    <span className="text-muted-foreground/60 ml-1">· hal. {currentPage}/{totalPages}</span>
                                )}
                            </div>
                        </div>

                        {data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <p className="text-sm text-muted-foreground">Tidak ada album yang cocok dengan filter.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {data.map((item: Album) => (
                                    <AlbumCard key={item.id} {...item} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <PaginationControl totalPages={totalPages} currentPage={currentPage} />
                </div>
            )}
        </div>
    )
}