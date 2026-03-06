'use client'

import { useState, useMemo, useTransition } from "react"
import { Loader2, Trash2, CheckSquare, X } from "lucide-react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { SearchFilter } from "@/components/admin/SearchFilter"
import { Button } from "@/components/ui/button"
import { GalleryCard } from "@/components/admin/gallery-card"
import { Gallery } from "@/types/gallery-prop"
import { deleteGalleryBatchAction } from "@/services/gallery/gallery-service"

export function GalleryList({ gallery }: { gallery: Gallery[] }) {
    const [selected, setSelected] = useState<string[]>([])
    const [isPending, startTransition] = useTransition()
    const [globalFilter, setGlobalFilter] = useState("")

    const filteredGallery = useMemo(() => {
        if (!globalFilter) return gallery
        const search = globalFilter.toLowerCase()
        return gallery.filter(g =>
            g.image_title?.toLowerCase().includes(search) ||
            g.description?.toLowerCase().includes(search)
        )
    }, [gallery, globalFilter])

    const handleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteGalleryBatchAction(selected)
            if (result?.success) {
                toast.success(`${selected.length} foto berhasil dihapus`)
                setSelected([])
            } else {
                toast.error(result?.error || "Gagal menghapus foto")
            }
        })
    }

    const allSelected = selected.length === filteredGallery.length
    const handleSelectAll = () => {
        setSelected(allSelected ? [] : filteredGallery.map((g) => g.id))
    }

    return (
        <div className="relative pb-24 space-y-4">
            {/* Filter row */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <SearchFilter
                    searchValue={globalFilter}
                    onSearchChange={setGlobalFilter}
                    onReset={() => setGlobalFilter("")}
                    hasActiveFilter={!!globalFilter}
                    searchPlaceholder="Cari foto..."
                />
                <div className="text-xs text-muted-foreground bg-muted/50 border border-border/50 px-3 py-1.5 rounded-full font-medium">
                    {filteredGallery.length} foto
                </div>
            </div>

            {/* Select all toggle — muncul kalau ada yang terpilih atau hover */}
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${allSelected
                        ? "bg-foreground border-foreground"
                        : selected.length > 0
                            ? "bg-foreground/30 border-foreground/40"
                            : "border-border"
                        }`}>
                        {(allSelected || selected.length > 0) && (
                            <svg className="w-2.5 h-2.5 text-background" fill="currentColor" viewBox="0 0 12 12">
                                <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </svg>
                        )}
                    </div>
                    {allSelected ? "Batal pilih semua" : "Pilih semua"}
                </button>

                {selected.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{selected.length}</span> terpilih
                    </span>
                )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredGallery.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-sm text-muted-foreground">Tidak ada foto yang cocok dengan filter.</p>
                    </div>
                ) : (
                    filteredGallery.map((item) => (
                        <GalleryCard
                            key={item.id}
                            gallery={item}
                            isSelected={selected.includes(item.id)}
                            onSelect={handleSelect}
                        />
                    ))
                )}
            </div>

            {/* Floating Action Bar */}
            {selected.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-bottom-4 duration-200">
                    <div className="flex items-center gap-2 bg-popover border border-border rounded-2xl shadow-xl shadow-black/20 px-2 py-2">
                        {/* Count */}
                        <div className="flex items-center gap-2 px-3 py-1.5">
                            <div className="w-6 h-6 rounded-lg bg-foreground/10 flex items-center justify-center">
                                <CheckSquare className="w-3.5 h-3.5 text-foreground/70" />
                            </div>
                            <span className="text-sm font-semibold tabular-nums">
                                {selected.length}
                                <span className="text-muted-foreground font-normal text-xs ml-1">foto</span>
                            </span>
                        </div>

                        <div className="w-px h-6 bg-border" />

                        {/* Cancel */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 px-3 rounded-xl text-muted-foreground hover:text-foreground text-xs font-medium"
                            onClick={() => setSelected([])}
                            disabled={isPending}
                        >
                            <X className="w-3.5 h-3.5 mr-1.5" />
                            Batal
                        </Button>

                        {/* Delete */}
                        <ConfirmDialog
                            trigger={
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-9 px-4 rounded-xl text-xs font-semibold"
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                                    ) : (
                                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                    )}
                                    Hapus
                                </Button>
                            }
                            title="Hapus Foto?"
                            description={`${selected.length} foto akan dihapus permanen dan tidak bisa dikembalikan.`}
                            onConfirm={handleDelete}
                            isLoading={isPending}
                            confirmText="Hapus"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}