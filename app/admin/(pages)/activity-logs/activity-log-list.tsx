'use client'

import { useState, useMemo, useTransition } from "react"
import {
    RefreshCw, Download, Eye,
    Clock, User, MapPin, CheckCircle, XCircle
} from "lucide-react"
import { format, parseISO, isValid } from "date-fns"
import { id } from "date-fns/locale"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { SearchFilter } from "@/components/admin/SearchFilter"
import { PaginationControl } from "@/components/pagination-control"

import { ActivityLog, ActivityLogAction } from "@/types/activity-log-prop"
import { exportToCSV, exportToJSON } from "@/utils/activity-log-export"
import { cn } from "@/lib/utils"

const ACTION_COLORS: Record<ActivityLogAction, string> = {
    CREATE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    UPDATE: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    DELETE: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    LOGIN: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    LOGOUT: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    SWITCH_CONTEXT: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
}

const MODULE_ICONS: Record<string, string> = {
    AUTH: "🔐",
    BANNER: "🖼️",
    AGENDA: "📅",
    MENU: "📋",
    GALLERY: "📸",
    VIDEO: "🎬",
    ALBUM: "📁",
    USER: "👤",
}

interface ActivityLogListProps {
    initialLogs: ActivityLog[]
    initialMeta: {
        page: number
        limit: number
        total: number
    }
}

