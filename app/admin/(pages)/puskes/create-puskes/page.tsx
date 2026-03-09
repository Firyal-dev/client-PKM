import { PageHeader } from "@/components/admin/page-header"
import { getAdminProfile } from "@/services/admin/admin-service"
import { redirect } from "next/navigation"
import { PuskesmasForm } from "../puskes-form"
import { createPuskesmasAction } from "@/services/puskesmas/puskesmas-service"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function CreatePuskesmasPage() {
    const profile = await getAdminProfile()

    // Hanya SUPER_ADMIN yang bisa mengakses halaman ini
    if (!profile || profile.role !== 'SUPER_ADMIN') {
        redirect('/admin/dashboard')
    }

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Tambah Puskesmas"
                description="Tambah puskes baru ke dalam sistem."
            >
                <Link href="/admin/puskes">
                    <Button variant="outline">Batal</Button>
                </Link>
            </PageHeader>

            <div className="mt-8 max-w-5xl">
                <PuskesmasForm action={createPuskesmasAction} />
            </div>
        </div>
    )
}
