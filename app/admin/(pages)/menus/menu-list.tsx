'use client'

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { MoreVertical, Pencil, Trash2, ChevronRight, ChevronDown } from "lucide-react"
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
import { deleteMenuAction, toggleMenuStatusAction, Menu } from "@/services/menu/menu-service"

export function MenuList({ menus }: { menus: Menu[] }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteMenuAction(id)
      if (result.success) {
        toast.success("Menu berhasil dihapus")
      } else {
        toast.error(result.error || "Gagal menghapus menu")
      }
    } catch {
      toast.error("Gagal menghapus menu")
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      const result = await toggleMenuStatusAction(id)
      if (result.success) {
        toast.success("Status menu berhasil diubah")
      } else {
        toast.error(result.error || "Gagal mengubah status")
      }
    } catch {
      toast.error("Gagal mengubah status")
    }
  }

  const renderMenuItem = (menu: Menu, level: number = 0) => {
    const hasChildren = menu.children && menu.children.length > 0
    const isExpanded = expandedIds.has(menu.id)
    const leftMargin = level * 24

    return (
      <div key={menu.id}>
        <div
          className="flex items-center justify-between p-4 rounded-lg border bg-card mb-2 hover:shadow-sm transition-all"
          style={{ marginLeft: leftMargin }}
        >
          <div className="flex items-center gap-3">
            {hasChildren && (
              <button
                onClick={() => toggleExpand(menu.id)}
                className="p-1 hover:bg-muted rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-6" />}

            <div>
              <h3 className="font-medium">{menu.title}</h3>
              <p className="text-sm text-muted-foreground">/{menu.slug}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={menu.status === 1 ? 'default' : 'secondary'}>
              {menu.status === 1 ? 'Aktif' : 'Tidak Aktif'}
            </Badge>

            <span className="text-sm text-muted-foreground">
              Order: {menu.order}
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/menus/${menu.id}`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToggleStatus(menu.id)}>
                  {menu.status === 1 ? 'Nonaktifkan' : 'Aktifkan'}
                </DropdownMenuItem>
                <ConfirmDialog
                  title="Hapus Menu"
                  description={`Apakah Anda yakin ingin menghapus menu "${menu.title}"?`}
                  onConfirm={() => handleDelete(menu.id)}
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

        {hasChildren && isExpanded && (
          <div>
            {menu.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {menus.map((menu) => renderMenuItem(menu))}
    </div>
  )
}
