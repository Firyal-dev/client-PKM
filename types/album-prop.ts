interface BaseAlbum {
    album_title: string;
}

export interface Album extends BaseAlbum {
    id: string;
    album_cover?: string;
    count: number;
    created_at: Date;
}