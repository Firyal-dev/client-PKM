"use client"
import Image from "next/image"
import HeroHeader from "@/components/user/partials/hero-header"
import { Page } from "@/services/page/page-service"
import { Menu } from "@/services/menu/menu-service"
import { getBaseUrl } from "@/services/helpers"
import { getMediaUrl } from "@/lib/getMediaUrl"
import DOMPurify from "isomorphic-dompurify"
import { useTranslations, useLocale } from "next-intl"

interface PageDynamicProps {
    page: Page
    menu: Menu
    /** Jika halaman ini adalah detail dari list (berita), pass true agar breadcrumb tampil 2 level */
    isDetail?: boolean
}

export function PageDynamic({ page, menu, isDetail = false }: PageDynamicProps) {
    const t = useTranslations("Pages")
    const locale = useLocale()
    
    const breadcrumbItems = isDetail
        ? [{ label: menu.title, href: `/${menu.slug}` }, { label: page.title }]
        : [{ label: menu.title }]

    const imageUrl = getMediaUrl(page.image)

    const sanitizedContent = page.dynamic_content ? DOMPurify.sanitize(page.dynamic_content) : ""

    return (
        <div className="min-h-screen bg-slate-50">
            <HeroHeader
                items={breadcrumbItems}
                title={isDetail ? page.title : menu.title}
                description={isDetail ? new Date(page.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
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
                        {isDetail && (
                            <button
                                onClick={() => window.history.back()}
                                className="text-[10px] font-black uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                {t('back')}
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
                            !page.file && (
                                <div className="text-center py-20 text-slate-300">
                                    <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="font-bold uppercase tracking-widest text-[10px]">{t('contentNotAvailable')}</p>
                                </div>
                            )
                        )}

                        {/* PDF Viewer Card inside Dynamic Content */}
                        {page.file && (
                            <div className={`mt-10 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-sm`}>
                                <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">{t('attachmentDoc')}</span>
                                            <span className="text-[10px] text-slate-400">{t('pdfPreview')}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={(page.file && page.file.startsWith('http')) ? page.file : (getMediaUrl(page.file) || '#')}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            {t('fullView')}
                                        </a>
                                        <a
                                            href={(page.file && page.file.startsWith('http')) ? page.file : (getMediaUrl(page.file) || '#')}
                                            download
                                            className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-200"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            {t('download')}
                                        </a>
                                    </div>
                                </div>
                                <div className="relative" style={{ height: '75vh', maxHeight: '700px' }}>
                                    <iframe
                                        src={`${(page.file && page.file.startsWith('http')) ? page.file : (getMediaUrl(page.file) || '')}#toolbar=0&navpanes=0&scrollbar=0`}
                                        className="w-full h-full border-none bg-slate-100"
                                        title={page.title}
                                    />
                                </div>
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
