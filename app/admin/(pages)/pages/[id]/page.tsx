import { PageForm } from "../page-form"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getAdminPageById, updatePageAction } from "@/services/page/page-service"
import { getAdminMenusFlat } from "@/services/menu/menu-service"

export default async function EditPagePage({ params }: { params: { id: string } }) {
    const { id } = await params
    const page = await getAdminPageById(id)
    const menus = await getAdminMenusFlat()

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Edit Halaman"
                description="Edit halaman konten"
            >
                <Link href="/admin/pages">
                    <Button variant="outline" className="gap-2 rounded-xl">
                        <ChevronLeft className="w-4 h-4" /> Kembali
                    </Button>
                </Link>
            </PageHeader>
            <div className="mt-8 max-w-4xl">
                <PageForm action={updatePageAction.bind(null, id)} initialData={page} menus={menus} />
            </div>
        </div>
    )
}
