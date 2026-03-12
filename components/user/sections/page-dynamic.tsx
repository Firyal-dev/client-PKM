"use client"
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

            {/* Main Article Container */}
            <div className="max-w-4xl mx-auto px-6 py-10">
                
                {/* Featured Image */}
                {imageUrl && (
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl mb-8 border-4 border-white">
                        <Image suppressHydrationWarning
                            src={imageUrl}
                            alt={page.title}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-500 hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                )}

                {/* Content Card with internal scroll */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col overflow-hidden max-h-[85vh]">
                    {/* Sticky Header inside Card (Optional) */}
                    <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detail Konten</span>
                        </div>
                        {isDetail && (
                            <button 
                                onClick={() => window.history.back()}
                                className="text-[10px] font-black uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                ← Kembali
                            </button>
                        )}
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                        {/* Judul artikel inside scroll if not isDetail (already in hero) */}
                        {!isDetail && (
                            <h2 className="text-3xl font-black text-slate-900 mb-8 leading-tight">
                                {page.title}
                            </h2>
                        )}

                        {page.dynamic_content ? (
                            <div
                                className="prose prose-blue prose-lg max-w-none text-slate-600 selection:bg-blue-100"
                                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                            />
                        ) : (
                            <div className="text-center py-20 text-slate-300">
                                <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="font-bold uppercase tracking-widest text-[10px]">Konten belum tersedia</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Progress Strip */}
                    <div className="h-1 bg-slate-100">
                        <div className="h-full bg-blue-500 w-1/3 rounded-full opacity-50" />
                    </div>
                </div>
            </div>
        </div>
    )
}
