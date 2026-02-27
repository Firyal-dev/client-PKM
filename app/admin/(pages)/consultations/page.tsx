import { PageHeader } from "@/components/admin/page-header"
import { PaginationControl } from "@/components/pagination-control"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { MessageCircleQuestion } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAdminConsultationList } from "@/services/consultation/consultation-service"
import { ConsultationList } from "./consultation-list"

export default async function ConsultationPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams
    const currentPage = Number(params.page) || 1
    const { data, totalPages } = await getAdminConsultationList(currentPage, 10)

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Konsultasi"
                description="Kelola tanya jawab dan konsultasi dari pengguna"
            />

            <div className={cn(
                "rounded-xl bg-muted/50 border border-border mt-6 p-5 min-h-[500px] flex flex-col",
                data.length === 0 && "justify-center"
            )}>
                {data.length === 0 ? (
                    <Empty className="flex flex-col items-center text-center">
                        <EmptyHeader className="flex flex-col items-center">
                            <EmptyMedia variant="icon" className="mb-4 bg-background p-4 rounded-full shadow-sm">
                                <MessageCircleQuestion className="w-10 h-10 text-primary/40" />
                            </EmptyMedia>
                            <EmptyTitle className="text-xl font-bold">
                                Tidak ada konsultasi
                            </EmptyTitle>
                            <EmptyDescription className="max-w-[300px] mx-auto text-muted-foreground">
                                Belum ada pertanyaan konsultasi yang masuk.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <ConsultationList consultations={data} />
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
