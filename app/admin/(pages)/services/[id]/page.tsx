import { ServiceForm } from "../service-form"
import { PageHeader } from "@/components/admin/page-header"
import { updateServiceAction, getAdminServiceById } from "@/services/services/service-service"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface EditServicePageProps {
    params: Promise<{ id: string }>
}

export default async function EditServicePage({ params }: EditServicePageProps) {
    const { id } = await params
    const service = await getAdminServiceById(id)

    const updateAction = updateServiceAction.bind(null, id)

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Edit Layanan"
                description="Edit layanan yang sudah ada"
            >
                <Link href="/admin/services">
                    <Button variant="outline" className="gap-2 rounded-xl">
                        <ChevronLeft className="w-4 h-4" /> Kembali
                    </Button>
                </Link>
            </PageHeader>
            <div className="mt-8 max-w-4xl">
                <ServiceForm initialData={service} action={updateAction} />
            </div>
        </div>
    )
}
