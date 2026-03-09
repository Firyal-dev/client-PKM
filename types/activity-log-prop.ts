export type ActivityLogAction =
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'LOGIN'
    | 'LOGOUT'
    | 'SWITCH_CONTEXT'

export interface ActivityLog {
    id: string
    admin_id: string | null
    admin_name: string | null
    puskesmas_id: string | null
    action: ActivityLogAction
    module: string | null
    entity_id: string | null
    payload_before: Record<string, any> | null
    payload_after: Record<string, any> | null
    ip_address: string | null
    user_agent: string | null
    route: string | null
    method: string | null
    status_code: number | null
    created_at: string
}

export interface ActivityLogResponse {
    data: ActivityLog[]
    meta: {
        page: number
        limit: number
        total: number
    }
}

export interface ActivityLogSummary {
    total: number
    byAction: Record<string, number>
    byModule: Record<string, number>
    recentActivity: ActivityLog[]
}

export interface ActivityLogFilters {
    page?: number
    limit?: number
    module?: string
    action?: string
    startDate?: string
    endDate?: string
    admin_id?: string
    entity_id?: string
}
