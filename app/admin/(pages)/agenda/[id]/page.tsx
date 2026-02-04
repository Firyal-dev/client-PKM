import { getAgendaById, updateAgenda } from "@/services/agenda/agenda-service"
import { AgendaForm } from "../agenda-form"
import { PageHeader } from "@/components/admin/page-header"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function EditAgendaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    try {
        const agenda = await getAgendaById(id)
        if (!agenda) return notFound()

        const updateAction = updateAgenda.bind(null, id)

        return (
            <div className="px-5 pb-10">
                <PageHeader
                    title="Edit Agenda"
                    description={`Ubah detail agenda: ${agenda.activity_name}`}
                >
                    <Link href="/admin/agenda">
                        <Button variant="outline" className="gap-2 rounded-xl">
                            <ChevronLeft className="w-4 h-4" /> Kembali
                        </Button>
                    </Link>
                </PageHeader>
                <div className="mt-8 max-w-4xl">
                    <AgendaForm initialData={agenda} action={updateAction} />
                </div>
            </div>
        )
    } catch (error) {
        return notFound()
    }
}
