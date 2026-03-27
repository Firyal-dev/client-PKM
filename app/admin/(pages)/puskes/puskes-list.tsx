'use client'

import { BulkActionBar } from "@/components/admin/bulk-action-bar"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Puskesmas, deletePuskesmasAction } from "@/services/puskesmas/puskesmas-service"
import { Building2, Edit, Search, SlidersHorizontal, Trash2, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMemo, useState, useTransition } from "react"
import { toast } from "sonner"
import { UpdatePuskesDialog } from "./puskes-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function PuskesmasList({
    puskesmas,
    total,
    totalPages,
    currentPage
}: {
    puskesmas: Puskesmas[]
    total: number
    totalPages: number
    currentPage: number
}) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [globalFilter, setGlobalFilter] = useState(searchParams.get("search") || "")
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all")
    const [selectedRows, setSelectedRows] = useState<Puskesmas[]>([])
    const [isPending, startTransition] = useTransition()
    const [editPuskes, setEditPuskes] = useState<Puskesmas | null>(null)

    const filteredData = useMemo(() => {
        let result = [...puskesmas]
        if (globalFilter) {
            const search = globalFilter.toLowerCase()
            result = result.filter(p => p.name.toLowerCase().includes(search) || p.slug.toLowerCase().includes(search))
        }
        if (statusFilter !== "all") {
            result = result.filter(p => p.status === statusFilter)
        }
        return result
    }, [puskesmas, globalFilter, statusFilter])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <Badge className="bg-green-500">Aktif</Badge>
            case 'INACTIVE':
                return <Badge variant="secondary">Tidak Aktif</Badge>
            case 'SUSPENDED':
                return <Badge variant="destructive">Ditangguhkan</Badge>
            case 'MAINTENANCE':
                return <Badge className="bg-orange-500 hover:bg-orange-600 border-none">Maintenance</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const columns: import("@tanstack/react-table").ColumnDef<Puskesmas>[] = useMemo(() => [
        {
            id: "index",
            header: "#",
            cell: ({ row }) => (
                <span className="text-xs tabular-nums text-muted-foreground">{row.index + 1}</span>
            ),
            size: 40,
        },
        {
            id: "name",
            accessorKey: "name",
            header: "Nama Puskesmas",
            cell: ({ row }) => {
                const p = row.original
                return (
                    <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{p.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{p.slug}</p>
                        </div>
                    </div>
                )
            },
        },
        {
            id: "status",
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => getStatusBadge(row.original.status),
        },
        {
            id: "reason",
            header: "Keterangan",
            cell: ({ row }) => {
                const p = row.original
                let reason = ""
                if (p.status === 'SUSPENDED') reason = p.suspended_reason || "-"
                if (p.status === 'MAINTENANCE') reason = p.maintenance_message || "-"
                if (p.status === 'INACTIVE') reason = p.deactivated_reason || "-"

                return <span className="text-xs text-muted-foreground line-clamp-2 max-w-[200px]">{reason || "-"}</span>
            },
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => {
                const p = row.original
                return (
                    <div className="text-right flex items-center justify-end gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                            onClick={() => setEditPuskes(p)}
                        >
                            <Edit className="h-3.5 w-3.5" />
                        </Button>

                        <ConfirmDialog
                            trigger={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full text-destructive hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/30"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            }
                            title="Hapus Puskesmas?"
                            description={`Puskesmas "${p.name}" akan dihapus secara permanen.`}
                            confirmText="Hapus"
                            onConfirm={async () => {
                                try {
                                    const res = await deletePuskesmasAction(p.id)
                                    if (res.success) {
                                        toast.success("Puskesmas berhasil dihapus")
                                        router.refresh()
                                    } else {
                                        toast.error(res.error || "Gagal menghapus puskesmas")
                                    }
                                } catch (error) {
                                    toast.error("Gagal menghapus puskesmas")
                                }
                            }}
                        />
                    </div>
                )
            },
        },
    ], [router])

    const handleSearch = (value: string) => {
        setGlobalFilter(value)
        const params = new URLSearchParams(searchParams.toString())
        value ? params.set("search", value) : params.delete("search")
        router.push(`/admin/puskes?${params.toString()}`)
    }

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value)
        const params = new URLSearchParams(searchParams.toString())
        value && value !== "all" ? params.set("status", value) : params.delete("status")
        router.push(`/admin/puskes?${params.toString()}`)
    }

    const handleReset = () => {
        setGlobalFilter("")
        setStatusFilter("all")
        router.push("/admin/puskes")
    }

    const hasFilter = statusFilter !== "all" || !!globalFilter
    const currentStatusFilter = searchParams.get("status") || "all"

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectedRows.map(p => deletePuskesmasAction(p.id)))
            toast.success(`${selectedRows.length} puskesmas berhasil dihapus`)
            setSelectedRows([])
            router.refresh()
        } catch (error) {
            toast.error("Gagal menghapus beberapa puskesmas")
        }
    }

    return (
        <div className="space-y-4">
            {editPuskes && (
                <UpdatePuskesDialog
                    puskesmas={editPuskes}
                    open={!!editPuskes}
                    onOpenChange={(open) => !open && setEditPuskes(null)}
                />
            )}

            {/* Filter row */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-1 flex-wrap">
                    <div className="relative flex-1 min-w-[180px] max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama atau slug..."
                            value={globalFilter}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-8 h-9 rounded-xl text-sm"
                        />
                    </div>
                    <Select value={currentStatusFilter} onValueChange={handleStatusFilter}>
                        <SelectTrigger className="w-[160px] h-9 rounded-xl border-border/60 text-sm">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                                <SelectValue placeholder="Semua Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="ACTIVE">Aktif</SelectItem>
                            <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                            <SelectItem value="SUSPENDED">Ditangguhkan</SelectItem>
                            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasFilter && (
                        <Button variant="ghost" size="sm" onClick={handleReset} className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground rounded-xl gap-1">
                            <X className="w-3.5 h-3.5" /> Reset
                        </Button>
                    )}
                </div>
                <div className="text-xs text-muted-foreground bg-muted/50 border border-border/50 px-3 py-1.5 rounded-full font-medium shrink-0">
                    {total} puskesmas
                </div>
            </div>

            {/* Bulk Action Bar */}
            <BulkActionBar
                selectedCount={selectedRows.length}
                label="puskesmas"
                onCancel={() => setSelectedRows([])}
                onConfirm={() => startTransition(handleBulkDelete)}
                isPending={isPending}
                title="Hapus Puskesmas Terpilih?"
                description={`${selectedRows.length} puskesmas akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
            />

            {/* DataTable */}
            <div className="rounded-xl border border-border/60 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    hidePagination={true}
                    enableRowSelection={true}
                    onRowSelectionChange={setSelectedRows}
                />
            </div>
        </div>
    )
}
