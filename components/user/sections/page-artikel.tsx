"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { getMediaUrl } from "@/lib/getMediaUrl"
import { Page } from "@/services/page/page-service"
import Breadcrumb from "@/components/user/partials/breadcrumb"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight, Clock, Calendar, Share2, FileText, Download } from "lucide-react"
import DOMPurify from "isomorphic-dompurify"

interface PageLayoutArtikelProps {
  page: Page
  menuTitle?: string
  breadcrumbItems?: { label: string; href?: string }[]
  relatedPages?: Page[]
}

export function PageLayoutArtikel({ page, menuTitle, breadcrumbItems, relatedPages = [] }: PageLayoutArtikelProps) {
  const imageUrl = page.image ? getMediaUrl(page.image) : null

  // States
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Filter & Paginate
  const filteredPages = useMemo(() =>
    relatedPages.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [relatedPages, searchQuery]
  )

  const totalPages = Math.ceil(filteredPages.length / itemsPerPage)
  const paginatedPages = filteredPages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch (e) { return '-' }
  }

  // Ambil URL file jika ada
  const fileUrl = page.file ? getMediaUrl(page.file) : null

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20">
      <div className="container mx-auto px-4 pt-8">
        {/* Breadcrumb */}
        {breadcrumbItems && breadcrumbItems.length > 0 && (
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Article Header - Bersih Total Sesuai Permintaan */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight uppercase tracking-tight">
              {menuTitle || page.title}
            </h1>
            <div className="w-20 h-2 bg-blue-600 rounded-full" />
          </header>

          {/* Featured Image - Lebih Elegan */}
          {imageUrl && (
            <div className="relative w-full aspect-[21/9] mb-12 rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100">
              <Image
                src={imageUrl}
                alt={page.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Main Content */}
          <article className="bg-white p-6 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div
              className="prose prose-slate prose-lg max-w-none 
                prose-headings:text-slate-900 prose-headings:font-bold
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-img:rounded-2xl prose-strong:text-slate-900
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.content) }}
            />

            {/* File Download Section - Tampilkan jika ada file */}
            {fileUrl && (
              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">File Pendukung</p>
                    <p className="text-sm text-slate-500">Terdapat file yang dapat diunduh</p>
                  </div>
                  <a
                    href={fileUrl}
                    download
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Unduh
                  </a>
                </div>
              </div>
            )}
          </article>

          {/* Related Section */}
          {paginatedPages.length > 0 && (
            <section className="mt-24">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Halaman Terkait</h2>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Cari konten..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="pl-10 w-full md:w-[300px] h-11 bg-white border-slate-200 rounded-xl focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedPages.map((related) => (
                  <Link
                    key={related.id}
                    href={`/${related.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      <div className="relative aspect-video overflow-hidden">
                        {related.image ? (
                          <Image
                            src={getMediaUrl(related.image) || ""}
                            alt={related.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                            <span className="text-slate-400">No Image</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                            {related.menu?.title || 'Umum'}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-bold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors mb-3">
                          {related.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-12">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl h-11 w-11 border-slate-200"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600">
                    <span className="text-slate-900">{currentPage}</span> / {totalPages}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl h-11 w-11 border-slate-200"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
