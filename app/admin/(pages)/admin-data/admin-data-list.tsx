'use client'

import { useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Pencil, Trash2, Shield, ShieldCheck, Search, X, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"
import { format, parseISO } from "date-fns"
import { id } from "date-fns/locale"
import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { deleteAdmin } from "@/services/admin/admin-data-service"
import { Admin } from "@/types/admin"
import Image from "next/image"
import { getMediaUrl } from "@/lib/getMediaUrl"
import { EditAdminDialog } from "./create-admin-dialog"
import { cn } from "@/lib/utils"

export default function AdminDataList({
    initialData,
    total,
    currentPage,
    totalPages,
    currentAdmin
}: {
    initialData: Admin[];
    total: number;
    currentPage: number;
    totalPages: number;
    currentAdmin?: { id: string; name: string } | null | undefined;
}) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [admins] = useState<Admin[]>(initialData)
    const [globalFilter, setGlobalFilter] = useState(searchParams.get("search") || "")
    const [roleFilter, setRoleFilter] = useState(searchParams.get("role") || "all")
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
    const [deleteAdminId, setDeleteAdminId] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedRows, setSelectedRows] = useState<Admin[]>([])
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)
    const [isBulkDeleting, setIsBulkDeleting] = useState(false)

    const currentUserInSelection = selectedRows.find(admin => admin.id === currentAdmin?.id)

    const filteredAdmins = useMemo(() => {
        let result = [...admins]
        if (globalFilter) {
            const search = globalFilter.toLowerCase()
            result = result.filter(a => a.name.toLowerCase().includes(search))
        }
        if (roleFilter !== "all") result = result.filter(a => a.role === roleFilter)
        return result
    }, [admins, globalFilter, roleFilter])

    const columns: ColumnDef<Admin>[] = useMemo(() => [
        {
            id: "index",
            header: "#",
            cell: ({ row }) => (
                <span className="text-xs tabular-nums text-muted-foreground">{row.index + 1}</span>
            ),
            size: 40,
        },
        {
            accessorKey: "name",
            header: "Nama",
            cell: ({ row }) => {
                const admin = row.original
                return (
                    <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted shrink-0 border border-border/50">
                            <Image
                                src={admin.photo ? getMediaUrl(admin.photo) || "/userPlaceholder.jpg" : "/userPlaceholder.jpg"}
                                alt={admin.name}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                        <span className="font-semibold text-sm text-foreground">{admin.name}</span>
                    </div>
                )
            },
        },
        {
            accessorKey: "role",
            header: "Level",
            cell: ({ row }) => {
                const role = row.getValue("role") as string
                return role === "SUPER_ADMIN" ? (
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                        <ShieldCheck className="w-3 h-3" /> Super Admin
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
                        <Shield className="w-3 h-3" /> Operator
                    </span>
                )
            },
        },
        {
            id: "createdAt",
            accessorKey: "created_at",
            header: "Tanggal Dibuat",
            cell: ({ row }) => {
                const admin = row.original
                return (
                    <span className="text-xs text-muted-foreground">
                        {admin.created_at ? format(parseISO(admin.created_at), 'dd MMM yyyy', { locale: id }) : '—'}
                    </span>
                )
            },
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => {
                const admin = row.original
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                <DropdownMenuItem onClick={() => setEditingAdmin(admin)} className="gap-2 cursor-pointer rounded-lg">
                                    <Pencil className="h-3.5 w-3.5" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setDeleteAdminId(admin.id)} className="gap-2 cursor-pointer rounded-lg text-destructive focus:text-destructive">
                                    <Trash2 className="h-3.5 w-3.5" /> Hapus
                                </DropdownMenuItem>
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
        router.push(`/admin/admin-data?${params.toString()}`)
    }

    const handleRoleFilter = (value: string) => {
        setRoleFilter(value)
        const params = new URLSearchParams(searchParams.toString())
        value && value !== "all" ? params.set("role", value) : params.delete("role")
        router.push(`/admin/admin-data?${params.toString()}`)
    }

    const handleReset = () => {
        setGlobalFilter("")
        setRoleFilter("all")
        router.push("/admin/admin-data")
    }

    const handleDelete = async () => {
        if (!deleteAdminId) return
        setIsSubmitting(true)
        try {
            const result = await deleteAdmin(deleteAdminId)
            if (result.success) {
                toast.success("Admin berhasil dihapus")
                setDeleteAdminId(null)
                router.refresh()
            } else {
                toast.error(result.error || "Gagal menghapus admin")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const currentRoleFilter = searchParams.get("role") || "all"
    const hasFilter = currentRoleFilter !== "all" || !!globalFilter

    return (
        <div className="space-y-4">
            {/* Filter row */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-1 flex-wrap">
                    <div className="relative flex-1 min-w-[180px] max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama admin..."
                            value={globalFilter}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-8 h-9 rounded-xl text-sm"
                        />
                    </div>
                    <Select value={currentRoleFilter} onValueChange={handleRoleFilter}>
                        <SelectTrigger className="w-[160px] h-9 rounded-xl border-border/60 text-sm">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                                <SelectValue placeholder="Semua Role" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all">Semua Role</SelectItem>
                            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                            <SelectItem value="OPERATOR">Operator</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasFilter && (
                        <Button variant="ghost" size="sm" onClick={handleReset} className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground rounded-xl gap-1">
                            <X className="w-3.5 h-3.5" /> Reset
                        </Button>
                    )}
                </div>
                <div className="text-xs text-muted-foreground bg-muted/50 border border-border/50 px-3 py-1.5 rounded-full font-medium shrink-0">
                    {total} admin
                </div>
            </div>

            {/* Bulk action section - Current user warning */}
            {currentUserInSelection && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg">
                    <div className="flex-1">
                        <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
                            ⚠️ Akun yang sedang Anda gunakan ({currentUserInSelection.name}) dipilih
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                            Jika akun ini dihapus, Anda akan logout secara otomatis
                        </p>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            setSelectedRows(selectedRows.filter(a => a.id !== currentAdmin?.id))
                        }}
                    >
                        Batalkan Pilihan
                    </Button>
                </div>
            )}

            {/* Bulk delete section */}
            {selectedRows.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg">
                    <span className="text-sm text-red-700 dark:text-red-400 flex-1">
                        {selectedRows.length} admin dipilih
                    </span>
                    <ConfirmDialog
                        open={showBulkDeleteDialog}
                        onOpenChange={setShowBulkDeleteDialog}
                        title="Hapus Admin Terpilih?"
                        description={`${selectedRows.length} admin akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
                        onConfirm={async () => {
                            setIsBulkDeleting(true)
                            try {
                                await Promise.all(selectedRows.map(admin => deleteAdmin(admin.id)))
                                toast.success(`${selectedRows.length} admin berhasil dihapus`)
                                setShowBulkDeleteDialog(false)
                                setSelectedRows([])
                                router.refresh()
                            } catch (error) {
                                toast.error("Gagal menghapus beberapa admin")
                            } finally {
                                setIsBulkDeleting(false)
                            }
                        }}
                        confirmText="Hapus"
                        isLoading={isBulkDeleting}
                        trigger={
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setShowBulkDeleteDialog(true)}
                                disabled={currentUserInSelection !== undefined}
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
                    data={filteredAdmins}
                    hidePagination={false}
                    enableRowSelection={true}
                    onRowSelectionChange={setSelectedRows}
                />
            </div>

            <EditAdminDialog
                admin={editingAdmin as Admin}
                open={!!editingAdmin}
                onOpenChange={(open) => !open && setEditingAdmin(null)}
            />
            <ConfirmDialog
                open={!!deleteAdminId}
                onOpenChange={(open) => !open && setDeleteAdminId(null)}
                onConfirm={handleDelete}
                title="Hapus Admin?"
                description="Admin ini akan dihapus secara permanen dan tidak dapat dikembalikan."
                confirmText="Hapus"
                isLoading={isSubmitting}
            />
        </div>
    )
}