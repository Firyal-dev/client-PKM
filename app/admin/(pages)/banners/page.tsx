import { PageHeader } from "@/components/admin/page-header"
import { getBanners } from "@/services/banner/banner-service"
import { BannerList } from "./banner-list"
import { Plus } from "lucide-react"

export default async function BannerPage() {
    const banners = await getBanners()

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Banner Utama"
                description="Kelola gambar slide di halaman depan website."
                linkHref="/admin/banners/create-banner"
                linkLabel="Tambah Banner"
            />

            <div className="mt-8">
                <BannerList banners={banners} />
            </div>
        </div>
    )
}
