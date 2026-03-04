import type { Metadata } from "next"
import { getPublicAgenda } from "@/services/agenda/agenda-service"
import AgendaPageContent from "@/components/user/sections/agenda-page-content"

export const metadata: Metadata = {
    title: "Agenda Kegiatan - Puskesmas",
    description: "Jadwal kegiatan pelayanan, penyuluhan, dan agenda operasional Puskesmas terbaru.",
}

export default async function AgendaPage() {
    // Ambil semua agenda (limit besar untuk kalender)
    const agendasRes = await getPublicAgenda(1, 100);

    return (
        <main className="min-h-screen bg-slate-50/50">
            <AgendaPageContent
                initialAgendas={agendasRes.data}
            />
        </main>
    )
}
