import { notFound } from "next/navigation"
import { getPublicPageById } from "@/services/page/page-service"
import { getPublicMenuBySlug } from "@/services/menu/menu-service"
import { PageDynamic } from "@/components/user/sections/page-dynamic"

export default async function PageDetailPage({
    params,
}: {
    params: { slug: string; pageId: string }
}) {
    const { slug, pageId } = await params

    try {
        const [page, menu] = await Promise.all([
            getPublicPageById(pageId),
            getPublicMenuBySlug(slug),
        ])

        if (!page || page.status === 0) return notFound()

        return <PageDynamic page={page} menu={menu} isDetail={true} />
    } catch {
        return notFound()
    }
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string; pageId: string }
}) {
    const { pageId } = await params

    try {
        const page = await getPublicPageById(pageId)
        return {
            title: `${page.title} | Puskesmas Kecamatan Sehat`,
            description: page.dynamic_content?.replace(/<[^>]*>/g, '').substring(0, 160) || page.title,
        }
    } catch {
        return {
            title: 'Artikel Tidak Ditemukan | Puskesmas Kecamatan Sehat',
        }
    }
}
