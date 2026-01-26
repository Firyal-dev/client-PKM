import { getGallery } from "@/services/gallery/gallery-service"
import { GalleryList } from "./gallery-list"
import Link from "next/link"

export default async function GalleryPage() {
    const galleryData = await getGallery()

    return (
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-6">
            <div className="flex items-center mb-6 gap-2">
                <Link
                    href="/admin/gallery/upload-photo"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-all text-sm font-medium"
                >
                    Tambah Foto
                </Link>
            </div>

            <GalleryList initialGallery={galleryData} />
        </div>
    );
}