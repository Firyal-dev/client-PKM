'use client'

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { MoreVertical, Pencil, Trash2, ClipboardList } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { deleteServiceAction, Service } from "@/services/services/service-service"

export function ServiceCard({ id, service_name, icon, description, flows, created_at }: Service) {
    const [isDelOpen, setIsDelOpen] = useState(false)

    const handleDelete = async () => {
        try {
            const result = await deleteServiceAction(id.toString())
            if (result.success) {
                toast.success("Layanan berhasil dihapus")
            } else {
                toast.error(result.error || "Gagal menghapus layanan")
            }
        } catch {
            toast.error("Gagal menghapus layanan")
        }
    }

    return (
        <div className="group flex flex-col rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            {/* Header with Icon */}
            <div className="relative p-5 pb-0">
                <div className="flex items-center gap-4">
                    {icon ? (
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <span className="text-2xl">{icon}</span>
                        </div>
                    ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                            <ClipboardList className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                    )}

                    {/* Action Menu Glass */}
                    <div className="ml-auto">
                        <div className="
                            rounded-full
                            bg-muted/50
                            border border-muted
                            shadow-sm
                            hover:bg-muted
                            transition
                        ">
                            <ServiceActions id={id.toString()} onDelete={() => setIsDelOpen(true)} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col gap-3 flex-1">

                {/* Title */}
                <h3 className="
                    text-base font-semibold leading-snug
                    line-clamp-2
                    group-hover:text-primary
                    transition-colors
                ">
                    {service_name}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {description || "Tidak ada deskripsi"}
                </p>

                {/* Flows count */}
                {flows && flows.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-auto pt-2">
                        {flows.length} langkah {flows.length === 1 ? 'langkah' : 'langkah'}
                    </div>
                )}
            </div>

            {/* Date */}
            {created_at && (
                <div className="px-5 pb-5">
                    <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(created_at), {
                            addSuffix: true,
                            locale: localeId,
                        })}
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={isDelOpen}
                onOpenChange={setIsDelOpen}
                title="Hapus Layanan?"
                description="Layanan yang dihapus tidak dapat dikembalikan."
                onConfirm={handleDelete}
                confirmText="Hapus"
            />
        </div>
    )
}

// Action menu
function ServiceActions({ id, onDelete }: { id: string; onDelete: () => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="
                        h-8 w-8
                        rounded-full
                        hover:bg-transparent
                    "
                >
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-44 rounded-xl shadow-lg"
            >
                <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                    <Link href={`/admin/services/${id}`}>
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault()
                        onDelete()
                    }}
                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
