import { MenuForm } from "../menu-form"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getAdminMenuById, updateMenuAction, getAdminParentMenus } from "@/services/menu/menu-service"

export default async function EditMenuPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const menu = await getAdminMenuById(id)
    const parentMenus = await getAdminParentMenus()

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Edit Menu"
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
