'use client'

import Link from "next/link"
import {
  MoreVertical,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronDown,
  Info,
  CornerDownRight,
  Link as LinkIcon,
  Network
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
        return "Kustom"
    }
  }

  const columns: ColumnDef<Menu>[] = [
    {
      accessorKey: "title",
      header: "Menu",
      cell: ({ row }) => {
        const menu = row.original
        const isSubmenu = row.depth > 0
        const paddingLeft = isSubmenu ? `${row.depth * 1.25}rem` : "0"

        return (
          <div
            className="flex items-start gap-2 py-1"
            style={{ paddingLeft }}
          >
            {isSubmenu && (
              <CornerDownRight className="w-4 h-4 text-slate-300 dark:text-slate-600 mt-1 shrink-0" />
            )}

            {row.getCanExpand() ? (
              <button
                onClick={row.getToggleExpandedHandler()}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
              >
                {row.getIsExpanded() ? (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
              </button>
            ) : (
              <div className="w-6 shrink-0" />
            )}

            <div className="flex flex-col gap-1">
              <span
                className={`text-sm font-semibold tracking-tight ${
                  isSubmenu
                    ? "text-slate-600 dark:text-slate-300"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                {menu.title}
              </span>

              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 w-fit">
                <LinkIcon className="w-3 h-3" />
                /{menu.slug}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: "parentInfo",
      header: "Induk",
      cell: ({ row }) => {
        const menu = row.original

        if (!menu.parent) {
          return (
            <Badge
              variant="outline"
              className="bg-transparent text-slate-500 border-slate-300 dark:border-slate-700 text-[11px]"
            >
              Root
            </Badge>
          )
        }

        return (
          <div className="flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
              {menu.parent.title}
            </span>
          </div>
        )
      }
    },
    {
      accessorKey: "type",
      header: "Tipe",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="text-xs text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700"
        >
          {getTypeLabel(row.original.type)}
        </Badge>
      ),
    },
    {
      accessorKey: "order",
      header: "Urutan",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {row.original.order}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status

        return (
          <Badge
            className={`text-xs font-medium px-2 py-0.5 rounded-md ${
              status === 1
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900"
                : "bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800"
            }`}
          >
            {status === 1 ? "Aktif" : "Nonaktif"}
          </Badge>
        )
      },
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
                  className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <MoreVertical className="h-4 w-4 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/menus/${menu.id}`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleToggleStatus(menu.id)}
                >
                  {menu.status === 1 ? "Nonaktifkan" : "Aktifkan"}
                </DropdownMenuItem>

                <ConfirmDialog
                  title="Hapus Menu"
                  description={`Yakin hapus "${menu.title}"?`}
                  onConfirm={() => handleDelete(menu.id)}
                  trigger={
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-red-600 focus:text-red-600"
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
      <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm">
        <Info className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
        <div className="space-y-1 text-slate-600 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-white">
            Panduan Navigasi
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Kolom <strong>Induk</strong> menunjukkan menu parent.</li>
            <li>Gunakan <strong>Urutan</strong> untuk mengatur posisi.</li>
          </ul>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
        <DataTable columns={columns} data={menus} />
      </div>
    </div>
  )
}