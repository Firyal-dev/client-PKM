'use client'

import { useState } from "react"
import Link from "next/link"
import { MoreVertical, Pencil, Trash2, FileText, Search, ListFilter, X } from "lucide-react"
import { toast } from "sonner"
import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState("")

    // Get unique menus for filtering
    const uniqueMenus = Array.from(new Set(staticPages.map(p => p.menu?.title).filter(Boolean))) as string[]

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
                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                            <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-medium line-clamp-1">{page.title}</h3>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorFn: (row) => row.menu?.title,
            id: "menu",
            header: "Menu",
            cell: ({ row }) => {
                return (
                    <Badge variant="outline" className="bg-muted/50 font-medium text-foreground border-border/50">
                        {row.original.menu?.title || 'Tidak ada'}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "content",
            header: "Konten",
            cell: ({ row }) => {
                // Strip HTML tags and get plain text
                const rawContent = row.original.static_content || ''
                const plainText = rawContent.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
                const maxLength = 60
                const truncated = plainText.length > maxLength
                    ? plainText.substring(0, maxLength).trim() + '...'
                    : plainText
                return (
                    <span className="text-sm text-muted-foreground block max-w-[200px] truncate" title={plainText}>
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
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
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

    const activeFilter = columnFilters.find(f => f.id === 'menu')?.value as string

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari judul atau konten..."
                            value={globalFilter ?? ""}
                            onChange={(event) => setGlobalFilter(event.target.value)}
                            className="pl-9 h-10 rounded-xl"
                        />
                    </div>

                    <div className="h-6 w-px bg-border mx-1" />

                    {/* Menu Filter */}
                    <Select
                        value={activeFilter || "all"}
                        onValueChange={(value) => {
                            if (value === "all") {
                                setColumnFilters(prev => prev.filter(f => f.id !== 'menu'))
                            } else {
                                setColumnFilters(prev => [
                                    ...prev.filter(f => f.id !== 'menu'),
                                    { id: 'menu', value }
                                ])
                            }
                        }}
                    >
                        <SelectTrigger className="w-[180px] h-10 rounded-xl bg-muted/30 border-none shadow-none focus:ring-0">
                            <div className="flex items-center gap-2">
                                <ListFilter className="w-4 h-4 text-muted-foreground" />
                                <SelectValue placeholder="Semua Menu" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Menu</SelectItem>
                            {uniqueMenus.map((menu) => (
                                <SelectItem key={menu} value={menu}>{menu}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {(activeFilter || globalFilter) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setColumnFilters([])
                                setGlobalFilter("")
                            }}
                            className="h-10 px-3 text-muted-foreground hover:text-foreground rounded-xl"
                        >
                            <X className="w-4 h-4 mr-1" /> Reset
                        </Button>
                    )}
                </div>

                <div className="text-xs text-muted-foreground font-medium bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
                    Total: <span className="text-foreground font-bold">{pagination?.total || staticPages.length}</span> Halaman
                </div>
            </div>

            <DataTable
                columns={columns}
                data={staticPages}
                columnFilters={columnFilters}
                onColumnFiltersChange={setColumnFilters}
                globalFilter={globalFilter}
                onGlobalFilterChange={setGlobalFilter}
            />
        </div>
    )
}
