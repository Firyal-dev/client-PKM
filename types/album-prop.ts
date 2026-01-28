interface BaseAlbum {
    album_title: string;
    description?: string;
}

export interface Album extends BaseAlbum {
    _id: string;
    album_cover: string;
    count: number;
    created_at: Date;
}