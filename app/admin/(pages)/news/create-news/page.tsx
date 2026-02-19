import { NewsForm } from "../news-form"
import { PageHeader } from "@/components/admin/page-header"
import { createNewsAction } from "@/services/news/news-service"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function CreateNewsPage() {
    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Tambah Berita Baru"
                description="Tambahkan berita baru ke dalam sistem"
            >
                <Link href="/admin/news">
                    <Button variant="outline" className="gap-2 rounded-xl">
                        <ChevronLeft className="w-4 h-4" /> Kembali
                    </Button>
                </Link>
            </PageHeader>
            <div className="mt-8 max-w-4xl">
                <NewsForm action={createNewsAction} />
            </div>
        </div>
    )
}