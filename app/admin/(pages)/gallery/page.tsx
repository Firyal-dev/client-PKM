import { getGallery } from "@/services/gallery/gallery-service"
import { GalleryList } from "./gallery-list"
import { CustomLink } from "@/components/ui/link"

export default async function GalleryPage() {
    const galleryData = await getGallery()

    return (
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-6">
            <div className="flex items-center mb-6 gap-2">
                <CustomLink href="/admin/gallery/upload-photo">
                    Tambah Foto
                </CustomLink>
            </div>

            <GalleryList initialGallery={galleryData} />
        </div>
    );
}