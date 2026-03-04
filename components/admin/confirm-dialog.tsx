"use client"

import { AlertCircle, Loader2 } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

type ConfirmDialogProps = {
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    title: string
    description: string
    onConfirm: () => void
    onCancel?: () => void
    isLoading?: boolean
    confirmText?: string
    cancelText?: string
    variant?: "destructive" | "default"
}

export function ConfirmDialog({
    trigger, open, onOpenChange, title, description, onConfirm, onCancel,
    isLoading = false, confirmText = "Ya, Lanjutkan", cancelText = "Batal", variant = "destructive"
}: ConfirmDialogProps) {
    const isDestructive = variant === "destructive"

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen && onCancel) {
            onCancel()
        }
        onOpenChange?.(isOpen)
    }

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
            <AlertDialogContent className={cn("max-w-[340px] sm:max-w-[400px] rounded-2xl sm:rounded-3xl border bg-background p-4 sm:p-6 shadow-2xl")}>
                <AlertDialogHeader className="flex flex-row items-start gap-3 sm:gap-4 space-y-0">
                    <div className={cn("mt-0.5 flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl", isDestructive ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" : "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400")}>
                        <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="flex flex-col gap-1 text-left flex-1 min-w-0">
                        <AlertDialogTitle className="text-lg sm:text-xl font-bold">{title}</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-muted-foreground">{description}</AlertDialogDescription>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-5 sm:mt-6 flex flex-col-reverse sm:flex-row gap-2">
                    <AlertDialogCancel className={cn("mt-0 w-full sm:w-auto rounded-lg bg-muted/50 font-semibold")}>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction disabled={isLoading} onClick={(e) => { e.preventDefault(); onConfirm() }} className={cn("w-full sm:w-auto rounded-lg font-bold", isDestructive ? "bg-red-600 text-white hover:bg-red-700" : "bg-primary text-primary-foreground")}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
