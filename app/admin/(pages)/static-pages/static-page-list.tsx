'use client'

import Link from "next/link"
import { MoreVertical, Pencil, Trash2, FileText } from "lucide-react"
import { toast } from "sonner"
import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { deleteStaticPageAction, StaticPage } from "@/services/static-page/static-page-service"
import { DataTable } from "@/components/ui/data-table"

interface StaticPageListProps {
    staticPages: StaticPage[]
    pagination?: {
        page: number
        total: number
        lastPage: number
    }
}

export function StaticPageList({ staticPages, pagination }: StaticPageListProps) {
    const handleDelete = async (id: string) => {
        try {
            const result = await deleteStaticPageAction(id)
            if (result.success) {
                toast.success("Halaman statis berhasil dihapus")
            } else {
                toast.error(result.error || "Gagal menghapus halaman")
            }
        } catch {
            toast.error("Gagal menghapus halaman")
        }
    }

    const columns: ColumnDef<StaticPage>[] = [
        {
            accessorKey: "title",
            header: "Judul",
            cell: ({ row }) => {
                const page = row.original
                return (
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-medium whitespace-nowrap">{page.title}</h3>
                            <p className="text-sm text-muted-foreground whitespace-nowrap">Menu: {page.menu?.title || 'Tidak ada'}</p>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "content",
            header: "Konten",
            cell: ({ row }) => {
                const content = row.original.static_content || ''
                const maxLength = 100
                const truncated = content.length > maxLength
                    ? content.substring(0, maxLength) + '...'
                    : content
                return (
                    <span className="text-sm text-muted-foreground">
                        {truncated || '-'}
                    </span>
                )
            },
        },
        {
            accessorKey: "createdAt",
            header: "Dibuat",
            cell: ({ row }) => {
                const date = new Date(row.original.createdAt)
                return (
                    <span className="text-sm text-muted-foreground">
                        {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const page = row.original

                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`/admin/static-pages/${page.id}`}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                                <ConfirmDialog
                                    title="Hapus Halaman"
                                    description={`Apakah Anda yakin ingin menghapus halaman "${page.title}"?`}
                                    onConfirm={() => handleDelete(page.id)}
                                    trigger={
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Hapus
                                        </DropdownMenuItem>
                                    }
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        },
    ]

    return (
        <DataTable columns={columns} data={staticPages} />
    )
}
