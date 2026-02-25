import Breadcrumb from "@/components/user/partials/breadcrumb"
import { StaticPage } from "@/services/static-page/static-page-service"
import { Menu } from "@/services/menu/menu-service"

interface PageStaticProps {
    page: StaticPage
    menu: Menu
}

export function PageStatic({ page, menu }: PageStaticProps) {
    const breadcrumbItems = [{ label: menu.title }]

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
                <div className="max-w-5xl mx-auto px-4 py-12">
                    <Breadcrumb items={breadcrumbItems} />
                    <h1 className="text-3xl md:text-4xl font-bold mt-4 leading-tight">
                        {menu.title}
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
                    {/* Judul halaman */}
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                        {page.title}
                    </h2>
                    {page.static_content ? (
                        <div
                            className="prose prose-slate prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-slate-800
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-md
                prose-ul:text-slate-600 prose-ol:text-slate-600
                prose-blockquote:border-green-400 prose-blockquote:bg-green-50 prose-blockquote:rounded-r-lg prose-blockquote:py-1
                prose-table:text-sm prose-th:bg-green-50 prose-th:text-green-800"
                            dangerouslySetInnerHTML={{ __html: page.static_content }}
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
