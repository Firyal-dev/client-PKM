/**
 * Activity Log Export Utilities
 * These are pure client-side functions for exporting data
 */

import { ActivityLog } from "@/types/activity-log-prop"

// Export logs to CSV
export function exportToCSV(logs: ActivityLog[]): string {
    const headers = ['Timestamp', 'User', 'Action', 'Module', 'IP', 'Status', 'Route']

    const rows = logs.map(log => [
        log.created_at,
        log.admin_name || 'System',
        log.action,
        log.module || '-',
        log.ip_address || '-',
        log.status_code && log.status_code >= 400 ? 'Failed' : 'Success',
        log.route || '-'
    ])

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}

// Export logs to JSON
export function exportToJSON(logs: ActivityLog[]): string {
    return JSON.stringify(logs, null, 2)
}
