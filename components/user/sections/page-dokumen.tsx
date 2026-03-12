'use client'

import { useState } from "react"
import HeroHeader from "@/components/user/partials/hero-header"
import { Page } from "@/services/page/page-service"
import { Menu } from "@/services/menu/menu-service"
import { getBaseUrl } from "@/services/helpers"
import DOMPurify from "isomorphic-dompurify"

interface PageDokumenProps {
    page: Page
    menu: Menu
}

export function PageDokumen({ page, menu }: PageDokumenProps) {
    const breadcrumbItems = [{ label: menu.title }]
    const [previewOpen, setPreviewOpen] = useState(false)

    const fileUrl = page.file
        ? page.file.startsWith('http')
            ? page.file
            : `${getBaseUrl().replace('/api', '')}${page.file}`
        : null

    const sanitizedContent = page.dynamic_content ? DOMPurify.sanitize(page.dynamic_content) : ""

    return (
        <div className="min-h-screen bg-slate-50">
            <HeroHeader
                items={breadcrumbItems}
                title={menu.title}
            />

            <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16 py-10 space-y-6">

                {fileUrl ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

                        {/* Info Bar + Actions */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 text-sm">{page.title}</p>
                                    <p className="text-xs text-slate-400">Dokumen PDF</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Toggle Preview Button */}
                                <button
                                    type="button"
                                    onClick={() => setPreviewOpen((prev) => !prev)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors"
                                >
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-300 ${previewOpen ? 'rotate-180' : ''}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    {previewOpen ? 'Sembunyikan Preview' : 'Tampilkan Preview'}
                                </button>

                                {/* Download Button */}
                                <a
                                    href={fileUrl}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Unduh
                                </a>
                            </div>
                        </div>

                        {/* PDF Embed — collapsible */}
                        <div
                            className="overflow-hidden transition-all duration-500 ease-in-out"
                            style={{ maxHeight: previewOpen ? '85vh' : '0px' }}
                        >
                            <iframe
                                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                className="w-full"
                                style={{ height: '85vh', display: 'block' }}
                                title={page.title}
                            />
                        </div>

                    </div>
                ) : (
                    /* Fallback: file belum diupload */
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-slate-700 mb-1">Dokumen Belum Tersedia</h3>
                        <p className="text-sm text-slate-400">Dokumen untuk halaman ini belum diunggah.</p>
                    </div>
                )}

                {/* Deskripsi tambahan jika ada dynamic_content */}
                {page.dynamic_content && page.dynamic_content !== '-' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Keterangan</h2>
                        <div
                            className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                        />
                    </div>
                )}

            </div>
        </div>
    )
}
