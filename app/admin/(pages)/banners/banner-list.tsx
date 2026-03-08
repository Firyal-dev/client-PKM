'use client'

import { useState, useMemo, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { Edit, Trash2, Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Banner } from "@/types/banner-prop"
import { deleteBannerAction, toggleBannerPublishAction } from "@/services/banner/banner-service"
import { getMediaUrl } from "@/lib/getMediaUrl"
import { cn } from "@/lib/utils"

import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { SearchFilter } from "@/components/admin/SearchFilter"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export function BannerList({ banners }: { banners: Banner[] }) {
    const [isPending, startTransition] = useTransition()
    const [globalFilter, setGlobalFilter] = useState("")
    const [publishFilter, setPublishFilter] = useState("all")

    const filteredBanners = useMemo(() => {
        let result = [...banners]

        // Search filter
        if (globalFilter) {
            const search = globalFilter.toLowerCase()
            result = result.filter(b =>
                b.title?.toLowerCase().includes(search) ||
                b.description?.toLowerCase().includes(search)
            )
        }

        // Publish filter
        if (publishFilter !== "all") {
            const isPublished = publishFilter === "published"
            result = result.filter(b => b.is_publish === isPublished)
        }

        return result
    }, [banners, globalFilter, publishFilter])

    const hasFilter = !!globalFilter || publishFilter !== "all"

    const handleReset = () => {
        setGlobalFilter("")
        setPublishFilter("all")
    }

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
        <div className="space-y-4">
            {/* Filter row */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <SearchFilter
                    searchValue={globalFilter}
                    onSearchChange={setGlobalFilter}
                    filters={[
                        {
                            value: publishFilter,
                            onChange: setPublishFilter,
                            options: [
                                { value: "all", label: "Semua" },
                                { value: "published", label: "Aktif" },
                                { value: "unpublished", label: "Draft" },
                            ],
                            placeholder: "Semua"
                        }
                    ]}
                    onReset={handleReset}
                    hasActiveFilter={hasFilter}
                    searchPlaceholder="Cari banner..."
                />
                <div className="text-xs text-muted-foreground bg-muted/50 border border-border/50 px-3 py-1.5 rounded-full font-medium">
                    {filteredBanners.length} banner
                </div>
            </div>

            <div className="space-y-3">
                {filteredBanners.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-sm text-muted-foreground">Tidak ada banner yang cocok dengan filter.</p>
                    </div>
                ) : (
                    filteredBanners.map((banner, index) => (
                        <div
                            key={banner.id}
                            className="group relative flex flex-col sm:flex-row overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-200 hover:shadow-md hover:border-border"
                        >
                            {/* Index number */}
                            <div className="hidden sm:flex items-center justify-center w-10 shrink-0 bg-muted/40 border-r border-border/40 text-xs font-bold text-muted-foreground/50">
                                {index + 1}
                            </div>

                            {/* Thumbnail */}
                            <div className="relative aspect-[21/9] sm:aspect-video sm:w-52 md:w-64 shrink-0 overflow-hidden bg-muted/50">
                                <Image
                                    src={getMediaUrl(banner.image_path) || "/placeholder.jpg"}
                                    alt={banner.description || "Banner"}
                                    fill
                                    unoptimized
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />

                                {/* Status pill */}
                                <div className="absolute top-2 left-2">
                                    <span className={cn(
                                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm",
                                        banner.is_publish
                                            ? "bg-green-500/90 text-white"
                                            : "bg-black/60 text-white/80"
                                    )}>
                                        {banner.is_publish
                                            ? <><Eye className="h-2.5 w-2.5" /> Aktif</>
                                            : <><EyeOff className="h-2.5 w-2.5" /> Draft</>
                                        }
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 flex-col justify-between min-w-0 px-4 py-3 gap-3">
                                <div className="min-w-0">
                                    <p className={cn(
                                        "font-semibold text-sm leading-snug truncate",
                                        !banner.title && "italic text-muted-foreground/50"
                                    )}>
                                        {banner.title || "Tidak ada judul"}
                                    </p>
                                    <p className={cn(
                                        "mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed",
                                        !banner.description && "italic text-muted-foreground/40"
                                    )}>
                                        {banner.description || "Tidak ada deskripsi"}
                                    </p>
                                </div>

                                {/* Actions row */}
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={banner.is_publish}
                                            disabled={isPending}
                                            onCheckedChange={() => handleTogglePublish(banner.id, banner.is_publish)}
                                            className="scale-90 data-[state=checked]:bg-green-500"
                                        />
                                        <span className="text-xs text-muted-foreground font-medium">
                                            {banner.is_publish ? "Tayang" : "Draft"}
                                        </span>
                                        {isPending && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground/50" />}
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Button asChild variant="ghost" size="sm" className="h-7 px-2.5 text-xs gap-1.5 rounded-lg">
                                            <Link href={`/admin/banners/${banner.id}`}>
                                                <Edit className="h-3.5 w-3.5" />
                                                <span>Edit</span>
                                            </Link>
                                        </Button>

                                        <ConfirmDialog
                                            trigger={
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-7 px-2.5 text-xs gap-1.5 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    <span>Hapus</span>
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
                    )))}
            </div>
        </div>
    )
}