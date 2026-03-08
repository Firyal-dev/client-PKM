'use client'

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  MoreVertical, Pencil, Trash2, ChevronRight, ChevronDown,
  Layers, FileText, Folder, Eye, EyeOff,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const parentMenus = useMemo(() => menus.filter((m) => !m.parent_id), [menus])
  const currentTypeFilter = searchParams.get("type") || ""
  const hasActiveFilter = !!(currentTypeFilter || globalFilter)

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleDelete = async (id: string) => {
    const result = await deleteMenuAction(id)
    result.success
      ? (toast.success("Menu berhasil dihapus"), router.refresh())
      : toast.error(result.error || "Gagal menghapus menu")
  }

  const handleToggleStatus = async (id: string) => {
    const result = await toggleMenuStatusAction(id)
    result.success
      ? (toast.success("Status menu berhasil diubah"), router.refresh())
      : toast.error(result.error || "Gagal mengubah status")
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

      {/* Table */}
      <div className="rounded-xl border border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Menu</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipe</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Urutan</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
              <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parentMenus.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-sm text-muted-foreground">
                  Tidak ada menu yang cocok dengan filter.
                </TableCell>
              </TableRow>
            ) : (
              parentMenus.map((menu) => (
                <React.Fragment key={menu.id}>
                  <MenuRow
                    key={menu.id}
                    menu={menu}
                    depth={0}
                    isExpanded={expandedIds.has(menu.id)}
                    onToggleExpand={() => toggleExpand(menu.id)}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                  />
                  {expandedIds.has(menu.id) && menu.children?.map((child) => (
                    <MenuRow
                      key={child.id}
                      menu={child}
                      depth={1}
                      isExpanded={false}
                      onToggleExpand={() => { }}
                      onDelete={handleDelete}
                      onToggleStatus={handleToggleStatus}
                    />
                  ))}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function MenuRow({
  menu, depth, isExpanded, onToggleExpand, onDelete, onToggleStatus
}: {
  menu: Menu
  depth: number
  isExpanded: boolean
  onToggleExpand: () => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string) => void
}) {
  const hasChildren = menu.children && menu.children.length > 0
  const { icon: IconComponent, color } = getMenuIcon(menu.type)
  const isActive = menu.status === 1

  return (
    <TableRow className={cn("group", depth > 0 && "bg-muted/20")}>
      <TableCell>
        <div className={cn("flex items-center gap-2.5", depth > 0 && "pl-6 border-l border-border/50 ml-2")}>
          {hasChildren ? (
            <button
              onClick={onToggleExpand}
              className="p-0.5 rounded-md hover:bg-muted transition-colors text-muted-foreground shrink-0"
            >
              {isExpanded
                ? <ChevronDown className="w-3.5 h-3.5" />
                : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <div className="w-5 shrink-0" />
          )}
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
      </TableCell>

      <TableCell>
        <span className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
          typeBadgeStyle[menu.type ?? ""] ?? "bg-muted text-muted-foreground"
        )}>
          {getTypeLabel(menu.type)}
        </span>
      </TableCell>

      <TableCell>
        <span className="text-sm tabular-nums text-muted-foreground">{menu.order}</span>
      </TableCell>

      <TableCell>
        <span className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
          isActive
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-muted text-muted-foreground"
        )}>
          {isActive ? "Aktif" : "Nonaktif"}
        </span>
      </TableCell>

      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 rounded-xl">
            <DropdownMenuItem asChild className="gap-2 cursor-pointer rounded-lg">
              <Link href={`/admin/menus/${menu.id}`}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleStatus(menu.id)} className="gap-2 cursor-pointer rounded-lg">
              {isActive
                ? <><EyeOff className="h-3.5 w-3.5" /> Nonaktifkan</>
                : <><Eye className="h-3.5 w-3.5" /> Aktifkan</>
              }
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <ConfirmDialog
              title="Hapus Menu?"
              description={`"${menu.title}" akan dihapus secara permanen.`}
              onConfirm={() => onDelete(menu.id)}
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="gap-2 cursor-pointer rounded-lg text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Hapus
                </DropdownMenuItem>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}