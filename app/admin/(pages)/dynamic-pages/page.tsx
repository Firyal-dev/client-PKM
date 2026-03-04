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
                "rounded-xl bg-muted/50 border border-border mt-6 p-5 min-h-[500px] flex flex-col",
                data.length === 0 && "justify-center"
            )}>
                {data.length === 0 ? (
                    <Empty className="flex flex-col items-center text-center">
                        <EmptyHeader className="flex flex-col items-center">
                            <EmptyMedia variant="icon" className="mb-4 bg-background p-4 rounded-full shadow-sm">
                                <FileText className="w-10 h-10 text-primary/40" />
                            </EmptyMedia>
                            <EmptyTitle className="text-xl font-bold">
                                Tidak ada halaman dinamis
                            </EmptyTitle>
                            <EmptyDescription className="max-w-[300px] mx-auto text-muted-foreground">
                                Belum ada halaman dinamis yang dibuat.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <PageList pages={data} total={total} />
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
