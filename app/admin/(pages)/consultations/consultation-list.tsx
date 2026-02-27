'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { MessageSquare, User, Mail, Eye, EyeOff, Trash2, Reply } from "lucide-react"
import { ConsultationProp } from "@/types/consultation-prop"
import { format, isValid } from "date-fns"
import { id } from "date-fns/locale"
import { toast } from "sonner"
import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { updateConsultationAction, deleteConsultationAction, replyConsultationAction } from "@/services/consultation/consultation-service"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"

export function ConsultationList({ consultations }: { consultations: ConsultationProp[] }) {
    return (
        <div className="rounded-md border bg-card overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User / Email</TableHead>
                        <TableHead>Subjek</TableHead>
                        <TableHead className="max-w-[300px]">Pertanyaan</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {consultations.map((item) => (
                        <ConsultationRow key={item.id} item={item} />
                    ))}
                </TableBody>
            </Table>
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
                toast.success(`Konsultasi berhasil ${!item.is_publish ? 'ditampilkan' : 'disembunyikan'}`)
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
                toast.error(result.error || 'Gagal menghapus konsultasi')
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
            toast.success('Balasan berhasil dikirim ke email pengunjung!')
            setIsReplyOpen(false)
            router.refresh()
        } else {
            toast.error(result.error || 'Gagal mengirim balasan')
        }
    }

    const renderDate = () => {
        const date = new Date(item.created_at)
        if (!isValid(date)) return "Tanggal Invalid"
        return format(date, "d MMM yyyy", { locale: id })
    }

    return (
        <>
            <TableRow>
                <TableCell>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <User className="w-3 h-3 text-muted-foreground" />
                            <span className="font-medium text-sm">{item.username}</span>
                        </div>
                        {item.email && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Mail className="w-3 h-3" />
                                <span>{item.email}</span>
                            </div>
                        )}
                    </div>
                </TableCell>
                <TableCell>
                    <span className="text-sm font-medium">{item.subject}</span>
                </TableCell>
                <TableCell className="max-w-[300px]">
                    <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 mt-1 text-primary/60 shrink-0" />
                        <p className="text-sm leading-relaxed line-clamp-3">
                            {item.message}
                        </p>
                    </div>
                </TableCell>
                <TableCell>
                    <span className="text-sm text-muted-foreground">
                        {renderDate()}
                    </span>
                </TableCell>
                <TableCell>
                    <div className="flex flex-col gap-1">
                        <Badge
                            variant={item.is_answer ? 'default' : 'secondary'}
                            className="whitespace-nowrap w-fit"
                        >
                            {item.is_answer ? 'Terjawab' : 'Belum Dijawab'}
                        </Badge>
                        <Badge
                            variant={item.is_publish ? 'outline' : 'secondary'}
                            className="whitespace-nowrap w-fit text-xs"
                        >
                            {item.is_publish ? 'Ditampilkan' : 'Disembunyikan'}
                        </Badge>
                    </div>
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            title="Balas konsultasi via email"
                            className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                            disabled={isPending}
                            onClick={() => setIsReplyOpen(true)}
                        >
                            <Reply className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            title={item.is_publish ? "Sembunyikan" : "Tampilkan"}
                            className={`h-8 w-8 ${item.is_publish ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                            disabled={isPending}
                            onClick={handleTogglePublish}
                        >
                            {item.is_publish ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <ConfirmDialog
                            trigger={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Hapus"
                                    className="h-8 w-8 text-red-600 hover:bg-red-50"
                                    disabled={isPending}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            }
                            title="Hapus Konsultasi"
                            description="Apakah Anda yakin ingin menghapus konsultasi ini? Tindakan ini tidak dapat dibatalkan."
                            onConfirm={handleDelete}
                        />
                    </div>
                </TableCell>
            </TableRow>

            {/* Modal Balas Konsultasi */}
            <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Balas Konsultasi</DialogTitle>
                        <DialogDescription>
                            Balasan akan dikirim ke email: <span className="font-medium text-foreground">{item.email || '(tidak ada email)'}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
                        {/* Info pertanyaan */}
                        <div className="rounded-md bg-muted p-3 text-sm">
                            <p className="font-medium text-xs text-muted-foreground mb-1">Pertanyaan dari {item.username}:</p>
                            <p className="text-sm leading-relaxed">{item.message}</p>
                        </div>

                        {/* Textarea jawaban */}
                        <div className="grid gap-2">
                            <Label htmlFor="answer">Balasan Anda <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="answer"
                                placeholder="Tulis jawaban / balasan untuk pengunjung..."
                                className="resize-none min-h-[140px]"
                                value={answerText}
                                onChange={(e) => setAnswerText(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsReplyOpen(false)}
                            disabled={isReplying}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleReply}
                            disabled={isReplying || !item.email}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isReplying ? 'Mengirim...' : 'Kirim Balasan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
