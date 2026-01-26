export interface Gallery {
    _id: string;
    title: string;
    image: string;
    created_at: Date;
}

export interface GalleryCardProp {
    gallery: Gallery
    isSelected: boolean
    onSelect: (id: string) => void
}

export interface GalleryResponse {
    data?: Gallery[];
    error?: string;
}