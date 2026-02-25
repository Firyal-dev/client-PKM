import Image from "next/image"
import Breadcrumb from "@/components/user/partials/breadcrumb"
import { Page } from "@/services/page/page-service"
import { Menu } from "@/services/menu/menu-service"
import { getBaseUrl } from "@/services/helpers"

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

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
                <div className="max-w-5xl mx-auto px-4 py-12">
                    <Breadcrumb items={breadcrumbItems} />
                    <h1 className="text-3xl md:text-4xl font-bold mt-4 leading-tight">
                        {isDetail ? page.title : menu.title}
                    </h1>
                    {isDetail && (
                        <p className="mt-2 text-blue-100 text-sm">
                            {new Date(page.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'long', year: 'numeric',
                            })}
                        </p>
                    )}
                </div>
            </div>

            {/* Featured Image */}
            {imageUrl && (
                <div className="max-w-5xl mx-auto px-4 -mt-6">
                    <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
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
            <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
                    {/* Judul artikel (hanya untuk halaman tunggal / non-detail agar tidak duplikat) */}
                    {!isDetail && (
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                            {page.title}
                        </h2>
                    )}

                    {page.dynamic_content ? (
                        <div
                            className="prose prose-slate prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-slate-800
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-md
                prose-ul:text-slate-600 prose-ol:text-slate-600
                prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 prose-blockquote:rounded-r-lg prose-blockquote:py-1
                prose-table:text-sm prose-th:bg-blue-50 prose-th:text-blue-800"
                            dangerouslySetInnerHTML={{ __html: page.dynamic_content }}
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
