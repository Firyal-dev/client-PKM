'use server'

import api from '@/services/api'
import { getBaseUrl } from '@/services/helpers'
import { authHeaders } from '@/services/server-helpers'
import { ActivityLog, ActivityLogResponse, ActivityLogSummary, ActivityLogFilters } from '@/types/activity-log-prop'

// Fetch activity logs with filters
export async function getActivityLogs(filters: ActivityLogFilters = {}): Promise<ActivityLogResponse> {
    try {
        const params = new URLSearchParams()

        if (filters.page) params.set('page', filters.page.toString())
        if (filters.limit) params.set('limit', filters.limit.toString())
        if (filters.module) params.set('module', filters.module)
        if (filters.action) params.set('action', filters.action)
        if (filters.startDate) params.set('startDate', filters.startDate)
        if (filters.endDate) params.set('endDate', filters.endDate)
        if (filters.admin_id) params.set('admin_id', filters.admin_id)
        if (filters.entity_id) params.set('entity_id', filters.entity_id)

        const res = await api.get(`/v1/logactivity?${params.toString()}`, {
            headers: await authHeaders()
        })

        return res.data
    } catch (error) {
        console.error('Failed to fetch activity logs:', error)
        return { data: [], meta: { page: 1, limit: 20, total: 0 } }
    }
}

// Fetch activity log summary
export async function getActivityLogSummary(): Promise<ActivityLogSummary> {
    try {
        const res = await api.get('/v1/logactivity/summary', {
            headers: await authHeaders()
        })
        return res.data
    } catch (error) {
        console.error('Failed to fetch activity log summary:', error)
        return {
            total: 0,
            byAction: {},
            byModule: {},
            recentActivity: []
        }
    }
}

// Fetch activity logs by admin ID
export async function getActivityLogsByAdmin(adminId: string, limit = 100): Promise<ActivityLog[]> {
    try {
        const res = await api.get(`/v1/logactivity/admin/${adminId}?limit=${limit}`, {
            headers: await authHeaders()
        })
        return res.data
    } catch (error) {
        console.error('Failed to fetch activity logs by admin:', error)
        return []
    }
}

// Fetch activity logs by entity ID
export async function getActivityLogsByEntity(entityId: string): Promise<ActivityLog[]> {
    try {
        const res = await api.get(`/v1/logactivity/entity/${entityId}`, {
            headers: await authHeaders()
        })
        return res.data
    } catch (error) {
        console.error('Failed to fetch activity logs by entity:', error)
        return []
    }
}

