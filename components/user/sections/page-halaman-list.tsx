import Image from "next/image"
import Link from "next/link"
import Breadcrumb from "@/components/user/partials/breadcrumb"
import { Page } from "@/services/page/page-service"
import { Menu } from "@/services/menu/menu-service"
import { getBaseUrl } from "@/services/helpers"
import { PaginationControl } from "@/components/pagination-control"

interface PageHalamanListProps {
    pages: Page[]
    menu: Menu
    totalPages: number
    currentPage: number
    total: number
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

function PageCard({ page, menuSlug }: { page: Page; menuSlug: string }) {
    const imageUrl = page.image
        ? page.image.startsWith('http')
            ? page.image
            : `${getBaseUrl().replace('/api', '')}${page.image}`
        : null

    const excerpt = page.dynamic_content
        ? stripHtml(page.dynamic_content).substring(0, 160)
        : ''

    const publishedAt = new Date(page.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
    })

    return (
        <Link
            href={`/${menuSlug}/${page.id}`}
            className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
            {/* Thumbnail */}
            <div className="relative w-full aspect-[16/9] bg-slate-100 overflow-hidden flex-shrink-0">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={page.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-4">
                <p className="text-xs text-slate-400 mb-2">{publishedAt}</p>
                <h3 className="font-bold text-slate-800 text-sm leading-snug mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {page.title}
                </h3>
                {excerpt && (
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">
                        {excerpt}
                    </p>
                )}
                <div className="mt-3 flex items-center text-blue-600 text-xs font-medium">
                    Selengkapnya
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </Link>
    )
}

export function PageHalamanList({ pages, menu, totalPages, currentPage, total }: PageHalamanListProps) {
    const breadcrumbItems = [{ label: menu.title }]

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <Breadcrumb items={breadcrumbItems} />
                    <h1 className="text-3xl md:text-4xl font-bold mt-4 leading-tight">
                        {menu.title}
                    </h1>
                    <p className="mt-2 text-blue-100 text-sm">
                        Total {total} artikel tersedia
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-10">
                {pages.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pages.map((page) => (
                                <PageCard key={page.id} page={page} menuSlug={menu.slug} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-12">
                                <PaginationControl
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-slate-700 mb-1">Belum Ada Artikel</h3>
                        <p className="text-sm text-slate-400">Konten untuk halaman ini belum tersedia.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
