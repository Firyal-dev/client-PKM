import { getAdminStaticPages } from "@/services/static-page/static-page-service"
import { PageHeader } from "@/components/admin/page-header"
import { StaticPageList } from "./static-page-list"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { PaginationControl } from "@/components/pagination-control"

export default async function StaticPagesPage({
    searchParams,
}: {
    searchParams: { page?: string; search?: string }
}) {
    const page = Number(searchParams.page) || 1
    const { data: staticPages, total, lastPage } = await getAdminStaticPages(page, 10)

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Halaman Statis"
                description="Kelola halaman statis website"
                linkHref="/admin/static-pages/create-page"
                linkLabel="Tambah Halaman"
            />

            <div className={cn(
                "rounded-xl bg-muted/30 border border-border mt-6 p-5 min-h-[500px] flex flex-col",
                staticPages.length === 0 && "items-center justify-center"
            )}>
                {staticPages.length === 0 ? (
                    <Empty className="flex flex-col items-center text-center py-16">
                        <EmptyHeader className="flex flex-col items-center gap-3">
                            <EmptyMedia variant="icon" className="bg-background border border-border p-4 rounded-xl shadow-sm">
                                <FileText className="w-8 h-8 text-muted-foreground/50" />
                            </EmptyMedia>
                            <div>
                                <EmptyTitle className="text-base font-semibold">Belum ada halaman statis</EmptyTitle>
                                <EmptyDescription className="text-sm text-muted-foreground mt-1">
                                    Tambahkan halaman pertama untuk mulai mengelola konten statis.
                                </EmptyDescription>
                            </div>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <StaticPageList
                        staticPages={staticPages}
                        pagination={{ page, total, lastPage }}
                    />
                )}
            </div>

            {lastPage > 1 && (
                <div className="mt-6">
                    <PaginationControl totalPages={lastPage} currentPage={page} />
                </div>
            )}
        </div>
    )
}