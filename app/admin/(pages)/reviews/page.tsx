import { PageHeader } from "@/components/admin/page-header"
import { PaginationControl } from "@/components/pagination-control"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { getReviews } from "@/services/review/review-service"
import { ReviewList } from "./review-list"

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams
    const currentPage = Number(params.page) || 1
    const { data, totalPages } = await getReviews(currentPage, 10);

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Saran dan Kritik"
                description="Kelola daftar saran dan kritik yang masuk"
            />

            <div className={cn(
                "rounded-xl bg-muted/50 border border-border mt-6 p-5 min-h-[500px] flex flex-col",
                data.length === 0 && "justify-center"
            )}>
                {data.length === 0 ? (
                    <Empty className="flex flex-col items-center text-center">
                        <EmptyHeader className="flex flex-col items-center">
                            <EmptyMedia variant="icon" className="mb-4 bg-background p-4 rounded-full shadow-sm">
                                <MessageSquare className="w-10 h-10 text-primary/40" />
                            </EmptyMedia>
                            <EmptyTitle className="text-xl font-bold">
                                Tidak ada saran dan kritik
                            </EmptyTitle>
                            <EmptyDescription className="max-w-[300px] mx-auto text-muted-foreground">
                                Belum ada saran dan kritik yang masuk.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <ReviewList reviews={data} />
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