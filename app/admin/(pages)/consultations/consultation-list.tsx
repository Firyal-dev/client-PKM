'use client'

import { useState, useMemo, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format, isValid } from "date-fns"
import { id } from "date-fns/locale"
import { 
    User, Mail, Eye, EyeOff, Trash2, Reply, 
    CheckCircle2, Clock, X 
} from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { SearchFilter } from "@/components/admin/SearchFilter"
import { DataTable } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { BulkActionBar } from "@/components/admin/bulk-action-bar"
import { cn } from "@/lib/utils"

import { ConsultationProp } from "@/types/consultation-prop"
import { 
    updateConsultationAction, 
    deleteConsultationAction, 
    replyConsultationAction 
} from "@/services/consultation/consultation-service"

export function ConsultationList({ consultations }: { consultations: ConsultationProp[] }) {
    const [globalFilter, setGlobalFilter] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [publishFilter, setPublishFilter] = useState("all")
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    // State for Bulk Actions
    const [selectedRows, setSelectedRows] = useState<ConsultationProp[]>([])

    // State for Reply Dialog
    const [isReplyOpen, setIsReplyOpen] = useState(false)
    const [selectedConsultation, setSelectedConsultation] = useState<ConsultationProp | null>(null)
    const [answerText, setAnswerText] = useState("")
    const [isReplying, setIsReplying] = useState(false)

    const filteredConsultations = useMemo(() => {
        let result = [...consultations]

        if (globalFilter) {
            const search = globalFilter.toLowerCase()
            result = result.filter(c =>
                c.username.toLowerCase().includes(search) ||
                c.email?.toLowerCase().includes(search) ||
                c.subject.toLowerCase().includes(search) ||
                c.message.toLowerCase().includes(search)
            )
        }

        if (statusFilter !== "all") {
            const isAnswered = statusFilter === "answered"
            result = result.filter(c => c.is_answer === isAnswered)
        }

        if (publishFilter !== "all") {
            const isPublished = publishFilter === "published"
            result = result.filter(c => c.is_publish === isPublished)
        }

        return result
    }, [consultations, globalFilter, statusFilter, publishFilter])

    const handleOpenReply = (item: ConsultationProp) => {
        setSelectedConsultation(item)
        setAnswerText(item.answer || "")
        setIsReplyOpen(true)
    }

    const handleReply = async () => {
        if (!selectedConsultation || !answerText.trim()) {
            toast.error('Mohon isi balasan terlebih dahulu.')
            return
        }
        setIsReplying(true)
        const result = await replyConsultationAction(selectedConsultation.id, answerText)
        setIsReplying(false)
        if (result.success) {
            toast.success('Balasan berhasil dikirim!')
            setIsReplyOpen(false)
            router.refresh()
        } else {
            toast.error(result.error || 'Gagal mengirim balasan')
        }
    }

    const columns: ColumnDef<ConsultationProp>[] = useMemo(() => [
        {
            accessorKey: "username",
            header: "Pengirim",
            cell: ({ row }) => {
                const item = row.original
                return (
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                            <User className="w-3 h-3 text-muted-foreground shrink-0" />
                            <span className="font-semibold text-sm text-foreground">{item.username}</span>
                        </div>
                        {item.email && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Mail className="w-3 h-3 shrink-0" />
                                <span className="truncate max-w-[140px]">{item.email}</span>
                            </div>
                        )}
                    </div>
                )
            },
        },
        {
            accessorKey: "subject",
            header: "Subjek & Pesan",
            cell: ({ row }) => {
                const item = row.original
                return (
                    <div className="flex flex-col gap-1 py-1">
                        <span className="text-sm font-semibold text-foreground truncate">{item.subject}</span>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {item.message}
                        </p>
                    </div>
                )
            }
        },
        {
            accessorKey: "created_at",
            header: "Tanggal",
            cell: ({ row }) => {
                const date = new Date(row.getValue("created_at"))
                const dateStr = isValid(date) ? format(date, "d MMM yyyy", { locale: id }) : "—"
                return <span className="text-xs text-muted-foreground whitespace-nowrap">{dateStr}</span>
            }
        },
        {
            accessorKey: "is_answer",
            header: "Status",
            cell: ({ row }) => {
                const item = row.original
                return (
                    <div className="flex flex-col gap-1.5">
                        <span className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold w-fit",
                            item.is_answer
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        )}>
                            {item.is_answer
                                ? <><CheckCircle2 className="w-2.5 h-2.5" /> Terjawab</>
                                : <><Clock className="w-2.5 h-2.5" /> Menunggu</>
                            }
                        </span>
                        <span className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium w-fit",
                            item.is_publish
                                ? "bg-muted text-muted-foreground"
                                : "bg-muted text-muted-foreground/50"
                        )}>
                            {item.is_publish ? "Ditampilkan" : "Disembunyikan"}
                        </span>
                    </div>
                )
            }
        },
        {
            id: "actions",
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => {
                const item = row.original

                const handleTogglePublish = () => {
                    startTransition(async () => {
                        const result = await updateConsultationAction(item.id, { is_publish: !item.is_publish })
                        if (result.success) {
                            toast.success(`Konsultasi ${!item.is_publish ? 'ditampilkan' : 'disembunyikan'}`)
                            router.refresh()
                        } else {
                            toast.error(result.error || 'Gagal mengubah status')
                        }
                    })
                }

                const handleDelete = () => {
                    startTransition(async () => {
                        const result = await deleteConsultationAction(item.id)
                        if (result.success) {
                            toast.success('Konsultasi berhasil dihapus')
                            router.refresh()
                        } else {
                            toast.error(result.error || 'Gagal menghapus')
                        }
                    })
                }

                return (
                    <div className="flex justify-end items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            title="Balas via email"
                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                            disabled={isPending}
                            onClick={() => handleOpenReply(item)}
                        >
                            <Reply className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            title={item.is_publish ? "Sembunyikan" : "Tampilkan"}
                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            disabled={isPending}
                            onClick={handleTogglePublish}
                        >
                            {item.is_publish
                                ? <EyeOff className="h-3.5 w-3.5" />
                                : <Eye className="h-3.5 w-3.5" />
                            }
                        </Button>
                        <ConfirmDialog
                            trigger={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Hapus"
                                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                    disabled={isPending}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            }
                            title="Hapus Konsultasi?"
                            description="Konsultasi ini akan dihapus secara permanen dan tidak dapat dikembalikan."
                            onConfirm={handleDelete}
                        />
                    </div>
                )
            }
        }
    ], [isPending, router])

    const handleBulkDelete = () => {
        startTransition(async () => {
            try {
                await Promise.all(selectedRows.map(item => deleteConsultationAction(item.id)))
                toast.success(`${selectedRows.length} konsultasi berhasil dihapus`)
                setSelectedRows([])
                router.refresh()
            } catch (error) {
                toast.error("Gagal menghapus beberapa konsultasi")
            }
        })
    }

    const hasFilter = !!globalFilter || statusFilter !== "all" || publishFilter !== "all"

    const handleReset = () => {
        setGlobalFilter("")
        setStatusFilter("all")
        setPublishFilter("all")
    }

    return (
        <div className="space-y-4">
            {/* Filter row */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <SearchFilter
                    searchValue={globalFilter}
                    onSearchChange={setGlobalFilter}
                    filters={[
                        {
                            value: statusFilter,
                            onChange: setStatusFilter,
                            options: [
                                { value: "all", label: "Semua" },
                                { value: "answered", label: "Terjawab" },
                                { value: "unanswered", label: "Menunggu" },
                            ],
                            placeholder: "Status"
                        },
                        {
                            value: publishFilter,
                            onChange: setPublishFilter,
                            options: [
                                { value: "all", label: "Semua" },
                                { value: "published", label: "Ditampilkan" },
                                { value: "unpublished", label: "Disembunyikan" },
                            ],
                            placeholder: "Tampilan"
                        }
                    ]}
                    onReset={handleReset}
                    hasActiveFilter={hasFilter}
                    searchPlaceholder="Cari konsultasi..."
                />
                <div className="text-xs text-muted-foreground bg-muted/50 border border-border/50 px-3 py-1.5 rounded-full font-medium">
                    {filteredConsultations.length} konsultasi
                </div>
            </div>

            {/* Bulk Action Bar */}
            <BulkActionBar
                selectedCount={selectedRows.length}
                label="konsultasi"
                onCancel={() => setSelectedRows([])}
                onConfirm={handleBulkDelete}
                isPending={isPending}
                title="Hapus Konsultasi Terpilih?"
                description={`${selectedRows.length} konsultasi akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
            />

            <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
                <DataTable
                    columns={columns}
                    data={filteredConsultations}
                    hidePagination={filteredConsultations.length <= 10}
                    enableRowSelection={true}
                    onRowSelectionChange={setSelectedRows}
                />
            </div>

            {/* Dialog Balas */}
            <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
                <DialogContent className="sm:max-w-[520px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Reply className="h-4 w-4 text-primary" />
                            Balas Konsultasi
                        </DialogTitle>
                        <DialogDescription>
                            Balasan dikirim ke{" "}
                            <span className="font-semibold text-foreground">
                                {selectedConsultation?.email || "(tidak ada email)"}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    {selectedConsultation && (
                        <div className="space-y-4 py-1">
                            {/* Pertanyaan */}
                            <div className="rounded-xl bg-muted/50 border border-border/50 p-3 space-y-1">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    Pertanyaan dari {selectedConsultation.username}
                                </p>
                                <p className="text-sm leading-relaxed text-foreground/80">{selectedConsultation.message}</p>
                            </div>

                            {/* Jawaban */}
                            <div className="space-y-1.5">
                                <Label htmlFor="answer" className="text-sm font-medium">
                                    Balasan <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="answer"
                                    placeholder="Tulis balasan untuk pengunjung..."
                                    className="resize-none min-h-[130px] rounded-xl"
                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsReplyOpen(false)} disabled={isReplying} className="rounded-xl">
                            Batal
                        </Button>
                        <Button
                            onClick={handleReply}
                            disabled={isReplying || !selectedConsultation?.email}
                            className="rounded-xl font-semibold"
                        >
                            {isReplying ? 'Mengirim...' : 'Kirim Balasan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}