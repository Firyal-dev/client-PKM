export interface Gallery {
    id: string;
    title: string;
    image: string;
}

export interface GalleryCardProp {
    gallery: Gallery
    isSelected: boolean
    onSelect: (id: string) => void
}
