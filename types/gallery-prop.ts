export interface Gallery {
    _id: string;
    image_title: string;
    image: string;
    created_at: Date;
}

export interface GalleryCardProp {
    gallery: Gallery
    isSelected: boolean
    onSelect: (id: string) => void
}
