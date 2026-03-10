'use client'

import { CheckSquare, Loader2, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { cn } from "@/lib/utils"

interface BulkActionBarProps {
    selectedCount: number
    label?: string
    onCancel: () => void
    onConfirm: () => void
    isPending: boolean
    title?: string
    description?: string
    disabled?: boolean
    warning?: React.ReactNode
}

export function BulkActionBar({
    selectedCount,
    label = "item",
    onCancel,
    onConfirm,
    isPending,
    title = "Hapus Terpilih?",
    description = "Data yang dipilih akan dihapus secara permanen.",
    disabled = false,
    warning
}: BulkActionBarProps) {
    if (selectedCount === 0) return null

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-3 w-full max-w-fit px-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
            {warning && (
                <div className="w-full">
                    {warning}
                </div>
            )}
            <div className="flex items-center gap-2 bg-popover border border-border rounded-2xl shadow-xl shadow-black/20 px-2 py-2 w-full">
                {/* Count */}
                <div className="flex items-center gap-2 px-3 py-1.5">
                    <div className="w-6 h-6 rounded-lg bg-foreground/10 flex items-center justify-center">
                        <CheckSquare className="w-3.5 h-3.5 text-foreground/70" />
                    </div>
                    <span className="text-sm font-semibold tabular-nums">
                        {selectedCount}
                        <span className="text-muted-foreground font-normal text-xs ml-1">{label}</span>
                    </span>
                </div>

                <div className="w-px h-6 bg-border" />

                {/* Cancel */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 rounded-xl text-muted-foreground hover:text-foreground text-xs font-medium"
                    onClick={onCancel}
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
                            disabled={disabled || isPending}
                        >
                            {isPending ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                            ) : (
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            )}
                            Hapus
                        </Button>
                    }
                    title={title}
                    description={description}
                    onConfirm={onConfirm}
                    isLoading={isPending}
                    confirmText="Hapus"
                />
            </div>
        </div>
    )
}
