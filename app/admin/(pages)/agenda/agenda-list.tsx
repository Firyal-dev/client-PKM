'use client'

import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Agenda } from "@/types/agenda-prop"
import { deleteAgenda } from "@/services/agenda/agenda-service"
import { Trash2, Edit, CalendarDays, MapPin, Clock } from "lucide-react"
import { toast } from "sonner"
import { useTransition } from "react"
import { format, isValid } from "date-fns" // Import isValid
import { id } from "date-fns/locale"

export function AgendaList({ initialAgendas }: { initialAgendas: Agenda[] }) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = (id: string) => {
        startTransition(async () => {
            const result = await deleteAgenda(id)
            if (result.success) {
                toast.success("Agenda berhasil dihapus")
            } else {
                toast.error(result.error || "Gagal menghapus agenda")
            }
        })
    }

    if (initialAgendas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-xl border border-dashed text-center">
                <CalendarDays className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Tidak ada agenda</h3>
                <p className="text-muted-foreground max-w-xs">Belum ada data agenda yang ditambahkan.</p>
            </div>
        )
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Kegiatan</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Waktu</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialAgendas.map((agenda) => {
                        // --- LOGIC PENGECEKAN TANGGAL YANG AMAN ---
                        
                        // 1. Parsing Start Date
                        const startDateObj = new Date(agenda.date);
                        const isStartDateValid = isValid(startDateObj);

                        // 2. Parsing Effective Date (Tanggal Selesai)
                        let effectiveDateObj: Date | null = null;
                        if (agenda.effective_date) {
                            const d = new Date(agenda.effective_date);
                            if (isValid(d)) {
                                effectiveDateObj = d;
                            }
                        }

                        // 3. Cek apakah Multi Day
                        const isMultiDay = isStartDateValid && 
                                           effectiveDateObj && 
                                           format(startDateObj, 'yyyy-MM-dd') !== format(effectiveDateObj, 'yyyy-MM-dd');

                        return (
                            <TableRow key={agenda._id}>
                                <TableCell className="font-medium max-w-[250px] truncate">
                                    {agenda.activity_name}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col text-sm">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="w-3 h-3 text-muted-foreground" />
                                            <span>
                                                {isStartDateValid 
                                                    ? format(startDateObj, "d MMM yyyy", { locale: id }) 
                                                    : <span className="text-red-500 text-xs">Tanggal Invalid</span>
                                                }
                                            </span>
                                        </div>
                                        {/* Tampilkan rentang HANYA jika tanggal valid & beda hari */}
                                        {isMultiDay && effectiveDateObj && (
                                            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                                                <span className="text-xs ml-5">s/d</span>
                                                <span>
                                                    {format(effectiveDateObj, "d MMM yyyy", { locale: id })}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-3 h-3 text-muted-foreground" />
                                        {/* Tampilkan field time langsung */}
                                        {agenda.time}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        {agenda.location}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/admin/agenda/edit-agenda/${agenda._id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Hapus Agenda?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Anda akan menghapus agenda <strong>{agenda.activity_name}</strong>. Tindakan ini tidak dapat dibatalkan.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(agenda._id)}
                                                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer"
                                                    >
                                                        Hapus
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}