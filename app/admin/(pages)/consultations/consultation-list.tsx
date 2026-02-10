'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, User, Phone, Eye, EyeOff, MessageCircleCode } from "lucide-react"
import { ConsultationProp } from "@/types/consultation-prop"
import { format, isValid } from "date-fns"
import { id } from "date-fns/locale"
import { toast } from "sonner"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

export function ConsultationList({ consultations }: { consultations: ConsultationProp[] }) {
    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User / Kontak</TableHead>
                        <TableHead className="max-w-[300px]">Pertanyaan</TableHead>
                        <TableHead className="max-w-[300px]">Jawaban</TableHead>
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

    const handleTogglePublish = (id: string, currentStatus: boolean) => {
        startTransition(() => {
            // Mocking action because no endpoint yet
            toast.success(`(Dummy) Konsultasi berhasil ${!currentStatus ? 'ditampilkan' : 'disembunyikan'}`)
            router.refresh()
        })
    }

    const renderDate = () => {
        const date = new Date(item.created_at)
        if (!isValid(date)) return "Tanggal Invalid"
        return format(date, "d MMM yyyy", { locale: id })
    }

    return (
        <TableRow>
            <TableCell>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-muted-foreground" />
                        <span className="font-medium text-sm">{item.username}</span>
                    </div>
                    {item.phone_number && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            <span>{item.phone_number}</span>
                        </div>
                    )}
                </div>
            </TableCell>
            <TableCell className="max-w-[300px]">
                <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-1 text-primary/60 shrink-0" />
                    <p className="text-sm leading-relaxed line-clamp-3">
                        {item.message}
                    </p>
                </div>
            </TableCell>
            <TableCell className="max-w-[300px]">
                {item.answer ? (
                    <div className="flex items-start gap-2">
                        <MessageCircleCode className="w-4 h-4 mt-1 text-green-600 shrink-0" />
                        <p className="text-sm italic text-muted-foreground leading-relaxed line-clamp-3">
                            {item.answer}
                        </p>
                    </div>
                ) : (
                    <span className="text-xs text-orange-500 italic">Belum dijawab</span>
                )}
            </TableCell>
            <TableCell>
                <span className="text-sm text-muted-foreground">
                    {renderDate()}
                </span>
            </TableCell>
            <TableCell>
                <Badge
                    variant={item.is_publish ? 'default' : 'secondary'}
                    className="whitespace-nowrap"
                >
                    {item.is_publish ? 'Ditampilkan' : 'Disembunyikan'}
                </Badge>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        title={item.is_publish ? "Sembunyikan" : "Tampilkan"}
                        className={`h-8 w-8 ${item.is_publish ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                        disabled={isPending}
                        onClick={() => handleTogglePublish(item.id, item.is_publish)}
                    >
                        {item.is_publish ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}
