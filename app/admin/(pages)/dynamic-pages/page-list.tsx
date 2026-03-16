'use client'

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  MoreVertical, Pencil, Trash2, FileText, File,
  ChevronDown,
  Folder, LayoutGrid, Layers, Eye, EyeOff, FolderOpen,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { SearchFilter } from "@/components/admin/SearchFilter"
import { deletePageAction, togglePageStatusAction, Page } from "@/services/page/page-service"

// ─── helpers ─────────────────────────────────────────────────────────────────

const getTypeMeta = (type?: string) => {
  switch (type) {
    case "kartu": return {
      icon: LayoutGrid,
      label: "Kartu",
      badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    }
    case "pdf": return {
      icon: File,
      label: "PDF",
      badge: "bg-red-500/10 text-red-400 border-red-500/20",
    }
    default: return {
      icon: FileText,
      label: "Halaman",
      badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    }
  }
}

const getMenuMeta = (menuType?: string) => {
  switch (menuType) {
    case "dynamic": return { icon: Layers, color: "text-violet-400", bg: "bg-violet-500/10" }
    case "grup": return { icon: Folder, color: "text-amber-400", bg: "bg-amber-500/10" }
    default: return { icon: FileText, color: "text-sky-400", bg: "bg-sky-500/10" }
  }
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim()
}

// ─── types ────────────────────────────────────────────────────────────────────

interface MenuGroup {
  id: string
  title: string
  menuType?: string
  pages: Page[]
}

// ─── PageRow ─────────────────────────────────────────────────────────────────

function PageRow({ page, onDelete, onToggle }: {
  page: Page
  onDelete: (id: string) => void
  onToggle: (id: string) => void
}) {
  const { icon: Icon, label, badge } = getTypeMeta(page.type)
  const isActive = page.status === 1

  const preview = page.type === "pdf"
    ? page.file || "—"
    : (stripHtml(page.dynamic_content || "") || "—")

  return (
    <div className="group flex items-center gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors border-t border-white/5 first:border-t-0">
      <div className="shrink-0 w-7 h-7 rounded-md bg-white/5 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-white/40" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white/90 truncate">{page.title}</p>
        <p className="text-xs text-white/30 truncate mt-0.5 max-w-xs">{preview}</p>
      </div>

      <Badge variant="outline" className={`text-[10px] font-medium px-2 py-0.5 border shrink-0 ${badge}`}>
        {label}
      </Badge>

      <div className="shrink-0 w-16 text-right">
        {isActive ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Aktif
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-white/30">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            Nonaktif
          </span>
        )}
      </div>

      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-white/40 hover:text-white hover:bg-white/10">
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem asChild>
              <Link href={`/admin/dynamic-pages/${page.id}`}>
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggle(page.id)}>
              {isActive
                ? <><EyeOff className="mr-2 h-3.5 w-3.5" />Nonaktifkan</>
                : <><Eye className="mr-2 h-3.5 w-3.5" />Aktifkan</>}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <ConfirmDialog
              title="Hapus Halaman"
              description={`Yakin hapus "${page.title}"?`}
              onConfirm={() => onDelete(page.id)}
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Hapus
                </DropdownMenuItem>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// ─── MenuGroupCard ────────────────────────────────────────────────────────────

function MenuGroupCard({ group, onDelete, onToggle }: {
  group: MenuGroup
  onDelete: (id: string) => void
  onToggle: (id: string) => void
}) {
  const [open, setOpen] = useState(true)
  const { icon: MenuIcon, color, bg } = getMenuMeta(group.menuType)

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden bg-white/[0.03]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors text-left"
      >
        <div className={`shrink-0 w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
          <MenuIcon className={`w-4 h-4 ${color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white/90">{group.title}</p>
          <p className="text-[11px] text-white/35">{group.pages.length} halaman</p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-white/30 transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`}
        />
      </button>

      {open && (
        <div className="border-t border-white/5">
          {group.pages.map((page) => (
            <PageRow key={page.id} page={page} onDelete={onDelete} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── PageList ─────────────────────────────────────────────────────────────────

export function PageList({ pages, total }: { pages: Page[]; total: number }) {
  const [search, setSearch] = useState("")
  const [menuFilter, setMenuFilter] = useState("all")

  const menuGroups = useMemo<MenuGroup[]>(() => {
    const map = new Map<string, MenuGroup>()
    pages.forEach((page) => {
      const key = page.menu_id || "no-menu"
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          title: (page as any).menu?.title || "Tanpa Menu",
          menuType: (page as any).menu?.type,
          pages: [],
        })
      }
      map.get(key)!.pages.push(page)
    })
    return Array.from(map.values())
  }, [pages])

  const uniqueMenus = menuGroups.map((g) => ({ id: g.id, title: g.title }))

  const filtered = useMemo(() => {
    return menuGroups
      .filter((g) => menuFilter === "all" || g.id === menuFilter)
      .map((g) => ({
        ...g,
        pages: g.pages.filter((p) =>
          !search || p.title.toLowerCase().includes(search.toLowerCase())
        ),
      }))
      .filter((g) => g.pages.length > 0)
  }, [menuGroups, menuFilter, search])

  const totalCount = filtered.reduce((acc, g) => acc + g.pages.length, 0)
  const hasFilter = !!(search || menuFilter !== "all")

  const handleDelete = async (id: string) => {
    try {
      const result = await deletePageAction(id)
      if (result.success) toast.success("Halaman berhasil dihapus")
      else toast.error(result.error || "Gagal menghapus halaman")
    } catch {
      toast.error("Gagal menghapus halaman")
    }
  }

  const handleToggle = async (id: string) => {
    try {
      const result = await togglePageStatusAction(id)
      if (result.success) toast.success("Status halaman berhasil diubah")
      else toast.error(result.error || "Gagal mengubah status")
    } catch {
      toast.error("Gagal mengubah status")
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <SearchFilter
          searchValue={search}
          onSearchChange={setSearch}
          filters={[
            {
              value: menuFilter,
              onChange: setMenuFilter,
              options: [
                { value: "all", label: "Semua Menu" },
                ...uniqueMenus.map(m => ({ value: m.id, label: m.title }))
              ],
              placeholder: "Semua Menu"
            }
          ]}
          onReset={() => { setSearch(""); setMenuFilter("all") }}
          hasActiveFilter={hasFilter}
          searchPlaceholder="Cari halaman..."
        />

        <div className="ml-auto text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{totalCount}</span> halaman
        </div>
      </div>

      {/* Groups */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderOpen className="w-8 h-8 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">Tidak ada halaman ditemukan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((group) => (
            <MenuGroupCard
              key={group.id}
              group={group}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}