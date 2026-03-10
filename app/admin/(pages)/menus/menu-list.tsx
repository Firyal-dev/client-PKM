'use client'

import React, { useState, useMemo, useTransition } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Pencil, Trash2, ChevronRight, ChevronDown,
  Layers, FileText, Folder, Eye, EyeOff,
} from "lucide-react"
import { toast } from "sonner"
import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { BulkActionBar } from "@/components/admin/bulk-action-bar"
import { SearchFilter } from "@/components/admin/SearchFilter"
import { deleteMenuAction, toggleMenuStatusAction, Menu } from "@/services/menu/menu-service"
import { cn } from "@/lib/utils"

const getMenuIcon = (type?: string) => {
  switch (type) {
    case "dynamic": return { icon: Layers, color: "text-violet-500" }
    case "grup": return { icon: Folder, color: "text-amber-500" }
    default: return { icon: FileText, color: "text-sky-500" }
  }
}

const getTypeLabel = (type?: string) => {
  switch (type) {
    case "static": return "Statis"
    case "dynamic": return "Dinamis"
    case "grup": return "Grup"
    default: return "Kustom"
  }
}

const typeBadgeStyle: Record<string, string> = {
  static: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400",
  dynamic: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
  grup: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
}

export function MenuList({ menus, total }: { menus: Menu[]; total: number }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [globalFilter, setGlobalFilter] = useState(searchParams.get("search") || "")
  const [selectedRows, setSelectedRows] = useState<Menu[]>([])
  const [isPending, startTransition] = useTransition()

  const parentMenus = useMemo(() => menus.filter((m) => !m.parent_id), [menus])
  const currentTypeFilter = searchParams.get("type") || ""
  const hasActiveFilter = !!(currentTypeFilter || globalFilter)

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteMenuAction(id)
      result.success
        ? (toast.success("Menu berhasil dihapus"), router.refresh())
        : toast.error(result.error || "Gagal menghapus menu")
    })
  }

  const handleToggleStatus = (id: string) => {
    startTransition(async () => {
      const result = await toggleMenuStatusAction(id)
      result.success
        ? (toast.success("Status menu berhasil diubah"), router.refresh())
        : toast.error(result.error || "Gagal mengubah status")
    })
  }

  const handleSearch = (value: string) => {
    setGlobalFilter(value)
    const params = new URLSearchParams(searchParams.toString())
    value ? params.set("search", value) : params.delete("search")
    params.set("page", "1")
    router.push(`/admin/menus?${params.toString()}`)
  }

  const handleTypeFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    value && value !== "all" ? params.set("type", value) : params.delete("type")
    params.set("page", "1")
    router.push(`/admin/menus?${params.toString()}`)
  }

  const handleReset = () => {
    setGlobalFilter("")
    router.push("/admin/menus")
  }

  const getAllMenuIds = (menuList: Menu[]): string[] => {
    let ids: string[] = []
    menuList.forEach(menu => {
      ids.push(menu.id)
      if (menu.children && menu.children.length > 0) {
        ids = ids.concat(getAllMenuIds(menu.children))
      }
    })
    return ids
  }

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return
    try {
      const allMenuIds = getAllMenuIds(selectedRows)
      await Promise.all(allMenuIds.map(id => deleteMenuAction(id)))
      toast.success(`${selectedRows.length} menu berhasil dihapus`)
      setSelectedRows([])
      router.refresh()
    } catch (error) {
      toast.error("Gagal menghapus beberapa menu")
    }
  }

  const columns: ColumnDef<Menu>[] = useMemo(() => [
    {
      id: "expander",
      header: "",
      cell: ({ row }) => {
        const hasChildren = row.original.children && row.original.children.length > 0
        return hasChildren ? (
          <button
            onClick={() => row.toggleExpanded()}
            className="p-0.5 rounded-md hover:bg-muted transition-colors text-muted-foreground shrink-0"
          >
            {row.getIsExpanded()
              ? <ChevronDown className="w-3.5 h-3.5" />
              : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        ) : (
          <div className="w-5 shrink-0" />
        )
      },
      size: 40,
    },
    {
      id: "title",
      header: "Menu",
      cell: ({ row }) => {
        const menu = row.original
        const { icon: IconComponent, color } = getMenuIcon(menu.type)
        const hasChildren = menu.children && menu.children.length > 0
        const depth = row.depth || 0

        return (
          <div className={cn("flex items-center gap-2.5", depth > 0 && "pl-6 border-l border-border/50 ml-2")}>
            <IconComponent className={cn("w-4 h-4 shrink-0", color)} />
            <div className="flex flex-col min-w-0">
              <span className={cn(
                "text-sm leading-snug truncate",
                depth > 0 ? "text-muted-foreground" : "font-semibold text-foreground"
              )}>
                {menu.title}
              </span>
              <span className="text-[11px] text-muted-foreground font-mono truncate">
                /{menu.slug}
                {hasChildren && (
                  <span className="not-italic font-sans ml-1 text-muted-foreground/50">· {menu.children?.length} submenu</span>
                )}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      id: "type",
      header: "Tipe",
      cell: ({ row }) => {
        const menu = row.original
        return (
          <span className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
            typeBadgeStyle[menu.type ?? ""] ?? "bg-muted text-muted-foreground"
          )}>
            {getTypeLabel(menu.type)}
          </span>
        )
      },
    },
    {
      id: "order",
      header: "Urutan",
      cell: ({ row }) => (
        <span className="text-sm tabular-nums text-muted-foreground">{row.original.order}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const menu = row.original
        const isActive = menu.status === 1
        return (
          <span className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
            isActive
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-muted text-muted-foreground"
          )}>
            {isActive ? "Aktif" : "Nonaktif"}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const menu = row.original
        const isActive = menu.status === 1
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground">
                  <Pencil className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl">
                <DropdownMenuItem asChild className="gap-2 cursor-pointer rounded-lg">
                  <Link href={`/admin/menus/${menu.id}`}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToggleStatus(menu.id)} className="gap-2 cursor-pointer rounded-lg">
                  {isActive
                    ? <><EyeOff className="h-3.5 w-3.5" /> Nonaktifkan</>
                    : <><Eye className="h-3.5 w-3.5" /> Aktifkan</>
                  }
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <ConfirmDialog
                  title="Hapus Menu?"
                  description={`"${menu.title}" akan dihapus secara permanen.`}
                  onConfirm={() => handleDelete(menu.id)}
                  isLoading={isPending}
                  trigger={
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="gap-2 cursor-pointer rounded-lg text-destructive focus:text-destructive"
                      disabled={isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Hapus
                    </DropdownMenuItem>
                  }
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ], [])

  return (
    <div className="space-y-4">
      {/* Filter row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <SearchFilter
          searchValue={globalFilter}
          onSearchChange={handleSearch}
          filters={[
            {
              value: currentTypeFilter,
              onChange: handleTypeFilter,
              options: [
                { value: "all", label: "Semua Tipe" },
                { value: "static", label: "Statis" },
                { value: "dynamic", label: "Dinamis" },
                { value: "grup", label: "Grup" },
              ],
              placeholder: "Semua Tipe"
            }
          ]}
          onReset={handleReset}
          hasActiveFilter={hasActiveFilter}
          searchPlaceholder="Cari menu..."
        />
        <div className="text-xs text-muted-foreground bg-muted/50 border border-border/50 px-3 py-1.5 rounded-full font-medium">
          {parentMenus.length} menu
        </div>
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedRows.length}
        label="menu"
        onCancel={() => setSelectedRows([])}
        onConfirm={() => startTransition(handleBulkDelete)}
        isPending={isPending}
        title="Hapus Menu Terpilih?"
        description={`${selectedRows.length} menu akan dihapus secara permanen termasuk sub-menuny. Tindakan ini tidak dapat dibatalkan.`}
      />

      {/* DataTable */}
      <div className="rounded-xl border border-border/60 overflow-hidden">
        <DataTable
          columns={columns}
          data={parentMenus}
          hidePagination={true}
          enableRowSelection={true}
          onRowSelectionChange={setSelectedRows}
        />
      </div>
    </div>
  )
}