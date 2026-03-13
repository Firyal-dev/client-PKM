export interface Puskesmas {
    id: string;
    name: string;
    slug: string;
    status: string;
}

export interface PuskesmasList {
    docs: Puskesmas[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
}