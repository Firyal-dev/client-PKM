import { notFound, redirect } from "next/navigation"
import { getPublicMenuBySlug } from "@/services/menu/menu-service"
import { getPublicPageByMenuId, getPublicPagesByMenuId } from "@/services/page/page-service"
import { getPublicStaticPageByMenuId } from "@/services/static-page/static-page-service"
import { PageStatic } from "@/components/user/sections/page-static"
import { PageDynamic } from "@/components/user/sections/page-dynamic"
import { PageDokumenList } from "@/components/user/sections/page-dokumen-list"
import { PageHalamanList } from "@/components/user/sections/page-halaman-list"

async function getMenuData(slug: string) {
  try {
    const menu = await getPublicMenuBySlug(slug)
    return { menu }
  } catch {
    return null
  }
}

export default async function SlugPage({ params }: { params: { slug: string } }) {
  const { slug } = await params

  const data = await getMenuData(slug)
  if (!data) return notFound()

  const { menu } = data

  // ─── MENU TYPE: CUSTOM ─────────────────────────────────────────────────────
  if (menu.type === 'custom') {
    if (menu.url_target && menu.url_target !== '/') {
      redirect(menu.url_target)
    }
    return notFound()
  }

  // ─── MENU TYPE: STATIC ─────────────────────────────────────────────────────
  if (menu.type === 'static') {
    try {
      const page = await getPublicStaticPageByMenuId(menu.id)
      return <PageStatic page={page} menu={menu} />
    } catch {
      return notFound()
    }
  }

  // ─── MENU TYPE: DYNAMIC ────────────────────────────────────────────────────
  try {
    // Ambil semua pages aktif untuk menu ini
    const pages = await getPublicPagesByMenuId(menu.id)
    if (pages.length === 0) return notFound()

    const firstPage = pages[0]

    // Dokumen PDF → list semua dokumen + toggle preview
    if (firstPage.type === 'pdf') {
      return <PageDokumenList pages={pages} menu={menu} />
    }

    // Kartu (Berita / Artikel) → grid kartu, klik buka halaman detail
    if (firstPage.type === 'kartu') {
      return <PageHalamanList pages={pages} menu={menu} />
    }

    // Halaman konten biasa ('halaman') → tampilkan artikel tunggal
    return <PageDynamic page={firstPage} menu={menu} />

  } catch {
    return notFound()
  }
}

// Generate metadata dinamis
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params

  try {
    const menu = await getPublicMenuBySlug(slug)

    if (menu.type === 'static') {
      const page = await getPublicStaticPageByMenuId(menu.id)
      return {
        title: `${menu.title} | Puskesmas Kecamatan Sehat`,
        description: page.static_content?.replace(/<[^>]*>/g, '').substring(0, 160) || menu.title,
      }
    }

    if (menu.type === 'dynamic' || !menu.type) {
      const page = await getPublicPageByMenuId(menu.id)
      return {
        title: `${menu.title} | Puskesmas Kecamatan Sehat`,
        description: page.dynamic_content?.replace(/<[^>]*>/g, '').substring(0, 160) || menu.title,
      }
    }

    return {
      title: `${menu.title} | Puskesmas Kecamatan Sehat`,
    }
  } catch {
    return {
      title: 'Halaman Tidak Ditemukan | Puskesmas Kecamatan Sehat',
    }
  }
}
