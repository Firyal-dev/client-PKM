'use client'

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { User, Eye, EyeOff, Search, X, Filter, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Reviews } from "@/types/review-prop"
import { toggleReviewPublishAction } from "@/services/review/review-service"
import { format, isValid } from "date-fns"
import { id } from "date-fns/locale"
import { toast } from "sonner"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { BulkActionBar } from "@/components/admin/bulk-action-bar"

export function ReviewList({ reviews }: { reviews: Reviews[] }) {
    const [globalFilter, setGlobalFilter] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [publishFilter, setPublishFilter] = useState("all")
    const [selectedRows, setSelectedRows] = useState<Reviews[]>([])
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const filteredReviews = useMemo(() => {
        let result = [...reviews]
        if (globalFilter) {
            const search = globalFilter.toLowerCase()
            result = result.filter(r =>
                r.username?.toLowerCase().includes(search) ||
                r.message.toLowerCase().includes(search) ||
                r.category?.toLowerCase().includes(search)
            )
        }
        if (categoryFilter !== "all") result = result.filter(r => r.category === categoryFilter)
        if (publishFilter !== "all") result = result.filter(r => r.is_publish === (publishFilter === "published"))
        return result
    }, [reviews, globalFilter, categoryFilter, publishFilter])

    const hasFilter = !!globalFilter || categoryFilter !== "all" || publishFilter !== "all"
    const categories = useMemo(() => [...new Set(reviews.map(r => r.category).filter(Boolean))], [reviews])

    const columns: ColumnDef<Reviews>[] = useMemo(() => [
        {
            accessorKey: "username",
            header: "Pengirim",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="font-semibold text-sm text-foreground">
                        {row.getValue("username") || "Anonymous"}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "category",
            header: "Kategori",
            cell: ({ row }) => (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-muted text-muted-foreground capitalize">
                    {row.getValue("category") || "—"}
                </span>
            ),
        },
        {
            accessorKey: "message",
            header: "Pesan",
            cell: ({ row }) => (
                <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3 max-w-[380px]">
                    {row.getValue("message")}
                </p>
            ),
        },
        {
            id: "dateTime",
            header: "Tanggal",
            cell: ({ row }) => {
                const item = row.original
                const date = new Date(item.created_at)
                const dateStr = isValid(date) ? format(date, "d MMM yyyy", { locale: id }) : "—"
                const timeStr = isValid(date) ? format(date, "HH:mm", { locale: id }) : ""
                return (
                    <div className="flex flex-col">
                        <span className="text-xs text-foreground/70">{dateStr}</span>
                        <span className="text-[11px] text-muted-foreground/60">{timeStr}</span>
                    </div>
                )
            },
        },
        {
            accessorKey: "is_publish",
            header: "Status",
            cell: ({ row }) => (
                <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    row.getValue("is_publish")
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-muted text-muted-foreground"
                )}>
                    {row.getValue("is_publish") ? "Ditampilkan" : "Disembunyikan"}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => {
                const item = row.original
                const handleUpdateStatus = (id: string, currentStatus: boolean) => {
                    startTransition(async () => {
                        const result = await toggleReviewPublishAction(id, !currentStatus)
                        if (result?.success) {
                            toast.success(`Ulasan ${!currentStatus ? 'ditampilkan' : 'disembunyikan'}`)
                            router.refresh()
                        } else {
                            toast.error(result.error || "Gagal mengubah status")
                        }
                    })
                }
                return (
                    <div className="text-right">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            disabled={isPending}
                            title={item.is_publish ? "Sembunyikan" : "Tampilkan"}
                            onClick={() => handleUpdateStatus(item.id, item.is_publish)}
                        >
                            {item.is_publish
                                ? <EyeOff className="h-3.5 w-3.5" />
                                : <Eye className="h-3.5 w-3.5" />
                            }
                        </Button>
                    </div>
                )
            },
        },
    ], [isPending, router])

    const handleReset = () => {
        setGlobalFilter("")
        setCategoryFilter("all")
        setPublishFilter("all")
    }

    return (
        <div className="space-y-4">
            {/* Filter row */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-1 flex-wrap">
                    <div className="relative flex-1 min-w-[180px] max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Cari ulasan..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-8 h-9 rounded-xl text-sm"
                        />
                    </div>

                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[150px] h-9 rounded-xl border-border/60 text-sm">
                            <div className="flex items-center gap-2">
                                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                                <SelectValue placeholder="Kategori" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all">Semua Kategori</SelectItem>
                            {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={publishFilter} onValueChange={setPublishFilter}>
                        <SelectTrigger className="w-[150px] h-9 rounded-xl border-border/60 text-sm">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                                <SelectValue placeholder="Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="published">Ditampilkan</SelectItem>
                            <SelectItem value="unpublished">Disembunyikan</SelectItem>
                        </SelectContent>
                    </Select>

                    {hasFilter && (
                        <Button variant="ghost" size="sm" onClick={handleReset} className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground rounded-xl gap-1">
                            <X className="w-3.5 h-3.5" /> Reset
                        </Button>
                    )}
                </div>

                <div className="text-xs text-muted-foreground bg-muted/50 border border-border/50 px-3 py-1.5 rounded-full font-medium shrink-0">
                    {filteredReviews.length} ulasan
                </div>
            </div>

            {/* Bulk Action Bar */}
            <BulkActionBar
                selectedCount={selectedRows.length}
                label="ulasan"
                onCancel={() => setSelectedRows([])}
                onConfirm={() => {
                    startTransition(async () => {
                        try {
                            await Promise.all(selectedRows.map(review => toggleReviewPublishAction(review.id, false)))
                            toast.success(`${selectedRows.length} ulasan berhasil dihapus`)
                            setSelectedRows([])
                            router.refresh()
                        } catch (error) {
                            toast.error("Gagal menghapus beberapa ulasan")
                        }
                    })
                }}
                isPending={isPending}
                title="Hapus Ulasan Terpilih?"
                description={`${selectedRows.length} ulasan akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
            />

            {/* DataTable */}
            <div className="rounded-xl border border-border/60 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={filteredReviews}
                    hidePagination={false}
                    enableRowSelection={true}
                    onRowSelectionChange={setSelectedRows}
                />
            </div>
        </div>
    )
}