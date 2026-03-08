'use client'

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

export function ReviewList({ reviews }: { reviews: Reviews[] }) {
    const [globalFilter, setGlobalFilter] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [publishFilter, setPublishFilter] = useState("all")

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

            {/* Table */}
            <div className="rounded-xl border border-border/60 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pengirim</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kategori</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pesan</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tanggal</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredReviews.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-sm text-muted-foreground">
                                    Tidak ada ulasan yang cocok dengan filter.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredReviews.map((item) => (
                                <ReviewRow key={item.id} item={item} />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function ReviewRow({ item }: { item: Reviews }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

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

    const date = new Date(item.created_at)
    const dateStr = isValid(date) ? format(date, "d MMM yyyy", { locale: id }) : "—"
    const timeStr = isValid(date) ? format(date, "HH:mm", { locale: id }) : ""

    return (
        <TableRow className="group">
            {/* Pengirim */}
            <TableCell>
                <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="font-semibold text-sm text-foreground">
                        {item.username || "Anonymous"}
                    </span>
                </div>
            </TableCell>

            {/* Kategori */}
            <TableCell>
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-muted text-muted-foreground capitalize">
                    {item.category || "—"}
                </span>
            </TableCell>

            {/* Pesan */}
            <TableCell className="max-w-[380px]">
                <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
                    {item.message}
                </p>
            </TableCell>

            {/* Tanggal */}
            <TableCell>
                <div className="flex flex-col">
                    <span className="text-xs text-foreground/70">{dateStr}</span>
                    <span className="text-[11px] text-muted-foreground/60">{timeStr}</span>
                </div>
            </TableCell>

            {/* Status */}
            <TableCell>
                <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    item.is_publish
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-muted text-muted-foreground"
                )}>
                    {item.is_publish ? "Ditampilkan" : "Disembunyikan"}
                </span>
            </TableCell>

            {/* Aksi */}
            <TableCell className="text-right">
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
            </TableCell>
        </TableRow>
    )
}