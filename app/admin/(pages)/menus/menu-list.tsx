'use client'

import Link from "next/link"
import {
  MoreVertical,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronDown
} from "lucide-react"
import { toast } from "sonner"
import { ColumnDef } from "@tanstack/react-table"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import {
  deleteMenuAction,
  toggleMenuStatusAction,
  Menu
} from "@/services/menu/menu-service"
import { DataTable } from "@/components/ui/data-table"

export function MenuList({ menus }: { menus: Menu[] }) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteMenuAction(id)

      if (result.success) {
        toast.success("Menu berhasil dihapus")
        router.refresh()
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
        router.refresh()
      } else {
        toast.error(result.error || "Gagal mengubah status")
      }
    } catch {
      toast.error("Gagal mengubah status")
    }
  }

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case "static":
        return "Statis"
      case "dynamic":
        return "Dinamis"
      default:
        return "Statis"
    }
  }

  const getTypeVariant = (
    type?: string
  ): "default" | "secondary" | "outline" => {
    switch (type) {
      case "static":
        return "default"
      case "dynamic":
        return "secondary"
      default:
        return "default"
    }
  }

  const columns: ColumnDef<Menu>[] = [
    {
      accessorKey: "title",
      header: "Nama Menu",
      cell: ({ row }) => {
        const menu = row.original
        const paddingLeft = `${row.depth * 1.5}rem`

        return (
          <div
            className="flex items-center gap-2"
            style={{ paddingLeft }}
          >
            {row.getCanExpand() ? (
              <button
                onClick={row.getToggleExpandedHandler()}
                className="p-1 hover:bg-muted rounded transition"
              >
                {row.getIsExpanded() ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}

            <div>
              <p className="font-medium whitespace-nowrap">
                {menu.title}
              </p>
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                /{menu.slug}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "type",
      header: "Tipe",
      cell: ({ row }) => (
        <Badge variant={getTypeVariant(row.original.type)}>
          {getTypeLabel(row.original.type)}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge variant={status === 1 ? "default" : "secondary"}>
            {status === 1 ? "Aktif" : "Tidak Aktif"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "order",
      header: "Urutan",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.order}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const menu = row.original

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
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

                <DropdownMenuItem
                  onClick={() => handleToggleStatus(menu.id)}
                >
                  {menu.status === 1
                    ? "Nonaktifkan"
                    : "Aktifkan"}
                </DropdownMenuItem>

                <ConfirmDialog
                  title="Hapus Menu"
                  description={`Apakah Anda yakin ingin menghapus menu "${menu.title}"?`}
                  onConfirm={() => handleDelete(menu.id)}
                  trigger={
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-destructive focus:text-destructive"
                    >
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
      <DataTable columns={columns} data={menus} />
    </div>
  )
}