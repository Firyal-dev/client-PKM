'use client'

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Pencil, Trash2, CalendarDays, MapPin, Clock, MoreVertical } from "lucide-react"
import { toast } from "sonner"
import { format, isValid, isAfter, isBefore, parseISO } from "date-fns"
import { id } from "date-fns/locale"
import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { SearchFilter } from "@/components/admin/SearchFilter"
import { deleteAgendaAction } from "@/services/agenda/agenda-service"
import { Agenda } from "@/types/agenda-prop"
import { cn } from "@/lib/utils"

export function AgendaList({ agendas }: { agendas: Agenda[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [globalFilter, setGlobalFilter] = useState(searchParams.get("search") || "")
    const [dateFilter, setDateFilter] = useState(searchParams.get("dateFilter") || "all")
    const [selectedRows, setSelectedRows] = useState<Agenda[]>([])
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)
    const [isBulkDeleting, setIsBulkDeleting] = useState(false)

    const filteredAgendas = useMemo(() => {
        let result = [...agendas]
        if (globalFilter) {
            const search = globalFilter.toLowerCase()
            result = result.filter(a =>
                a.activity_name.toLowerCase().includes(search) ||
                a.location.toLowerCase().includes(search)
            )
        }
        if (dateFilter !== "all") {
            const now = new Date()
            result = result.filter(a => {
                const d = parseISO(a.date)
                if (!isValid(d)) return false
                const today = format(now, 'yyyy-MM-dd')
                const aDay = format(d, 'yyyy-MM-dd')
                if (dateFilter === "upcoming") return isAfter(d, now) || aDay === today
                if (dateFilter === "past") return isBefore(d, now) && aDay !== today
                return true
            })
        }
        result.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
        return result
    }, [agendas, globalFilter, dateFilter])

    const columns: ColumnDef<Agenda>[] = useMemo(() => [
        {
            accessorKey: "activity_name",
            header: "Nama Kegiatan",
            cell: ({ row }) => (
                <span className="font-semibold text-sm text-foreground">{row.getValue("activity_name")}</span>
            ),
        },
        {
            id: "dateAndTime",
            header: "Tanggal & Waktu",
            cell: ({ row }) => {
                const agenda = row.original
                const start = new Date(agenda.date)
                if (!isValid(start)) return null

                const now = new Date()
                const startDay = format(start, 'yyyy-MM-dd')
                const today = format(now, 'yyyy-MM-dd')
                const isUpcoming = isAfter(start, now) || startDay === today

                const effectiveDate = agenda.effective_date ? parseISO(agenda.effective_date) : null
                const startStr = format(start, "d MMM yyyy", { locale: id })
                const dateDisplay = effectiveDate && isValid(effectiveDate) && startDay !== format(effectiveDate, 'yyyy-MM-dd')
                    ? `${startStr} – ${format(effectiveDate, "d MMM yyyy", { locale: id })}`
                    : startStr

                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5 text-sm">
                                <CalendarDays className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                <span>{dateDisplay}</span>
                            </div>
                            <span className={cn(
                                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                isUpcoming
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                    : "bg-muted text-muted-foreground"
                            )}>
                                {isUpcoming ? "Akan Datang" : "Selesai"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 shrink-0" />
                            {agenda.time}
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "location",
            header: "Lokasi",
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground max-w-[200px]">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{row.getValue("location")}</span>
                </div>
            ),
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => {
                const agenda = row.original
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                <DropdownMenuItem asChild className="gap-2 cursor-pointer rounded-lg">
                                    <Link href={`/admin/agenda/${agenda.id}`}>
                                        <Pencil className="h-3.5 w-3.5" /> Edit
                                    </Link>
                                </DropdownMenuItem>
                                <ConfirmDialog
                                    title="Hapus Agenda?"
                                    description={`"${agenda.activity_name}" akan dihapus secara permanen.`}
                                    onConfirm={() => handleDelete(agenda.id)}
                                    trigger={
                                        <DropdownMenuItem
                                            onSelect={(e) => e.preventDefault()}
                                            className="gap-2 cursor-pointer rounded-lg text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" /> Hapus
                                        </DropdownMenuItem>
                                    }
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        },
    ], [])

    const handleSearch = (value: string) => {
        setGlobalFilter(value)
        const params = new URLSearchParams(searchParams.toString())
        value ? params.set("search", value) : params.delete("search")
        params.set("page", "1")
        router.push(`/admin/agenda?${params.toString()}`)
    }

    const handleDateFilter = (value: string) => {
        setDateFilter(value)
        const params = new URLSearchParams(searchParams.toString())
        value && value !== "all" ? params.set("dateFilter", value) : params.delete("dateFilter")
        params.set("page", "1")
        router.push(`/admin/agenda?${params.toString()}`)
    }

    const handleReset = () => {
        setGlobalFilter("")
        setDateFilter("all")
        router.push("/admin/agenda")
    }

    const handleDelete = async (agendaId: string) => {
        const result = await deleteAgendaAction(agendaId)
        if (result.success) {
            toast.success("Agenda berhasil dihapus")
            router.refresh()
        } else {
            toast.error(result.error || "Gagal menghapus agenda")
        }
    }

    const handleBulkDelete = async () => {
        if (selectedRows.length === 0) return
        setIsBulkDeleting(true)
        try {
            await Promise.all(selectedRows.map(agenda => deleteAgendaAction(agenda.id)))
            toast.success(`${selectedRows.length} agenda berhasil dihapus`)
            setShowBulkDeleteDialog(false)
            router.refresh()
        } catch (error) {
            toast.error("Gagal menghapus beberapa agenda")
        } finally {
            setIsBulkDeleting(false)
        }
    }

    const currentDateFilter = searchParams.get("dateFilter") || "all"
    const hasFilter = currentDateFilter !== "all" || !!globalFilter

    return (
        <div className="space-y-4">
            {/* Filter row */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <SearchFilter
                    searchValue={globalFilter}
                    onSearchChange={handleSearch}
                    filters={[
                        {
                            value: currentDateFilter,
                            onChange: handleDateFilter,
                            options: [
                                { value: "all", label: "Semua Tanggal" },
                                { value: "upcoming", label: "Akan Datang" },
                                { value: "past", label: "Selesai" },
                            ],
                            placeholder: "Semua Tanggal"
                        }
                    ]}
                    onReset={handleReset}
                    hasActiveFilter={hasFilter}
                    searchPlaceholder="Cari agenda..."
                />
                <div className="text-xs text-muted-foreground bg-muted/50 border border-border/50 px-3 py-1.5 rounded-full font-medium">
                    {filteredAgendas.length} agenda
                </div>
            </div>

            {/* Bulk delete button */}
            {selectedRows.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg">
                    <span className="text-sm text-red-700 dark:text-red-400 flex-1">
                        {selectedRows.length} agenda dipilih
                    </span>
                    <ConfirmDialog
                        open={showBulkDeleteDialog}
                        onOpenChange={setShowBulkDeleteDialog}
                        title="Hapus Agenda Terpilih?"
                        description={`${selectedRows.length} agenda akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
                        onConfirm={handleBulkDelete}
                        confirmText="Hapus"
                        isLoading={isBulkDeleting}
                        trigger={
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setShowBulkDeleteDialog(true)}
                            >
                                Hapus Terpilih
                            </Button>
                        }
                    />
                </div>
            )}

            {/* DataTable */}
            <div className="rounded-xl border border-border/60 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={filteredAgendas}
                    hidePagination={false}
                    enableRowSelection={true}
                    onRowSelectionChange={setSelectedRows}
                />
            </div>
        </div>
    )
}