import { MenuForm } from "../menu-form"
import { PageHeader } from "@/components/admin/page-header"
import { createMenuAction, getAdminParentMenus } from "@/services/menu/menu-service"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function CreateMenuPage() {
    const parentMenus = await getAdminParentMenus()

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Tambah Menu Baru"
                description="Tambahkan menu baru ke navigasi"
            >
                <Link href="/admin/menus">
                    <Button variant="outline" className="gap-2 rounded-xl">
                        <ChevronLeft className="w-4 h-4" /> Kembali
                    </Button>
                </Link>
            </PageHeader>
            <div className="mt-8 max-w-4xl">
                <MenuForm action={createMenuAction} parentMenus={parentMenus} />
            </div>
        </div>
    )
}
