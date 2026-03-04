import { notFound } from "next/navigation"
import { MenuForm } from "../menu-form"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getAdminMenuById, updateMenuAction, getAdminParentMenus } from "@/services/menu/menu-service"
import { SetBreadcrumb } from "@/components/admin/breadcrumb-context"

export default async function EditMenuPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const menu = await getAdminMenuById(id)
    if (!menu) return notFound()

    const parentMenus = await getAdminParentMenus()

    return (
        <div className="px-5 pb-10">
            <SetBreadcrumb title={menu.title} />
            <PageHeader
                title={`Edit Menu: ${menu.title}`}
                description="Edit menu navigasi"
            >
                <Link href="/admin/menus">
                    <Button variant="outline" className="gap-2 rounded-xl">
                        <ChevronLeft className="w-4 h-4" /> Kembali
                    </Button>
                </Link>
            </PageHeader>
            <div className="mt-8 max-w-4xl">
                <MenuForm action={updateMenuAction.bind(null, id)} initialData={menu} parentMenus={parentMenus} />
            </div>
        </div>
    )
}
