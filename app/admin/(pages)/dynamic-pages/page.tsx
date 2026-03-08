import { PageHeader } from "@/components/admin/page-header"
import { PageList } from "./page-list"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAdminPages } from "@/services/page/page-service"
import { PaginationControl } from "@/components/pagination-control"

export default async function PagesPage({ searchParams }: { searchParams: { page: string } }) {
    const params = await searchParams
    const currentPage = Number(params.page) || 1
    const { data, totalPages, total } = await getAdminPages(currentPage, 10)

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Halaman"
                description="Kelola halaman konten website"
                linkHref="/admin/dynamic-pages/create-page"
                linkLabel="Tambah Halaman"
            />

            <div className={cn(
                "rounded-xl bg-muted/30 border border-border mt-6 p-5 min-h-[500px] flex flex-col",
                data.length === 0 && "items-center justify-center"
            )}>
                {data.length === 0 ? (
                    <Empty className="flex flex-col items-center text-center py-16">
                        <EmptyHeader className="flex flex-col items-center gap-3">
                            <EmptyMedia variant="icon" className="bg-background border border-border p-4 rounded-xl shadow-sm">
                                <FileText className="w-8 h-8 text-muted-foreground/50" />
                            </EmptyMedia>
                            <div>
                                <EmptyTitle className="text-base font-semibold">Belum ada halaman</EmptyTitle>
                                <EmptyDescription className="text-sm text-muted-foreground mt-1">
                                    Tambahkan halaman pertama untuk mulai mengelola konten website.
                                </EmptyDescription>
                            </div>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <PageList pages={data} total={total} />
                )}
            </div>

            {totalPages > 1 && (
                <div className="mt-6">
                    <PaginationControl totalPages={totalPages} currentPage={currentPage} />
                </div>
            )}
        </div>
    )
}