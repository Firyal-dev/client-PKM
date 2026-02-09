'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, User, Eye, EyeOff } from "lucide-react"
import { Reviews } from "@/types/review-prop"
import { updateReviewStatus } from "@/services/review/review-service"
import { format, isValid } from "date-fns"
import { id } from "date-fns/locale"
import { toast } from "sonner"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

export function ReviewList({ reviews }: { reviews: Reviews[] }) {
    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead className="max-w-[400px]">Pesan</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reviews.map((item) => (
                        <ReviewRow key={item._id} item={item} />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

function ReviewRow({ item }: { item: Reviews }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleUpdateStatus = (id: string, currentStatus: boolean) => {
        startTransition(async () => {
            const result = await updateReviewStatus(id, !currentStatus)
            if (result.success) {
                toast.success(`Ulasan berhasil ${!currentStatus ? 'ditampilkan' : 'disembunyikan'}`)
                router.refresh()
            } else {
                toast.error(result.error || "Gagal mengubah status ulasan")
            }
        })
    }

    const renderDate = () => {
        const date = new Date(item.created_at)
        if (!isValid(date)) return "Tanggal Invalid"
        return format(date, "d MMM yyyy, HH:mm", { locale: id })
    }

    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-muted">
                        <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium text-sm">
                        {item.username || "Anonymous"}
                    </span>
                </div>
            </TableCell>
            <TableCell>
                <Badge variant="outline" className="capitalize">
                    {item.category}
                </Badge>
            </TableCell>
            <TableCell className="max-w-[400px]">
                <div className="flex flex-col gap-1">
                    <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {item.message}
                        </p>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <span className="text-sm text-muted-foreground">
                    {renderDate()}
                </span>
            </TableCell>
            <TableCell>
                <Badge
                    variant={item.is_publish ? 'default' : 'secondary'}
                    className="capitalize"
                >
                    {item.is_publish ? 'Ditampilkan' : 'Disembunyikan'}
                </Badge>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${item.is_publish ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                        disabled={isPending}
                        onClick={() => handleUpdateStatus(item._id, item.is_publish)}
                    >
                        {item.is_publish ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}
