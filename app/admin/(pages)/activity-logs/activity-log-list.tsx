'use client'

import { useState, useMemo, useTransition } from "react"
import {
    Search, X, RefreshCw, Download, Eye,
    Clock, User, Activity, Layers, MapPin, CheckCircle, XCircle, AlertCircle
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { id } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import {
    Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious
} from "@/components/ui/pagination"

import { ActivityLog, ActivityLogAction } from "@/types/activity-log-prop"
import { exportToCSV, exportToJSON } from "@/utils/activity-log-export"

const ACTION_COLORS: Record<ActivityLogAction, string> = {
    CREATE: "bg-green-100 text-green-800 border-green-200",
    UPDATE: "bg-blue-100 text-blue-800 border-blue-200",
    DELETE: "bg-red-100 text-red-800 border-red-200",
    LOGIN: "bg-purple-100 text-purple-800 border-purple-200",
    LOGOUT: "bg-orange-100 text-orange-800 border-orange-200",
    SWITCH_CONTEXT: "bg-yellow-100 text-yellow-800 border-yellow-200",
}

const MODULE_ICONS: Record<string, string> = {
    AUTH: "🔐",
    BANNER: "🖼️",
    AGENDA: "📅",
    MENU: "📋",
    GALLERY: "🖼️",
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
    const [isPending, startTransition] = useTransition()
    const [logs, setLogs] = useState(initialLogs)
    const [meta, setMeta] = useState(initialMeta)

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

    // Derived filters
    const hasActiveFilter = searchQuery || actionFilter !== "all" || moduleFilter !== "all" || statusFilter !== "all" || dateRange.start || dateRange.end

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

        return result
    }, [logs, searchQuery])

    const handleReset = () => {
        setSearchQuery("")
        setActionFilter("all")
        setModuleFilter("all")
        setStatusFilter("all")
        setDateRange({ start: "", end: "" })
    }

    const handleRefresh = () => {
        startTransition(() => {
            // In a real app, this would refetch from the server
            window.location.reload()
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

    // Calculate pagination
    const totalPages = Math.ceil(meta.total / meta.limit)

    return (
        <div className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500 rounded-lg">
                                <Activity className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-blue-600">Total Logs</p>
                                <p className="text-2xl font-bold text-blue-900">{meta.total}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-green-600">Success</p>
                                <p className="text-2xl font-bold text-green-900">
                                    {logs.filter(l => !l.status_code || l.status_code < 400).length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500 rounded-lg">
                                <XCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-red-600">Failed</p>
                                <p className="text-2xl font-bold text-red-900">
                                    {logs.filter(l => l.status_code && l.status_code >= 400).length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500 rounded-lg">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-purple-600">Active Users</p>
                                <p className="text-2xl font-bold text-purple-900">
                                    {new Set(logs.filter(l => l.admin_id).map(l => l.admin_id)).size}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Filter Logs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap items-end gap-3">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px] max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search user, action, module..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-10"
                            />
                        </div>

                        {/* Action Filter */}
                        <Select value={actionFilter} onValueChange={setActionFilter}>
                            <SelectTrigger className="w-[160px] h-10">
                                <SelectValue placeholder="Action" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Actions</SelectItem>
                                <SelectItem value="CREATE">Create</SelectItem>
                                <SelectItem value="UPDATE">Update</SelectItem>
                                <SelectItem value="DELETE">Delete</SelectItem>
                                <SelectItem value="LOGIN">Login</SelectItem>
                                <SelectItem value="LOGOUT">Logout</SelectItem>
                                <SelectItem value="SWITCH_CONTEXT">Switch Context</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Module Filter */}
                        <Select value={moduleFilter} onValueChange={setModuleFilter}>
                            <SelectTrigger className="w-[160px] h-10">
                                <SelectValue placeholder="Module" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Modules</SelectItem>
                                <SelectItem value="AUTH">Auth</SelectItem>
                                <SelectItem value="BANNER">Banner</SelectItem>
                                <SelectItem value="AGENDA">Agenda</SelectItem>
                                <SelectItem value="MENU">Menu</SelectItem>
                                <SelectItem value="GALLERY">Gallery</SelectItem>
                                <SelectItem value="VIDEO">Video</SelectItem>
                                <SelectItem value="ALBUM">Album</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Status Filter */}
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[160px] h-10">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Date Start */}
                        <Input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="w-[150px] h-10"
                            placeholder="Start Date"
                        />

                        {/* Date End */}
                        <Input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="w-[150px] h-10"
                            placeholder="End Date"
                        />

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleReset}
                                disabled={!hasActiveFilter}
                            >
                                <X className="w-4 h-4 mr-1" />
                                Reset
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={isPending}
                            >
                                <RefreshCw className={`w-4 h-4 mr-1 ${isPending ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExport('csv')}
                            >
                                <Download className="w-4 h-4 mr-1" />
                                CSV
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExport('json')}
                            >
                                <Download className="w-4 h-4 mr-1" />
                                JSON
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[180px]">Timestamp</TableHead>
                                    <TableHead className="w-[150px]">User</TableHead>
                                    <TableHead className="w-[100px]">Action</TableHead>
                                    <TableHead className="w-[120px]">Module</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="w-[130px]">IP Address</TableHead>
                                    <TableHead className="w-[100px]">Status</TableHead>
                                    <TableHead className="w-[80px]">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <AlertCircle className="w-8 h-8" />
                                                <p>No activity logs found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <TableRow
                                            key={log.id}
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => openDetail(log)}
                                        >
                                            <TableCell className="whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {log.created_at
                                                            ? format(parseISO(log.created_at), "dd MMM yyyy, HH:mm", { locale: id })
                                                            : '-'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-sm truncate max-w-[130px]">
                                                        {log.admin_name || 'System'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`${ACTION_COLORS[log.action as ActivityLogAction] || 'bg-gray-100'} border`}
                                                >
                                                    {log.action}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <span>{MODULE_ICONS[log.module || ''] || '📦'}</span>
                                                    <span className="text-sm">{log.module || '-'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm truncate max-w-[200px] block">
                                                    {log.route || log.module ? `${log.method || ''} ${log.route || log.module}` : '-'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">
                                                        {log.ip_address || '-'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {log.status_code && log.status_code >= 400 ? (
                                                    <Badge variant="destructive" className="bg-red-100 text-red-800">
                                                        <XCircle className="w-3 h-3 mr-1" />
                                                        Failed
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-green-100 text-green-800">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Success
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        openDetail(log)
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="border-t px-6 py-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious href={`?page=${Math.max(1, meta.page - 1)}`} />
                                    </PaginationItem>
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const page = i + 1
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationLink href={`?page=${page}`} isActive={page === meta.page}>
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    })}
                                    <PaginationItem>
                                        <PaginationNext href={`?page=${Math.min(totalPages, meta.page + 1)}`} />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            Activity Log Details
                        </DialogTitle>
                        <DialogDescription>
                            Detailed information about this activity
                        </DialogDescription>
                    </DialogHeader>

                    {selectedLog && (
                        <div className="space-y-4 mt-4">
                            {/* Header Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                                    <p className="text-sm">
                                        {selectedLog.created_at
                                            ? format(parseISO(selectedLog.created_at), "dd MMMM yyyy, HH:mm:ss", { locale: id })
                                            : '-'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">User</p>
                                    <p className="text-sm">{selectedLog.admin_name || 'System'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Action</p>
                                    <Badge
                                        variant="outline"
                                        className={ACTION_COLORS[selectedLog.action as ActivityLogAction]}
                                    >
                                        {selectedLog.action}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Module</p>
                                    <p className="text-sm">{selectedLog.module || '-'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                    {selectedLog.status_code && selectedLog.status_code >= 400 ? (
                                        <Badge variant="destructive">Failed ({selectedLog.status_code})</Badge>
                                    ) : (
                                        <Badge className="bg-green-100 text-green-800">Success</Badge>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Entity ID</p>
                                    <p className="text-sm font-mono text-xs">{selectedLog.entity_id || '-'}</p>
                                </div>
                            </div>

                            {/* Request Info */}
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm">Request Information</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm bg-muted/50 p-3 rounded-lg">
                                    <div>
                                        <span className="text-muted-foreground">Method:</span> {selectedLog.method || '-'}
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Route:</span> {selectedLog.route || '-'}
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">IP Address:</span> {selectedLog.ip_address || '-'}
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">User Agent:</span> {selectedLog.user_agent ? 'Available' : '-'}
                                    </div>
                                </div>
                            </div>

                            {/* Payload Before */}
                            {selectedLog.payload_before && Object.keys(selectedLog.payload_before).length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Before (Payload)</h4>
                                    <pre className="bg-muted/50 p-3 rounded-lg text-xs overflow-x-auto max-h-40">
                                        {JSON.stringify(selectedLog.payload_before, null, 2)}
                                    </pre>
                                </div>
                            )}

                            {/* Payload After */}
                            {selectedLog.payload_after && Object.keys(selectedLog.payload_after).length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">After (Payload)</h4>
                                    <pre className="bg-muted/50 p-3 rounded-lg text-xs overflow-x-auto max-h-40">
                                        {JSON.stringify(selectedLog.payload_after, null, 2)}
                                    </pre>
                                </div>
                            )}

                            {/* User Agent */}
                            {selectedLog.user_agent && (
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">User Agent</h4>
                                    <p className="text-xs bg-muted/50 p-3 rounded-lg break-all">
                                        {selectedLog.user_agent}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
