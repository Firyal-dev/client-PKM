'use client'

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { MoreVertical, Pencil, Trash2, FileText } from "lucide-react"
import { toast } from "sonner"

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

  const getLayoutBadge = (layout: string) => {
    const layoutMap: Record<string, string> = {
      'artikel': 'Artikel',
      'cards': 'Kartu',
      'list': 'Daftar',
    }
    return layoutMap[layout] || layout
  }

  return (
    <div className="space-y-2">
      {pages.map((page) => (
        <div
          key={page.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-card mb-2 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>

            <div>
              <h3 className="font-medium">{page.title}</h3>
              <p className="text-sm text-muted-foreground">Menu: {page.menu?.title || 'Tidak ada'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline">
              {getLayoutBadge(page.layout)}
            </Badge>

            <Badge variant={page.status === 1 ? 'default' : 'secondary'}>
              {page.status === 1 ? 'Aktif' : 'Tidak Aktif'}
            </Badge>

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
        </div>
      ))}
    </div>
  )
}
