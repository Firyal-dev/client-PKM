import { AgendaForm } from "../agenda-form"
import { PageHeader } from "@/components/admin/page-header"
import { createAgendaAction } from "@/services/agenda/agenda-service"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function CreateAgendaPage() {
    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Tambah Agenda Baru"
                description="Tambahkan agenda baru ke dalam sistem"
            >
                <Link href="/admin/agenda">
                    <Button variant="outline" className="gap-2 rounded-xl">
                        <ChevronLeft className="w-4 h-4" /> Kembali
                    </Button>
                </Link>
            </PageHeader>
            <div className="mt-8 max-w-4xl">
                <AgendaForm action={createAgendaAction} />
            </div>
        </div>
    )
}