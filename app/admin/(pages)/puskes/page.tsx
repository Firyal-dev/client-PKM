import { PageHeader } from "@/components/admin/page-header"
import { getAdminPuskesmasList } from "@/services/puskesmas/puskesmas-service"
import { getAdminProfile } from "@/services/admin/admin-service"
import { redirect } from "next/navigation"
import { PuskesmasList } from "./puskes-list"
import { PaginationControl } from "@/components/pagination-control"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function PuskesmasPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const profile = await getAdminProfile()

    // Hanya SUPER_ADMIN yang bisa mengakses halaman ini
    if (!profile || profile.role !== 'SUPER_ADMIN') {
        redirect('/admin/dashboard')
    }

    const params = await searchParams
    const currentPage = Number(params.page) || 1
    const { data, totalPages } = await getAdminPuskesmasList(currentPage, 10);

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Kelola Puskesmas"
                description="Kelola data puskes yang terdaftar dalam sistem"
                linkHref="/admin/puskes/create-puskes"
                linkLabel="Tambah Puskesmas"
            />

            <div className={cn(
                "rounded-xl bg-muted/50 border border-border mt-6 p-5 min-h-[500px] flex flex-col",
                data.length === 0 && "justify-center"
            )}>
                {data.length === 0 ? (
                    <Empty className="flex flex-col items-center text-center">
                        <EmptyHeader className="flex flex-col items-center">
                            <EmptyMedia variant="icon" className="mb-4 bg-background p-4 rounded-full shadow-sm">
                                <Building2 className="w-10 h-10 text-primary/40" />
                            </EmptyMedia>
                            <EmptyTitle className="text-xl font-bold">
                                Belum ada puskes
                            </EmptyTitle>
                            <EmptyDescription className="max-w-[300px] mx-auto text-muted-foreground">
                                Tambahkan puskes pertama untuk memulai mengelola sistem.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <PuskesmasList puskesmas={data} />
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
