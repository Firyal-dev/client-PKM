'use client'

import { useState } from "react"
import Link from "next/link"
import { MoreVertical, Pencil, Trash2, FileText, File, ListFilter, X, Search } from "lucide-react"
import { toast } from "sonner"
import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { deletePageAction, togglePageStatusAction, Page } from "@/services/page/page-service"
import { DataTable } from "@/components/ui/data-table"

const getTypeBadge = (type: string) => {
  const typeMap: Record<string, string> = {
    'halaman': 'Halaman',
    'pdf': 'PDF',
    'kartu': 'Kartu',
  }
  return typeMap[type] || type
}

export function PageList({ pages }: { pages: Page[] }) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  // Get unique menus for filtering
  const uniqueMenus = Array.from(new Set(pages.map(p => p.menu?.title).filter(Boolean))) as string[]

  const handleDelete = async (id: string) => {
    try {
      const result = await deletePageAction(id)
      if (result.success) {
        toast.success("Halaman berhasil dihapus")
      } else {
        toast.error(result.error || "Gagal menghapus halaman")
      }
    } catch {
      toast.error("Gagal menghapus halaman")
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      const result = await togglePageStatusAction(id)
      if (result.success) {
        toast.success("Status halaman berhasil diubah")
      } else {
        toast.error(result.error || "Gagal mengubah status")
      }
    } catch {
      toast.error("Gagal mengubah status")
    }
  }

  const columns: ColumnDef<Page>[] = [
    {
      accessorKey: "title",
      header: "Judul",
      cell: ({ row }) => {
        const page = row.original
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium line-clamp-1 w-full" title={page.title}>{page.title}</h3>
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
      accessorKey: "type",
      header: "Tipe",
      cell: ({ row }) => {
        return (
          <Badge variant="outline">
            {getTypeBadge(row.original.type)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "dynamic_content",
      header: "Konten",
      cell: ({ row }) => {
        const page = row.original
        if (page.type === 'pdf') {
          return (
            <span className="text-sm text-muted-foreground flex items-center gap-2 max-w-[250px]" title={page.file || 'Tidak ada file'}>
              <File className="w-4 h-4 shrink-0" />
              <span className="truncate">{page.file || 'Tidak ada file'}</span>
            </span>
          )
        }
        const rawContent = page.dynamic_content || ''
        const plainText = rawContent.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
        const maxLength = 60
        const truncated = plainText.length > maxLength
          ? plainText.substring(0, maxLength).trim() + '...'
          : plainText
        return (
          <span className="text-sm text-muted-foreground block max-w-[250px] truncate" title={plainText}>
            {truncated || '-'}
          </span>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge variant={status === 1 ? 'default' : 'secondary'}>
            {status === 1 ? 'Aktif' : 'Tidak Aktif'}
          </Badge>
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
                  <Link href={`/admin/dynamic-pages/${page.id}`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToggleStatus(page.id)}>
                  {page.status === 1 ? 'Nonaktifkan' : 'Aktifkan'}
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
          Total: <span className="text-foreground font-bold">{pages.length}</span> Halaman
        </div>
      </div>

      <DataTable
        columns={columns}
        data={pages}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
      />
    </div>
  )
}
