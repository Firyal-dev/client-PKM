import { PageHeader } from "@/components/admin/page-header"
import { PaginationControl } from "@/components/pagination-control"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { MessageCircleQuestion } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAdminConsultationList } from "@/services/consultation/consultation-service"
import { ConsultationList } from "./consultation-list"
import { ConsultationProp } from "@/types/consultation-prop"

export default async function ConsultationPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams
    const currentPage = Number(params.page) || 1
    const { data, totalPages } = await getAdminConsultationList(currentPage, 10)

    const unanswered = data.filter((d: ConsultationProp) => !d.is_answer).length

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Konsultasi"
                description="Kelola tanya jawab dan konsultasi dari pengguna"
            />

            <div className={cn(
                "rounded-2xl bg-muted/30 border border-border/60 mt-6 p-5 min-h-[500px] flex flex-col",
                data.length === 0 && "justify-center items-center mt-6"
            )}>
                {data.length === 0 ? (
                    <Empty className="flex flex-col items-center text-center max-w-xs mx-auto">
                        <EmptyHeader className="flex flex-col items-center gap-3">
                            <EmptyMedia variant="icon" className="mb-2 bg-background border border-border/60 p-5 rounded-2xl shadow-sm">
                                <MessageCircleQuestion className="w-10 h-10 text-primary/30" />
                            </EmptyMedia>
                            <EmptyTitle className="text-lg font-bold">
                                Belum ada konsultasi
                            </EmptyTitle>
                            <EmptyDescription className="text-sm text-muted-foreground leading-relaxed">
                                Pertanyaan dari pengguna akan muncul di sini.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <ConsultationList consultations={data} />
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