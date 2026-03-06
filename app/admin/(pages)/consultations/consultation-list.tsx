'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, User, Mail, Eye, EyeOff, Trash2, Reply, CheckCircle2, Clock } from "lucide-react"
import { SearchFilter } from "@/components/admin/SearchFilter"
import { ConsultationProp } from "@/types/consultation-prop"
import { format, isValid } from "date-fns"
import { id } from "date-fns/locale"
import { toast } from "sonner"
import { useTransition, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { updateConsultationAction, deleteConsultationAction, replyConsultationAction } from "@/services/consultation/consultation-service"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { cn } from "@/lib/utils"

export function ConsultationList({ consultations }: { consultations: ConsultationProp[] }) {
    const [globalFilter, setGlobalFilter] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [publishFilter, setPublishFilter] = useState("all")

    const filteredConsultations = useMemo(() => {
        let result = [...consultations]

        // Search filter
        if (globalFilter) {
            const search = globalFilter.toLowerCase()
            result = result.filter(c =>
                c.username.toLowerCase().includes(search) ||
                c.email?.toLowerCase().includes(search) ||
                c.subject.toLowerCase().includes(search) ||
                c.message.toLowerCase().includes(search)
            )
        }

        // Status filter (answered/unanswered)
        if (statusFilter !== "all") {
            const isAnswered = statusFilter === "answered"
            result = result.filter(c => c.is_answer === isAnswered)
        }

        // Publish filter
        if (publishFilter !== "all") {
            const isPublished = publishFilter === "published"
            result = result.filter(c => c.is_publish === isPublished)
        }

        return result
    }, [consultations, globalFilter, statusFilter, publishFilter])

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

            <div className="rounded-xl border border-border/60 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pengirim</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subjek & Pesan</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tanggal</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredConsultations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-sm text-muted-foreground">
                                    Tidak ada konsultasi yang cocok dengan filter.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredConsultations.map((item) => (
                                <ConsultationRow key={item.id} item={item} />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function ConsultationRow({ item }: { item: ConsultationProp }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const [isReplyOpen, setIsReplyOpen] = useState(false)
    const [answerText, setAnswerText] = useState(item.answer || '')
    const [isReplying, setIsReplying] = useState(false)

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

    const handleReply = async () => {
        if (!answerText.trim()) {
            toast.error('Mohon isi balasan terlebih dahulu.')
            return
        }
        setIsReplying(true)
        const result = await replyConsultationAction(item.id, answerText)
        setIsReplying(false)
        if (result.success) {
            toast.success('Balasan berhasil dikirim!')
            setIsReplyOpen(false)
            router.refresh()
        } else {
            toast.error(result.error || 'Gagal mengirim balasan')
        }
    }

    const date = new Date(item.created_at)
    const dateStr = isValid(date) ? format(date, "d MMM yyyy", { locale: id }) : "—"

    return (
        <>
            <TableRow className={cn(
                "group transition-colors",
                !item.is_answer && "bg-blue-50/30 dark:bg-blue-950/10"
            )}>
                {/* Pengirim */}
                <TableCell className="min-w-[150px]">
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
                </TableCell>

                {/* Subjek & Pesan */}
                <TableCell className="max-w-[300px]">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-foreground truncate">{item.subject}</span>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {item.message}
                        </p>
                    </div>
                </TableCell>

                {/* Tanggal */}
                <TableCell>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{dateStr}</span>
                </TableCell>

                {/* Status */}
                <TableCell>
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
                </TableCell>

                {/* Aksi */}
                <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            title="Balas via email"
                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                            disabled={isPending}
                            onClick={() => setIsReplyOpen(true)}
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
                </TableCell>
            </TableRow>

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
                                {item.email || "(tidak ada email)"}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-1">
                        {/* Pertanyaan */}
                        <div className="rounded-xl bg-muted/50 border border-border/50 p-3 space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Pertanyaan dari {item.username}
                            </p>
                            <p className="text-sm leading-relaxed text-foreground/80">{item.message}</p>
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

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsReplyOpen(false)} disabled={isReplying} className="rounded-xl">
                            Batal
                        </Button>
                        <Button
                            onClick={handleReply}
                            disabled={isReplying || !item.email}
                            className="rounded-xl font-semibold"
                        >
                            {isReplying ? 'Mengirim...' : 'Kirim Balasan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}