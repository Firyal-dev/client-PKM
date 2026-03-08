import { PageHeader } from "@/components/admin/page-header"
import { getAdminVideos } from "@/services/video/video-service"
import { VideoList } from "./video-list"
import { PaginationControl } from "@/components/pagination-control"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Video } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function VideosPage({ searchParams }: { searchParams: { page: string } }) {
    const params = await searchParams
    const currentPage = Number(params.page) || 1
    const { data, totalPages } = await getAdminVideos(currentPage)

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Video"
                description="Kelola video di website"
                linkHref="/admin/videos/create-video"
                linkLabel="Tambah Video"
            />

            <div className={cn(
                "rounded-2xl bg-muted/30 border border-border/60 mt-6 p-5 min-h-[500px] flex flex-col",
                data.length === 0 && "justify-center items-center"
            )}>
                {data.length === 0 ? (
                    <Empty className="flex flex-col items-center text-center max-w-xs mx-auto">
                        <EmptyHeader className="flex flex-col items-center gap-3">
                            <EmptyMedia variant="icon" className="mb-2 bg-background border border-border/60 p-5 rounded-2xl shadow-sm">
                                <Video className="w-10 h-10 text-primary/30" />
                            </EmptyMedia>
                            <EmptyTitle className="text-lg font-bold">
                                Belum ada video
                            </EmptyTitle>
                            <EmptyDescription className="text-sm text-muted-foreground leading-relaxed">
                                Tambahkan video pertama untuk ditampilkan di website.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <VideoList videos={data} />
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