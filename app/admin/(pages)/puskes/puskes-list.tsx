'use client'

import { useTransition } from "react"
import Link from "next/link"
import { Edit, Trash2, Loader2, Building2, MapPin, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

import { Puskesmas } from "@/services/puskesmas/puskesmas-service"
import { deletePuskesmasAction } from "@/services/puskesmas/puskesmas-service"
import { getMediaUrl } from "@/lib/getMediaUrl"
import { cn } from "@/lib/utils"

import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export function PuskesmasList({ puskesmas }: { puskesmas: Puskesmas[] }) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = (id: string) =>
        startTransition(async () => {
            const res = await deletePuskesmasAction(id)
            res.success
                ? toast.success("Puskesmas berhasil dihapus")
                : toast.error(res.error || "Gagal menghapus puskesmas")
        })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <Badge className="bg-green-500">Aktif</Badge>
            case 'INACTIVE':
                return <Badge variant="secondary">Tidak Aktif</Badge>
            case 'SUSPENDED':
                return <Badge variant="destructive">Ditangguhkan</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    return (
        <div className="space-y-3">
            {puskesmas.map((p) => (
                <div
                    key={p.id}
                    className={cn(
                        "group relative overflow-hidden rounded-lg border transition-all duration-200",
                        "bg-white dark:bg-slate-900",
                        "border-slate-200 dark:border-slate-800",
                        "hover:shadow-md dark:hover:shadow-slate-900/50"
                    )}
                >
                    <div className="flex flex-col sm:flex-row gap-3 p-3">
                        {/* Logo */}
                        <div className="relative aspect-square w-24 h-24 shrink-0 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            {p.logo_path ? (
                                <Image
                                    src={getMediaUrl(p.logo_path) || "/placeholder.jpg"}
                                    alt={p.name}
                                    fill
                                    unoptimized
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <Building2 className="w-10 h-10 text-slate-400" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col justify-between min-w-0">
                            <div className="flex-1">
                                {/* Name */}
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
                                        {p.name}
                                    </p>
                                    {getStatusBadge(p.status)}
                                </div>

                                {/* Slug */}
                                <p className="text-sm text-primary font-medium mb-1">
                                    {p.slug}
                                </p>

                                {/* Address */}
                                <div className="flex items-start gap-1 text-sm text-slate-500 dark:text-slate-400">
                                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                    <span className="line-clamp-2">
                                        {p.alamat || "Alamat belum diatur"}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-1.5 mt-3">
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2.5 gap-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    <Link href={`/admin/puskes/${p.id}`}>
                                        <Edit className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">Edit</span>
                                    </Link>
                                </Button>

                                <ConfirmDialog
                                    trigger={
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 px-2.5 gap-1.5 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            <span className="hidden sm:inline">Hapus</span>
                                        </Button>
                                    }
                                    title="Hapus Puskesmas?"
                                    description={`Puskesmas "${p.name}" akan dihapus secara permanen.`}
                                    confirmText="Hapus"
                                    isLoading={isPending}
                                    onConfirm={() => handleDelete(p.id)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
