import { PageHeader } from "@/components/admin/page-header"
import { MenuList } from "./menu-list"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Menu as MenuIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAdminMenus } from "@/services/menu/menu-service"
import { PaginationControl } from "@/components/pagination-control"

export default async function MenusPage({
    searchParams,
}: {
    searchParams: { page: string; search?: string; type?: string }
}) {
    const params = await searchParams
    const currentPage = Number(params.page) || 1
    const search = params.search || ""
    const type = params.type || ""

    const { data, totalPages, total } = await getAdminMenus({
        page: currentPage,
        limit: 10,
        search: search || undefined,
        type: type || undefined,
    })

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Menu"
                description="Kelola menu navigasi website"
                linkHref="/admin/menus/create-menu"
                linkLabel="Tambah Menu"
            />

            <div
                className={cn(
                    "mt-6 rounded-xl border border-border bg-muted/30 p-5 min-h-[500px] flex flex-col",
                    data.length === 0 && !search && !type && "items-center justify-center"
                )}
            >
                {data.length === 0 && !search && !type ? (
                    <Empty className="flex flex-col items-center text-center py-16">
                        <EmptyHeader className="flex flex-col items-center gap-3">
                            <EmptyMedia variant="icon" className="bg-background border border-border p-4 rounded-xl shadow-sm">
                                <MenuIcon className="w-8 h-8 text-muted-foreground/50" />
                            </EmptyMedia>
                            <div>
                                <EmptyTitle className="text-base font-semibold">Belum ada menu</EmptyTitle>
                                <EmptyDescription className="text-sm text-muted-foreground mt-1">
                                    Tambahkan menu pertama untuk mulai mengatur navigasi website.
                                </EmptyDescription>
                            </div>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <MenuList menus={data} total={total} />
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