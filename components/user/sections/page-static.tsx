import HeroHeader from "@/components/user/partials/hero-header"
import { StaticPage } from "@/services/static-page/static-page-service"
import { Menu } from "@/services/menu/menu-service"
import DOMPurify from "isomorphic-dompurify"

interface PageStaticProps {
    page: StaticPage
    menu: Menu
}

export function PageStatic({ page, menu }: PageStaticProps) {
    const breadcrumbItems = [{ label: menu.title }]
    const sanitizedContent = page.static_content ? DOMPurify.sanitize(page.static_content) : ""

    return (
        <div className="min-h-screen bg-slate-50">
            <HeroHeader
                items={breadcrumbItems}
                title={menu.title}
            />

            {/* Main Content Container */}
            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col overflow-hidden max-h-[85vh]">

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 pb-4 border-b border-slate-100 leading-tight">
                            {page.title}
                        </h2>

                        {page.static_content ? (
                            <div
                                className="prose prose-blue prose-lg max-w-none text-slate-600 selection:bg-blue-100
                                    prose-headings:font-bold prose-headings:text-slate-800
                                    prose-p:leading-relaxed
                                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                                    prose-img:rounded-2xl prose-img:shadow-lg
                                    prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50/50 prose-blockquote:rounded-r-xl
                                    prose-table:text-sm prose-th:bg-slate-50 prose-th:text-slate-700"
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

                    {/* Footer Accent Strip */}
                    <div className="h-1 bg-slate-100">
                        <div className="h-full bg-blue-500 w-1/4 rounded-full opacity-50" />
                    </div>
                </div>
            </div>
        </div>
    )
}
