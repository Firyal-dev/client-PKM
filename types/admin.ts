export interface Admin {
    id: string;
    name: string;
    photo?: string;
    level: 'operator' | 'super_admin';
    current_token?: string;
    created_at: string;
    updated_at: string;
}

export interface AdminFormData {
    name: string;
    password?: string;
    level?: 'operator' | 'super_admin';
}
