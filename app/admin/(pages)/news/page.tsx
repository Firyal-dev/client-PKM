import { PageHeader } from "@/components/admin/page-header"
import { NewsCard } from "./news-card"
import { PaginationControl } from "@/components/pagination-control"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Newspaper } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAdminNews } from "@/services/news/news-service"
import { Berita } from "@/types/berita-prop"

export default async function NewsPage({ searchParams }: { searchParams: { page: string } }) {
    const params = await searchParams
    const currentPage = Number(params.page) || 1
    const { data, totalPages } = await getAdminNews(currentPage)

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Berita"
                description="Kelola daftar berita puskesmas"
                linkHref="/admin/news/create-news"
                linkLabel="Tambah Berita"
            />

            <div className={cn(
                "rounded-xl bg-muted/50 border border-border mt-6 p-5 min-h-[500px] flex flex-col",
                data.length === 0 && "justify-center"
            )}>
                {data.length === 0 ? (
                    <Empty className="flex flex-col items-center text-center">
                        <EmptyHeader className="flex flex-col items-center">
                            <EmptyMedia variant="icon" className="mb-4 bg-background p-4 rounded-full shadow-sm">
                                <Newspaper className="w-10 h-10 text-primary/40" />
                            </EmptyMedia>
                            <EmptyTitle className="text-xl font-bold">
                                Tidak ada berita
                            </EmptyTitle>
                            <EmptyDescription className="max-w-[300px] mx-auto text-muted-foreground">
                                Belum ada berita yang diunggah.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.map((item: Berita) => (
                            <NewsCard
                                key={item.id}
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
