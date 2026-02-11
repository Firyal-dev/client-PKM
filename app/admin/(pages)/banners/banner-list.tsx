'use client'

import { useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { Edit, Trash2, Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Banner } from "@/types/banner-prop"
import { deleteBannerAction, toggleBannerPublishAction } from "@/services/banner/banner-service"
import { getMediaUrl } from "@/lib/getMediaUrl"
import { cn } from "@/lib/utils"

import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

export function BannerList({ banners }: { banners: Banner[] }) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = (id: string) =>
        startTransition(async () => {
            const res = await deleteBannerAction(id)
            res.success
                ? toast.success("Banner berhasil dihapus")
                : toast.error(res.error || "Gagal menghapus banner")
        })

    const handleTogglePublish = (id: string, current: boolean) =>
        startTransition(async () => {
            const res = await toggleBannerPublishAction(id, !current)
            res.success
                ? toast.success(!current ? "Banner dipublish" : "Banner diarsipkan")
                : toast.error(res.error || "Gagal mengubah status")
        })

    return (
        <div className="space-y-3">
            {banners.map((banner) => (
                <div
                    key={banner.id}
                    className={cn(
                        "group relative overflow-hidden rounded-lg border transition-all duration-200",
                        "bg-white dark:bg-slate-900",
                        "border-slate-200 dark:border-slate-800",
                        "hover:shadow-md dark:hover:shadow-slate-900/50"
                    )}
                >
                    <div className="flex flex-col sm:flex-row gap-3 p-3">
                        {/* Image */}
                        <div className="relative aspect-[21/9] sm:aspect-video w-full sm:w-48 md:w-64 shrink-0 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
                            <Image
                                src={getMediaUrl(banner.image_path) || "/placeholder.jpg"}
                                alt={banner.description || "Banner"}
                                fill
                                unoptimized
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            {/* Status Badge Overlay on Image */}
                            <div className="absolute top-2 left-2">
                                <Badge
                                    className={cn(
                                        "rounded-md px-2 py-0.5 text-[10px] font-semibold shadow-sm",
                                        banner.is_publish
                                            ? "bg-green-500 text-white dark:bg-green-600"
                                            : "bg-slate-700 text-white dark:bg-slate-600"
                                    )}
                                >
                                    {banner.is_publish ? (
                                        <><Eye className="mr-1 h-2.5 w-2.5 inline" /> Aktif</>
                                    ) : (
                                        <><EyeOff className="mr-1 h-2.5 w-2.5 inline" /> Draft</>
                                    )}
                                </Badge>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col justify-between min-w-0">
                            <div className="flex-1">
                                {/* Title */}
                                <p
                                    className={cn(
                                        "text-lg font-medium",
                                        "text-slate-700 dark:text-slate-200",
                                        !banner.title && "italic text-slate-400 dark:text-slate-500"
                                    )}
                                >
                                    {banner.title || "Tidak ada judul banner"}
                                </p>
                                {/* Description */}
                                <p
                                    className={cn(
                                        "line-clamp-2 text-sm",
                                        "text-slate-700 dark:text-slate-200",
                                        !banner.description && "italic text-slate-400 dark:text-slate-500"
                                    )}
                                >
                                    {banner.description || "Tidak ada deskripsi banner"}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                {/* Toggle Switch */}
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={banner.is_publish}
                                        disabled={isPending}
                                        onCheckedChange={() =>
                                            handleTogglePublish(banner.id, banner.is_publish)
                                        }
                                        className="scale-90"
                                    />
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                        {banner.is_publish ? "Tayang" : "Draft"}
                                    </span>

                                    {isPending && (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1.5">
                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2.5 gap-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        <Link href={`/admin/banners/${banner.id}`}>
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
                                        title="Hapus Banner?"
                                        description="Banner ini akan dihapus secara permanen."
                                        confirmText="Hapus"
                                        isLoading={isPending}
                                        onConfirm={() => handleDelete(banner.id)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
