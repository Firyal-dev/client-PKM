import { PageForm } from "../page-form"
import { PageHeader } from "@/components/admin/page-header"
import { createPageAction } from "@/services/page/page-service"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getAdminMenusLegacy } from "@/services/menu/menu-service"

export default async function CreatePagePage() {
    const menus = await getAdminMenusLegacy()

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Tambah Halaman Baru"
                description="Tambahkan halaman baru ke dalam sistem"
            >
                <Link href="/admin/dynamic-pages">
                    <Button variant="outline" className="gap-2 rounded-xl">
                        <ChevronLeft className="w-4 h-4" /> Kembali
                    </Button>
                </Link>
            </PageHeader>
            <div className="mt-8 max-w-4xl">
                <PageForm action={createPageAction} menus={menus} />
            </div>
        </div>
    )
}
