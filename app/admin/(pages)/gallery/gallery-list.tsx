'use client'

import { useState, useTransition } from "react"
import { Loader2, Trash2, X, AlertTriangle, CheckSquare } from "lucide-react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/admin/confirm-dialog"

import { Button } from "@/components/ui/button"
import { GalleryCard } from "@/components/admin/gallery-card"
import { Gallery } from "@/types/gallery-prop"
import { deleteGalleryBatch } from "@/services/gallery/gallery-service"

export function GalleryList({ initialGallery }: { initialGallery: Gallery[] }) {
    const [selected, setSelected] = useState<string[]>([])
    const [isPending, startTransition] = useTransition()

    const handleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteGalleryBatch(selected);
            if (result?.success) {
                toast.success(`${selected.length} foto berhasil dihapus`);
                setSelected([]);
            } else {
                toast.error(result?.error || "Gagal menghapus foto");
            }
        });
    }

    return (
        <div className="relative pb-24">
            {/* Floating Action Bar */}
            {selected.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-6 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in slide-in-from-bottom-10 border border-white/10 backdrop-blur-xl">
                    <div className="flex items-center gap-3 border-r border-white/20 pr-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20 text-red-500">
                            <CheckSquare className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] opacity-50 uppercase font-black tracking-tighter">Terpilih</span>
                            <span className="text-lg font-bold tabular-nums leading-none">
                                {selected.length} <span className="text-sm font-medium opacity-70">Item</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl font-semibold h-10"
                            onClick={() => setSelected([])}
                            disabled={isPending}
                        >
                            <X className="w-4 h-4 mr-2" /> Batal
                        </Button>

                        <ConfirmDialog
                            trigger={
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold px-6 h-10 shadow-lg shadow-red-900/20 active:scale-95 transition-all cursor-pointer"
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <Trash2 className="w-4 h-4 mr-2" />
                                    )}
                                    Hapus
                                </Button>
                            }
                            title="Hapus Permanen?"
                            description={`Anda akan menghapus ${selected.length} foto. Foto yang dihapus tidak bisa dikembalikan lagi.`}
                            onConfirm={handleDelete}
                            isLoading={isPending}
                            confirmText="Hapus"
                        />

                    </div>
                </div>
            )}

            {/* Galeri */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {initialGallery.map((item) => (
                    <GalleryCard
                        key={item._id}
                        gallery={item}
                        isSelected={selected.includes(item._id)}
                        onSelect={handleSelect}
                    />
                ))}
            </div>
        </div>
    )
}