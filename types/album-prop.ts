export interface Album {
    id: string;
    album_title: string;
    description?: string;
    album_cover?: string;
    count: number;
    created_at: Date;
}