import { PageHeader } from "@/components/admin/page-header"
import { getAdminProfile } from "@/services/admin/admin-service"
import { redirect, notFound } from "next/navigation"
import { PuskesmasForm } from "../puskes-form"
import { getAdminPuskesmasById, updatePuskesmasAction } from "@/services/puskesmas/puskesmas-service"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function UpdatePuskesmasPage({ params }: { params: Promise<{ id: string }> }) {
    const profile = await getAdminProfile()

    // Hanya SUPER_ADMIN yang bisa mengakses halaman ini
    if (!profile || profile.role !== 'SUPER_ADMIN') {
        redirect('/admin/dashboard')
    }

    const { id } = await params

    try {
        const puskesmas = await getAdminPuskesmasById(id)
        if (!puskesmas) return notFound()

        const updateAction = updatePuskesmasAction.bind(null, id)

        return (
            <div className="px-5 pb-10">
                <PageHeader
                    title="Ubah Puskesmas"
                    description="Perbarui informasi puskes."
                >
                    <Link href="/admin/puskes">
                        <Button variant="outline">
                            <ChevronLeft className="w-4 h-4" />Batal
                        </Button>
                    </Link>
                </PageHeader>

                <div className="mt-8 max-w-5xl">
                    <PuskesmasForm initialData={puskesmas} action={updateAction} />
                </div>
            </div>
        )
    } catch (error) {
        return notFound()
    }
}
