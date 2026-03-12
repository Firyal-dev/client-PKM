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

            {/* Content */}
            <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16 py-10">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                        {page.title}
                    </h2>
                    {page.static_content ? (
                        <div
                            className="prose prose-slate prose-base max-w-none
                prose-headings:font-bold prose-headings:text-slate-800
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-md
                prose-ul:text-slate-600 prose-ol:text-slate-600
                prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50/50 prose-blockquote:rounded-r-lg
                prose-table:text-sm prose-th:bg-slate-50 prose-th:text-slate-700"
                            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                        />
                    ) : (
                        <div className="text-center py-20 text-slate-400">
                            <svg className="w-12 h-12 mx-auto mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
