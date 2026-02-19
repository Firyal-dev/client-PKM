import { NewsForm } from "../news-form"
import { PageHeader } from "@/components/admin/page-header"
import { updateNewsAction } from "@/services/news/news-service"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getAdminNewsById } from "@/services/news/news-service"

interface EditNewsPageProps {
    params: Promise<{ id: string }>
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
    const { id } = await params
    const news = await getAdminNewsById(id)

    const updateAction = updateNewsAction.bind(null, id)

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Edit Berita"
                description="Edit berita yang sudah ada"
            >
                <Link href="/admin/news">
                    <Button variant="outline" className="gap-2 rounded-xl">
                        <ChevronLeft className="w-4 h-4" /> Kembali
                    </Button>
                </Link>
            </PageHeader>
            <div className="mt-8 max-w-4xl">
                <NewsForm initialData={news} action={updateAction} />
            </div>
        </div>
    )
}