export function ActivityLogList({ initialLogs, initialMeta }: ActivityLogListProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [logs] = useState(initialLogs)

    // Filter states
    const [searchQuery, setSearchQuery] = useState("")
    const [actionFilter, setActionFilter] = useState<string>("all")
    const [moduleFilter, setModuleFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
        start: "",
        end: ""
    })

    // Detail modal
    const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    // Filter logs locally for search
    const filteredLogs = useMemo(() => {
        let result = [...logs]

        if (searchQuery) {
            const search = searchQuery.toLowerCase()
            result = result.filter(log =>
                log.admin_name?.toLowerCase().includes(search) ||
                log.action.toLowerCase().includes(search) ||
                log.module?.toLowerCase().includes(search) ||
                log.route?.toLowerCase().includes(search) ||
                log.ip_address?.toLowerCase().includes(search)
            )
        }

        if (actionFilter !== "all") result = result.filter(log => log.action === actionFilter)
        if (moduleFilter !== "all") result = result.filter(log => log.module === moduleFilter)
        if (statusFilter !== "all") {
            result = result.filter(log => {
                const isFailed = log.status_code && log.status_code >= 400
                return statusFilter === "failed" ? isFailed : !isFailed
            })
        }

        return result
    }, [logs, searchQuery, actionFilter, moduleFilter, statusFilter])

    const columns: ColumnDef<ActivityLog>[] = useMemo(() => [
        {
            accessorKey: "created_at",
            header: "Waktu",
            cell: ({ row }) => {
                const date = row.original.created_at ? parseISO(row.original.created_at) : null
                if (!date || !isValid(date)) return <span className="text-muted-foreground text-xs">—</span>
                return (
                    <div className="flex flex-col min-w-[100px]">
                        <span className="text-xs font-medium text-foreground">
                            {format(date, "dd MMM yyyy", { locale: id })}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                            {format(date, "HH:mm:ss")}
                        </span>
                    </div>
                )
            }
        },
        {
            accessorKey: "admin_name",
            header: "User",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 max-w-[150px]">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium truncate text-foreground/80">
                        {row.getValue("admin_name") || 'System'}
                    </span>
                </div>
            )
        },
        {
            accessorKey: "action",
            header: "Aksi",
            cell: ({ row }) => {
                const action = row.getValue("action") as ActivityLogAction
                return (
                    <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors",
                        ACTION_COLORS[action] || "bg-muted text-muted-foreground"
                    )}>
                        {action}
                    </span>
                )
            }
        },
        {
            accessorKey: "module",
            header: "Modul",
            cell: ({ row }) => {
                const module = row.getValue("module") as string
                return (
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm">{MODULE_ICONS[module] || '📦'}</span>
                        <span className="text-xs text-muted-foreground">
                            {module || '-'}
                        </span>
                    </div>
                )
            }
        },
        {
            id: "route",
            header: "Endpoint",
            cell: ({ row }) => (
                <div className="max-w-[200px] truncate">
                    <span className="text-[10px] font-bold text-foreground mr-1">{row.original.method}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{row.original.route || '-'}</span>
                </div>
            )
        },
        {
            id: "status",
            header: "Status",
            cell: ({ row }) => {
                const statusCode = row.original.status_code
                const isError = statusCode && statusCode >= 400
                return (
                    <div className="flex items-center gap-1">
                        {isError ? (
                            <>
                                <XCircle className="w-3 h-3 text-rose-500" />
                                <span className="text-[10px] font-bold text-rose-600">{statusCode}</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-3 h-3 text-emerald-500" />
                                <span className="text-[10px] font-bold text-emerald-600">OK</span>
                            </>
                        )}
                    </div>
                )
            }
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                        e.stopPropagation()
                        openDetail(row.original)
                    }}
                >
                    <Eye className="w-4 h-4" />
                </Button>
            )
        }
    ], [])

    const handleReset = () => {
        setSearchQuery("")
        setActionFilter("all")
        setModuleFilter("all")
        setStatusFilter("all")
        setDateRange({ start: "", end: "" })
        router.refresh()
    }

    const handleRefresh = () => {
        startTransition(() => {
            router.refresh()
        })
    }

    const handleExport = (format: 'csv' | 'json') => {
        const data = format === 'csv' ? exportToCSV(filteredLogs) : exportToJSON(filteredLogs)
        const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `activity-logs-${format === 'csv' ? 'csv' : 'json'}`
        a.click()
        URL.revokeObjectURL(url)
    }

    const openDetail = (log: ActivityLog) => {
        setSelectedLog(log)
        setIsDetailOpen(true)
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <SearchFilter
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    filters={[
                        {
                            value: actionFilter,
                            onChange: setActionFilter,
                            options: [
                                { value: "all", label: "Semua Aksi" },
                                { value: "CREATE", label: "Create" },
                                { value: "UPDATE", label: "Update" },
                                { value: "DELETE", label: "Delete" },
                                { value: "LOGIN", label: "Login" },
                                { value: "LOGOUT", label: "Logout" },
                                { value: "SWITCH_CONTEXT", label: "Switch" },
                            ],
                            placeholder: "Filter Aksi"
                        },
                        {
                            value: moduleFilter,
                            onChange: setModuleFilter,
                            options: [
                                { value: "all", label: "Semua Modul" },
                                ...Object.keys(MODULE_ICONS).map(mod => ({ value: mod, label: mod }))
                            ],
                            placeholder: "Filter Modul"
                        }
                    ]}
                    onReset={handleReset}
                    hasActiveFilter={!!searchQuery || actionFilter !== "all" || moduleFilter !== "all" || statusFilter !== "all" || !!dateRange.start}
                    searchPlaceholder="Cari log admin..."
                />

                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-9 w-9 rounded-xl border-border/60"
                        onClick={handleRefresh}
                        disabled={isPending}
                        title="Segarkan"
                    >
                        <RefreshCw className={cn("w-4 h-4 text-muted-foreground", isPending && "animate-spin")} />
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 rounded-xl gap-2 text-xs border-border/60"
                        onClick={() => handleExport('csv')}
                    >
                        <Download className="w-3.5 h-3.5" />
                        CSV
                    </Button>
                </div>
            </div>

            {/* Sub-Filters */}
            <div className="flex items-center gap-3 flex-wrap bg-muted/50 p-3 rounded-xl border border-border/40">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Status</span>
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-background border border-border/60 rounded-lg text-[11px] font-medium py-1 px-2 focus:ring-1 focus:ring-primary/20 outline-none cursor-pointer min-w-[100px]"
                    >
                        <option value="all">Semua Status</option>
                        <option value="success">OK (200)</option>
                        <option value="failed">Error (4xx/5xx)</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Rentang Waktu</span>
                    <Input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="h-7 text-[11px] w-[130px] rounded-lg border-border/60"
                    />
                    <span className="text-muted-foreground/30">—</span>
                    <Input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="h-7 text-[11px] w-[130px] rounded-lg border-border/60"
                    />
                </div>

                <div className="ml-auto text-xs text-muted-foreground font-medium">
                    {initialMeta.total} entri log
                </div>
            </div>

            {/* DataTable */}
            <div className="rounded-xl border border-border/60 overflow-hidden bg-background">
                <DataTable
                    columns={columns}
                    data={filteredLogs}
                    hidePagination={true}
                />
            </div>

            {/* Pagination */}
            {initialMeta.total > initialMeta.limit && (
                <div className="flex justify-center pt-2">
                    <PaginationControl 
                        totalPages={Math.ceil(initialMeta.total / initialMeta.limit)} 
                        currentPage={initialMeta.page} 
                    />
                </div>
            )}

            {/* Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-6 rounded-2xl border-border/60 shadow-lg">
                    <DialogHeader className="pb-4 border-b">
                        <DialogTitle className="text-lg font-bold">Detail Log Aktivitas</DialogTitle>
                        <DialogDescription className="text-xs">Informasi lengkap penggunaan sistem</DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto mt-4 space-y-6 pr-2">
                        {selectedLog && (
                            <div className="space-y-6">
                                {/* Info Cards */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-xl bg-muted/30 border border-border/40">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Waktu</p>
                                        <p className="text-xs font-semibold">
                                            {selectedLog.created_at
                                                ? format(parseISO(selectedLog.created_at), "dd MMMM yyyy, HH:mm:ss", { locale: id })
                                                : '-'}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-muted/30 border border-border/40">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">User</p>
                                        <p className="text-xs font-semibold">{selectedLog.admin_name || 'System'}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-muted/30 border border-border/40">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Aksi / Modul</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <Badge variant="outline" className={cn("text-[10px] py-0", ACTION_COLORS[selectedLog.action as ActivityLogAction])}>
                                                {selectedLog.action}
                                            </Badge>
                                            <span className="text-[10px] font-bold text-foreground/60">{selectedLog.module || '-'}</span>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-muted/30 border border-border/40">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                                        {selectedLog.status_code && selectedLog.status_code >= 400 ? (
                                            <span className="text-xs font-bold text-rose-600">GAGAL ({selectedLog.status_code})</span>
                                        ) : (
                                            <span className="text-xs font-bold text-emerald-600">BERHASIL (200)</span>
                                        )}
                                    </div>
                                </div>

                                {/* Network Info */}
                                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 space-y-2">
                                    <div className="flex items-center justify-between opacity-50 text-[9px] font-bold uppercase tracking-widest">
                                        <span>Infrastructure</span>
                                        <span>{selectedLog.ip_address || '-'}</span>
                                    </div>
                                    <div className="flex items-start gap-3 font-mono text-xs">
                                        <span className="text-sky-400 font-bold">{selectedLog.method || 'GET'}</span>
                                        <span className="opacity-80 break-all">{selectedLog.route || '-'}</span>
                                    </div>
                                </div>

                                {/* Payloads */}
                                <div className="space-y-4">
                                    {selectedLog.payload_before && Object.keys(selectedLog.payload_before).length > 0 && (
                                        <div className="space-y-1.5">
                                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">State Sebelum</h4>
                                            <pre className="bg-muted/50 p-4 rounded-xl text-[10px] font-mono border border-border/40 overflow-auto max-h-40">
                                                {JSON.stringify(selectedLog.payload_before, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                    {selectedLog.payload_after && Object.keys(selectedLog.payload_after).length > 0 && (
                                        <div className="space-y-1.5">
                                            <h4 className="text-[10px] font-bold text-primary/80 uppercase tracking-wider">State Sesudah</h4>
                                            <pre className="bg-primary/5 p-4 rounded-xl text-[10px] font-mono border border-primary/10 overflow-auto max-h-40">
                                                {JSON.stringify(selectedLog.payload_after, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>

                                {/* User Agent */}
                                {selectedLog.user_agent && (
                                    <div className="pt-4 border-t border-border/40">
                                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">User Agent</h4>
                                        <p className="text-[10px] font-mono text-muted-foreground bg-muted/30 p-3 rounded-lg leading-relaxed border border-border/20">
                                            {selectedLog.user_agent}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
