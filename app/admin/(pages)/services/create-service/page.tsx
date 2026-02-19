import { ServiceForm } from "../service-form"
import { PageHeader } from "@/components/admin/page-header"
import { createServiceAction } from "@/services/services/service-service"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function CreateServicePage() {
    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Tambah Layanan"
                description="Tambah layanan puskesmas baru"
            >
                <Link href="/admin/services">
                    <Button variant="outline" className="gap-2 rounded-xl">
                        <ChevronLeft className="w-4 h-4" /> Kembali
                    </Button>
                </Link>
            </PageHeader>
            <div className="mt-8 max-w-4xl">
                <ServiceForm action={createServiceAction} />
            </div>
        </div>
    )
}
