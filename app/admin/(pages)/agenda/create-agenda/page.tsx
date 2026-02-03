import { CreateAgendaForm } from "./create-agenda-form"
import { PageHeader } from "@/components/admin/page-header"

export default function CreateAgendaPage() {
    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Tambah Agenda Baru"
                description="Tambahkan agenda baru ke dalam sistem"
                linkHref="/admin/agenda"
                linkLabel="Kembali"
            />
            <div className="mt-6">
                <CreateAgendaForm />
            </div>
        </div>
    )
}