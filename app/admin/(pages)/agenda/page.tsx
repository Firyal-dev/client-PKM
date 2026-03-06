import { PageHeader } from "@/components/admin/page-header"
import { getAdminAgendaList } from "@/services/agenda/agenda-service"
import { AgendaList } from "./agenda-list"
import { PaginationControl } from "@/components/pagination-control"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function AgendaPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string; dateFilter?: string }> }) {
    const params = await searchParams
    const currentPage = Number(params.page) || 1
    const { data, totalPages } = await getAdminAgendaList(currentPage, 10)

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Agenda"
                description="Kelola daftar agenda kegiatan puskesmas"
                linkHref="/admin/agenda/create-agenda"
                linkLabel="Tambah Agenda"
            />

            <div className={cn(
                "rounded-2xl bg-muted/30 border border-border/60 mt-6 p-5 min-h-[500px] flex flex-col",
                data.length === 0 && "justify-center items-center"
            )}>
                {data.length === 0 ? (
                    <Empty className="flex flex-col items-center text-center max-w-xs mx-auto">
                        <EmptyHeader className="flex flex-col items-center gap-3">
                            <EmptyMedia variant="icon" className="mb-2 bg-background border border-border/60 p-5 rounded-2xl shadow-sm">
                                <CalendarDays className="w-10 h-10 text-primary/30" />
                            </EmptyMedia>
                            <EmptyTitle className="text-lg font-bold">
                                Tidak ada agenda
                            </EmptyTitle>
                            <EmptyDescription className="text-sm text-muted-foreground leading-relaxed">
                                Belum ada agenda yang dijadwalkan. Tambahkan agenda kegiatan pertama.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <AgendaList agendas={data} />
                )}
            </div>

            {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <PaginationControl totalPages={totalPages} currentPage={currentPage} />
                </div>
            )}
        </div>
    )
}