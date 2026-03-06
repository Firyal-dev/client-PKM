export interface AdminProfileProp {
    id: string
    sub?: string
    name: string
    photo?: string
    role?: string
    puskesmas_id?: string | null
    active_tenant?: string
    active_tenant_name?: string
}
