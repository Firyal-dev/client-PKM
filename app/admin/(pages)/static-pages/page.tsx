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
    const search = searchParams.search

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
                "rounded-xl bg-muted/50 border border-border mt-6 p-5 min-h-[500px] flex flex-col",
                staticPages.length === 0 && "justify-center"
            )}>
                {staticPages.length === 0 ? (
                    <Empty className="flex flex-col items-center text-center">
                        <EmptyHeader className="flex flex-col items-center">
                            <EmptyMedia variant="icon" className="mb-4 bg-background p-4 rounded-full shadow-sm">
                                <FileText className="w-10 h-10 text-primary/40" />
                            </EmptyMedia>
                            <EmptyTitle className="text-xl font-bold">
                                Tidak ada halaman statis
                            </EmptyTitle>
                            <EmptyDescription className="max-w-[300px] mx-auto text-muted-foreground">
                                Belum ada halaman statis yang dibuat.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <StaticPageList
                        staticPages={staticPages}
                        pagination={{
                            page,
                            total,
                            lastPage,
                        }}
                    />
                )}
            </div>

            {lastPage > 1 && (
                <div className="mt-8">
                    <PaginationControl totalPages={lastPage} currentPage={page} />
                </div>
            )}
        </div>
    )
}
