import { PageHeader } from "@/components/admin/page-header"
import { getAgendas } from "@/services/agenda/agenda-service"
import { AgendaList } from "./agenda-list"

export default async function AgendaPage() {
    const response = await getAgendas(1, 100);

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Agenda"
                description="Kelola daftar agenda kegiatan puskesmas"
                linkHref="/admin/agenda/create-agenda"
                linkLabel="Tambah Agenda"
            />

            <div className="mt-6">
                <AgendaList initialAgendas={response.data} />
            </div>
        </div>
    )
}