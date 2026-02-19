import { notFound } from "next/navigation"
import { getPublicMenuBySlug, Menu } from "@/services/menu/menu-service"
import { getPublicPageByMenuId, getPublishedPages, Page } from "@/services/page/page-service"
import { PageLayoutArtikel } from "@/components/user/sections/page-artikel"
import { PageLayoutCards } from "@/components/user/sections/page-cards"
import { PageLayoutList } from "@/components/user/sections/page-list"
import Breadcrumb from "@/components/user/partials/breadcrumb"

async function getPageData(slug: string): Promise<{ menu: Menu; page: Page; allPages: Page[] } | null> {
  try {
    const menu = await getPublicMenuBySlug(slug)
    const page = await getPublicPageByMenuId(menu.id)
    const allPages = await getPublishedPages()
    return { menu, page, allPages }
  } catch {
    return null
  }
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const { slug } = await params

  const data = await getPageData(slug)

  if (!data) {
    return notFound()
  }

  const { page, menu, allPages } = data

  // Filter out current page from related pages
  const relatedPages = allPages.filter(p => p.id !== page.id)

  // Breadcrumb items
  const breadcrumbItems = [
    { label: menu.title }
  ]

  // Render berdasarkan layout
  switch (page.layout) {
    case 'cards':
      return <PageLayoutCards page={page} menuTitle={menu.title} breadcrumbItems={breadcrumbItems} relatedPages={relatedPages} />
    case 'list':
      return <PageLayoutList page={page} menuTitle={menu.title} breadcrumbItems={breadcrumbItems} relatedPages={relatedPages} />
    case 'artikel':
    default:
      return <PageLayoutArtikel page={page} menuTitle={menu.title} breadcrumbItems={breadcrumbItems} relatedPages={relatedPages} />
  }
}

// Generate metadata dinamis
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params

  const data = await getPageData(slug)

  if (!data) {
    return {
      title: 'Halaman Tidak Ditemukan',
    }
  }

  const { page } = data

  return {
    title: `${page.title} | Puskesmas Kecamatan Sehat`,
    description: page.content?.substring(0, 160) || page.title,
  }
}
