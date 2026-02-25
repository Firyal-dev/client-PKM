import { getAdminMenusByType } from "@/services/menu/menu-service"
import { PageHeader } from "@/components/admin/page-header"
import { StaticPageForm } from "../static-page-form"
import { createStaticPageAction } from "@/services/static-page/static-page-service"

export default async function CreateStaticPagePage() {
    const menus = await getAdminMenusByType('static')

    return (
        <div className="space-y-6">
            <PageHeader
                title="Buat Halaman Statis"
                description="Buat halaman statis baru untuk website"
            />

            <StaticPageForm
                action={createStaticPageAction}
                menus={menus}
            />
        </div>
    )
}
