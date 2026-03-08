export interface PuskesmasInfo {
    id: number;
    web_title: string;
    logo?: string;
    location?: string;
    social_links?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        youtube?: string;
        [key: string]: any;
    };
    lantitude?: number;
    longtitude?: number;
    contact?: string;
    email?: string;
    kepala_puskesmas?: string;
    kepala_foto?: string;
    Sambutan_konten?: string;
    created_at: string;
    updated_at: string;
}
