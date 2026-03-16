export interface Gallery {
    id: string;
    image_title: string;
    description: string;
    image: string;
}

export interface GalleryCard {
    gallery: Gallery
    isSelected: boolean
    onSelect: (id: string) => void
}
