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
                "rounded-xl bg-muted/50 border border-border mt-6 p-5 min-h-[500px] flex flex-col",
                data.length === 0 && "justify-center"
            )}>
                {data.length === 0 ? (
                    <Empty className="flex flex-col items-center text-center">
                        <EmptyHeader className="flex flex-col items-center">
                            <EmptyMedia variant="icon" className="mb-4 bg-background p-4 rounded-full shadow-sm">
                                <Video className="w-10 h-10 text-primary/40" />
                            </EmptyMedia>
                            <EmptyTitle className="text-xl font-bold">
                                Tidak ada video
                            </EmptyTitle>
                            <EmptyDescription className="max-w-[300px] mx-auto text-muted-foreground">
                                Belum ada video yang diunggah.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <VideoList videos={data} />
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
