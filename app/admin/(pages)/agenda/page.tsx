import { PageHeader } from "@/components/admin/page-header"
import { getAdminAgendaList } from "@/services/agenda/agenda-service"
import { AgendaList } from "./agenda-list"
import { PaginationControl } from "@/components/pagination-control"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function AgendaPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams
    const currentPage = Number(params.page) || 1
    const { data, totalPages } = await getAdminAgendaList(currentPage, 10);

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Agenda"
                description="Kelola daftar agenda kegiatan puskesmas"
                linkHref="/admin/agenda/create-agenda"
                linkLabel="Tambah Agenda"
            />

            <div className={cn(
                "rounded-xl bg-muted/50 border border-border mt-6 p-5 min-h-[500px] flex flex-col",
                data.length === 0 && "justify-center"
            )}>
                {data.length === 0 ? (
                    <Empty className="flex flex-col items-center text-center">
                        <EmptyHeader className="flex flex-col items-center">
                            <EmptyMedia variant="icon" className="mb-4 bg-background p-4 rounded-full shadow-sm">
                                <CalendarDays className="w-10 h-10 text-primary/40" />
                            </EmptyMedia>
                            <EmptyTitle className="text-xl font-bold">
                                Tidak ada agenda
                            </EmptyTitle>
                            <EmptyDescription className="max-w-[300px] mx-auto text-muted-foreground">
                                Belum ada agenda yang dijadwalkan.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <AgendaList agendas={data} />
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