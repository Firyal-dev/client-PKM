'use client'

import Link from "next/link"
import { MoreVertical, Pencil, Trash2, FileText } from "lucide-react"
import { toast } from "sonner"
import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { deletePageAction, togglePageStatusAction, Page } from "@/services/page/page-service"
import { DataTable } from "@/components/ui/data-table"

const getLayoutBadge = (layout: string) => {
  const layoutMap: Record<string, string> = {
    'artikel': 'Artikel',
    'cards': 'Kartu',
    'list': 'Daftar',
  }
  return layoutMap[layout] || layout
}

export function PageList({ pages }: { pages: Page[] }) {
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
      accessorKey: "layout",
      header: "Layout",
      cell: ({ row }) => {
        return (
          <Badge variant="outline">
            {getLayoutBadge(row.original.layout)}
          </Badge>
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
                  <Link href={`/admin/pages/${page.id}`}>
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

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={pages} />
    </div>
  )
}
