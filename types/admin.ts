export interface Admin {
    id: string;
    name: string;
    photo?: string;
    role: 'OPERATOR' | 'SUPER_ADMIN';
    puskesmas_id?: string | null;
    puskes_name?: string | null;  // Nama puskes untuk operator
    current_token?: string;
    created_at: string;
    updated_at: string;
}

export interface AdminFormData {
    name: string;
    password?: string;
    password_confirmation?: string;
    role?: 'OPERATOR' | 'SUPER_ADMIN';
    puskesmas_id?: string;
}
