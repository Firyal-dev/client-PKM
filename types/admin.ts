export interface Admin {
    id: string;
    name: string;
    photo?: string;
    role: 'OPERATOR' | 'SUPER_ADMIN';
    puskesmas_id?: string | null;
    current_token?: string;
    created_at: string;
    updated_at: string;
}

export interface AdminFormData {
    name: string;
    password?: string;
    role?: 'OPERATOR' | 'SUPER_ADMIN';
    puskesmas_id?: string;
}
