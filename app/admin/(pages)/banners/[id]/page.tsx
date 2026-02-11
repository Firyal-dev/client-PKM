import { PageHeader } from "@/components/admin/page-header"
import { BannerForm } from "../banner-form"
import { updateBannerAction, getAdminBannerById } from "@/services/banner/banner-service"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function UpdateBannerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    try {
        const banner = await getAdminBannerById(id)
        if (!banner) return notFound()

        const updateAction = updateBannerAction.bind(null, id)

        return (
            <div className="px-5 pb-10">
                <PageHeader
                    title="Ubah Banner"
                    description="Perbarui informasi atau gambar banner."
                >
                    <Link href="/admin/banners">
                        <Button variant="outline">Batal</Button>
                    </Link>
                </PageHeader>

                <div className="mt-8 max-w-5xl">
                    <BannerForm initialData={banner} action={updateAction} />
                </div>
            </div>
        )
    } catch (error) {
        return notFound()
    }
}
