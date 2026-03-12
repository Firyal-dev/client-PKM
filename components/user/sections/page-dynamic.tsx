import Image from "next/image"
import HeroHeader from "@/components/user/partials/hero-header"
import { Page } from "@/services/page/page-service"
import { Menu } from "@/services/menu/menu-service"
import { getBaseUrl } from "@/services/helpers"
import DOMPurify from "isomorphic-dompurify"

interface PageDynamicProps {
    page: Page
    menu: Menu
    /** Jika halaman ini adalah detail dari list (berita), pass true agar breadcrumb tampil 2 level */
    isDetail?: boolean
}

export function PageDynamic({ page, menu, isDetail = false }: PageDynamicProps) {
    const breadcrumbItems = isDetail
        ? [{ label: menu.title, href: `/${menu.slug}` }, { label: page.title }]
        : [{ label: menu.title }]

    const imageUrl = page.image
        ? page.image.startsWith('http')
            ? page.image
            : `${getBaseUrl().replace('/api', '')}${page.image}`
        : null

    const sanitizedContent = page.dynamic_content ? DOMPurify.sanitize(page.dynamic_content) : ""

    return (
        <div className="min-h-screen bg-slate-50">
            <HeroHeader
                items={breadcrumbItems}
                title={isDetail ? page.title : menu.title}
                description={isDetail ? new Date(page.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric',
                }) : undefined}
            />

            {/* Featured Image */}
            {imageUrl && (
                <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16 pt-8">
                    <div className="relative w-full h-56 md:h-72 rounded-xl overflow-hidden shadow-md">
                        <Image
                            src={imageUrl}
                            alt={page.title}
                            fill
                            unoptimized
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16 py-10">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
                    {/* Judul artikel (hanya untuk halaman tunggal / non-detail agar tidak duplikat) */}
                    {!isDetail && (
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                            {page.title}
                        </h2>
                    )}

                    {page.dynamic_content ? (
                        <div
                            className="prose prose-slate max-w-none"
                            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                        />
                    ) : (
                        <div className="text-center py-16 text-slate-400">
                            <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-sm">Konten belum tersedia</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
