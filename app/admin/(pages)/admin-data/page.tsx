import { PageHeader } from "@/components/admin/page-header"
import { getAdmins } from "@/services/admin/admin-data-service"
import { getAdminProfile } from "@/services/admin/admin-service"
import AdminDataList from "./admin-data-list"
import { CreateAdminDialog } from "./create-admin-dialog"
import { cn } from "@/lib/utils"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Users } from "lucide-react"

export default async function AdminDataPage({ searchParams }: { searchParams: Promise<{ search?: string; level?: string; page?: string }> }) {
    const params = await searchParams
    const page = parseInt(params.page || '1')
    const limit = 10
    const offset = (page - 1) * limit

    const { data: initialData, total } = await getAdmins(params.search, params.level, limit, offset)
    const currentAdmin = await getAdminProfile()
    const isEmpty = initialData.length === 0 && !params.search && !params.level
    const totalPages = Math.ceil(total / limit)

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Data Admin"
                description="Kelola data administrator sistem"
            >
                <CreateAdminDialog />
            </PageHeader>

            <div className={cn(
                "mt-6 rounded-2xl border border-border/60 bg-muted/30 p-5 min-h-[500px] flex flex-col",
                isEmpty && "items-center justify-center"
            )}>
                {isEmpty ? (
                    <Empty className="flex flex-col items-center text-center max-w-xs mx-auto">
                        <EmptyHeader className="flex flex-col items-center gap-3">
                            <EmptyMedia variant="icon" className="mb-2 bg-background border border-border/60 p-5 rounded-2xl shadow-sm">
                                <Users className="w-10 h-10 text-primary/30" />
                            </EmptyMedia>
                            <EmptyTitle className="text-lg font-bold">
                                Belum ada admin
                            </EmptyTitle>
                            <EmptyDescription className="text-sm text-muted-foreground leading-relaxed">
                                Tambahkan administrator pertama untuk mengelola sistem.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <AdminDataList initialData={initialData} total={total} currentPage={page} totalPages={totalPages} currentAdmin={currentAdmin} />
                )}
            </div>
        </div>
    )
}