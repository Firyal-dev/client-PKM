'use client'

import { useState } from "react"
import HeroHeader from "@/components/user/partials/hero-header"
import { Page } from "@/services/page/page-service"
import { Menu } from "@/services/menu/menu-service"
import { getMediaUrl } from "@/lib/getMediaUrl"
import { PaginationControl } from "@/components/pagination-control"
import { useTranslations, useLocale } from "next-intl"

interface PageDokumenListProps {
    pages: Page[]
    menu: Menu
    totalPages: number
    currentPage: number
    total: number
}

function DokumenCard({ page }: { page: Page }) {
    const t = useTranslations("Pages")
    const locale = useLocale()
    
    const [previewOpen, setPreviewOpen] = useState(false)

    const fileUrl = page.file ? getMediaUrl(page.file) : null

    const uploadedAt = new Date(page.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
    })

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Card Info Bar */}
            <div className="flex items-center justify-between px-5 py-4 flex-wrap gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">{page.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{t('uploadedAt', { date: uploadedAt })}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    {fileUrl && (
                        <>
                            {/* Toggle Preview */}
                            <button
                                type="button"
                                onClick={() => setPreviewOpen((p) => !p)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors"
                            >
                                <svg
                                    className={`w-3.5 h-3.5 transition-transform duration-300 ${previewOpen ? 'rotate-180' : ''}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                {previewOpen ? t('close') : t('preview')}
                            </button>

                            {/* Download */}
                            <a
                                href={fileUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                {t('download')}
                            </a>
                        </>
                    )}

                    {!fileUrl && (
                        <span className="text-xs text-slate-400 italic px-3 py-2">{t('fileNotAvailable')}</span>
                    )}
                </div>
            </div>

            {/* PDF Preview — collapsible card */}
            {fileUrl && (
                <div
                    className="overflow-hidden transition-all duration-500 ease-in-out"
                    style={{ maxHeight: previewOpen ? '1000px' : '0px' }}
                >
                    <div className="mx-5 mb-5 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-inner">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-white/50 backdrop-blur-sm">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('documentPreview')}</span>
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                {t('fullView')}
                            </a>
                        </div>
                        <div className="relative" style={{ height: '75vh', maxHeight: '600px' }}>
                            <iframe
                                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                className="w-full h-full border-none"
                                title={page.title}
                            />
                            {/* Overlay protection for scroll consistency if needed, but iframe handles itself usually */}
                        </div>
                    </div>
                </div>
            )}

            {/* Keterangan (jika ada dynamic_content) */}
            {page.dynamic_content && page.dynamic_content !== '-' && (
                <div className="px-5 pb-4 pt-2 border-t border-slate-50">
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {page.dynamic_content.replace(/<[^>]*>/g, '')}
                    </p>
                </div>
            )}
        </div>
    )
}

export function PageDokumenList({ pages, menu, totalPages, currentPage, total }: PageDokumenListProps) {
    const t = useTranslations("Pages")
    const breadcrumbItems = [{ label: menu.title }]

    return (
        <div className="min-h-screen bg-slate-50">
            <HeroHeader
                items={breadcrumbItems}
                title={menu.title}
                description={t('documentsAvailable', { total })}
            />

            <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16 py-10">
                {pages.length > 0 ? (
                    <>
                        <div className="space-y-4">
                            {pages.map((page) => (
                                <DokumenCard key={page.id} page={page} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-10">
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
                                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-slate-700 mb-1">{t('noDocuments')}</h3>
                        <p className="text-sm text-slate-400">{t('noDocumentsDesc')}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
