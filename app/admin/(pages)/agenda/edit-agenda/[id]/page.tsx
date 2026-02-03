import { getAgendaById } from "@/services/agenda/agenda-service"
import { EditAgendaForm } from "./edit-agenda-form"
import { PageHeader } from "@/components/admin/page-header"

export default async function EditAgendaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const agenda = await getAgendaById(id)

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Edit Agenda"
                description={`Ubah detail agenda: ${agenda.activity_name}`}
                linkHref="/admin/agenda"
                linkLabel="Kembali"
            />
            <div className="mt-6">
                <EditAgendaForm agenda={agenda} />
            </div>
        </div>
    )
}
