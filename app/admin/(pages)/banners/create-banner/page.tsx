import { PageHeader } from "@/components/admin/page-header"
import { BannerForm } from "../banner-form"
import { createBanner } from "@/services/banner/banner-service"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CreateBannerPage() {
    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Tambah Banner"
                description="Upload gambar baru untuk slider utama."
            >
                <Link href="/admin/banners">
                    <Button variant="outline">Batal</Button>
                </Link>
            </PageHeader>

            <div className="mt-8 max-w-5xl">
                <BannerForm action={createBanner} />
            </div>
        </div>
    )
}
