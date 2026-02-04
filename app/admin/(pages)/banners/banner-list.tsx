'use client'

import { Banner } from "@/types/banner-prop"
import { deleteBanner, togglePublishBanner } from "@/services/banner/banner-service"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { useTransition } from "react"
import Link from "next/link"
import Image from "next/image"

export function BannerList({ banners }: { banners: Banner[] }) {
    const [isPending, startTransition] = useTransition()

    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const BASE_URL = API_URL?.replace(/\/api$/, '')

    const handleDelete = (id: string) => {
        startTransition(async () => {
            const result = await deleteBanner(id)
            if (result.success) {
                toast.success("Banner berhasil dihapus")
            } else {
                toast.error(result.error || "Gagal menghapus banner")
            }
        })
    }

    const handleTogglePublish = (id: string, currentStatus: boolean) => {
        startTransition(async () => {
            const result = await togglePublishBanner(id, !currentStatus)
            if (result.success) {
                toast.success(`Banner ${!currentStatus ? 'dipublish' : 'diarsipkan'}`)
            } else {
                toast.error(result.error || "Gagal mengubah status")
            }
        })
    }

    if (banners.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-xl border border-dashed text-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Tidak ada banner</h3>
                <p className="text-muted-foreground max-w-xs">Belum ada data banner yang ditambahkan.</p>
                <Link href="/admin/banners/create-banner" className="mt-4">
                    <Button>Tambah Banner Utama</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="rounded-xl border bg-card overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="w-[200px]">Preview</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead className="w-[100px] text-center">Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {banners.map((banner) => (
                        <TableRow key={banner._id}>
                            <TableCell>
                                <div className="relative aspect-[16/6] w-full min-w-[160px] rounded-lg overflow-hidden bg-muted border">
                                    <Image
                                        src={`${BASE_URL}${banner.image_path}`}
                                        alt={banner.description || "Banner"}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                </div>
                            </TableCell>
                            <TableCell className="align-middle">
                                <p className="text-sm font-medium line-clamp-2">
                                    {banner.description || <span className="text-muted-foreground italic">Tidak ada deskripsi</span>}
                                </p>
                            </TableCell>
                            <TableCell className="text-center align-middle">
                                <Switch
                                    checked={banner.is_publish}
                                    onCheckedChange={() => handleTogglePublish(banner._id, banner.is_publish)}
                                    disabled={isPending}
                                />
                            </TableCell>
                            <TableCell className="text-right align-middle">
                                <div className="flex justify-end gap-2">
                                    <Link href={`/admin/banners/${banner._id}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </Link>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Hapus Banner?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Anda akan menghapus banner ini secara permanen. Tindakan ini tidak dapat dibatalkan.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(banner._id)}
                                                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer"
                                                >
                                                    Hapus
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
