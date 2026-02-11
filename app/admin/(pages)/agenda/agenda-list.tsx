'use client'

import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"

import { Button } from "@/components/ui/button"
import { Agenda } from "@/types/agenda-prop"
import { deleteAgendaAction } from "@/services/agenda/agenda-service"
import { Trash2, Edit, CalendarDays, MapPin, Clock, ImageOff } from "lucide-react"
import { toast } from "sonner"
import { useTransition } from "react"
import { format, isValid } from "date-fns"
import { id } from "date-fns/locale"

// Tampilan list agenda
export function AgendaList({ agendas }: { agendas: Agenda[] }) {
    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Kegiatan</TableHead>
                        <TableHead>Waktu & Tanggal</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {agendas.map((agenda) => (
                        <AgendaRow key={agenda.id} agenda={agenda} />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

// Tampilan setiap row agenda
function AgendaRow({ agenda }: { agenda: Agenda }) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = (id: string) => {
        startTransition(async () => {
            const result = await deleteAgendaAction(id)
            if (result.success) toast.success("Agenda berhasil dihapus")
            else toast.error(result.error || "Gagal menghapus agenda")
        })
    }

    const renderDate = () => {
        const start = new Date(agenda.date)
        if (!isValid(start)) return <span className="text-red-500 text-xs">Tanggal Invalid</span>

        const startDateStr = format(start, "d MMM yyyy", { locale: id })
        const effectiveDate = agenda.effective_date ? new Date(agenda.effective_date) : null

        if (effectiveDate && isValid(effectiveDate) && format(start, 'yyyy-MM-dd') !== format(effectiveDate, 'yyyy-MM-dd')) {
            return `${startDateStr} - ${format(effectiveDate, "d MMM yyyy", { locale: id })}`
        }
        return startDateStr
    }

    return (
        <TableRow>
            <TableCell className="font-medium max-w-[250px] truncate">
                {agenda.activity_name}
            </TableCell>

            <TableCell>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="w-3 h-3" />
                        <span>{renderDate()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {agenda.time}
                    </div>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="max-w-[150px] truncate">{agenda.location}</span>
                </div>
            </TableCell>

            <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                    <Link href={`/admin/agenda/${agenda.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </Link>
                    <ConfirmDialog
                        trigger={
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" disabled={isPending}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        }
                        title="Hapus Agenda?"
                        description={`Anda akan menghapus ${agenda.activity_name}. Tindakan ini permanen.`}
                        onConfirm={() => handleDelete(agenda.id)}
                        isLoading={isPending}
                        confirmText="Hapus"
                    />
                </div>
            </TableCell>
        </TableRow>
    )
}
