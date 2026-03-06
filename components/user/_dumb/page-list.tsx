"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { getMediaUrl } from "@/lib/getMediaUrl"
import { Page } from "@/services/page/page-service"
import Breadcrumb from "@/components/user/partials/breadcrumb"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight, Calendar, ArrowRight, BookOpen, Info, FileText, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import DOMPurify from "isomorphic-dompurify"

interface PageLayoutListProps {
  page: Page
  menuTitle?: string
  breadcrumbItems?: { label: string; href?: string }[]
  relatedPages?: Page[]
}

export function PageLayoutList({ page, menuTitle, breadcrumbItems, relatedPages = [] }: PageLayoutListProps) {
  const imageUrl = page.image ? getMediaUrl(page.image) : null

  // States
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter & Paginate
  const filteredPages = useMemo(() =>
    relatedPages.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [relatedPages, searchQuery]
  )

  // Ambil URL file jika ada
  const fileUrl = page.file ? getMediaUrl(page.file) : null

  const totalPages = Math.ceil(filteredPages.length / itemsPerPage)
  const paginatedPages = filteredPages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          {breadcrumbItems && breadcrumbItems.length > 0 && (
            <div className="mb-8">
              <Breadcrumb items={breadcrumbItems} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Sidebar (Main Info) */}
            <div className="lg:col-span-4 order-2 lg:order-1">
              <div className="sticky top-28 space-y-8">
                {/* Featured Image Sidebar */}
                <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="relative aspect-square rounded-[1.5rem] overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={page.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-blue-200" />
                      </div>
                    )}
                  </div>
                  <div className="mt-6 p-2">
                    <div className="flex items-center gap-2 text-blue-600 mb-3">
                      <Info className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Informasi Halaman</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Anda sedang melihat halaman <strong>{page.title}</strong>.
                      Halaman ini dikelola secara berkala untuk memberikan informasi terbaru kepada masyarakat.
                    </p>
                  </div>
                </div>

                {/* Quick Search Widget */}
                <div className="bg-blue-600 p-8 rounded-[2rem] shadow-xl shadow-blue-200 text-white relative overflow-hidden">
                  <Search className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 -rotate-12" />
                  <h3 className="text-xl font-bold mb-4 relative">Cari Artikel</h3>
                  <div className="relative relative">
                    <Input
                      placeholder="Ketik kata kunci..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl h-11 focus:bg-white focus:text-slate-900 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: List Content */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <div className="mb-12">
                <div className="flex items-center gap-6 mb-10 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>{formatDate(page.createdAt || (page as any).created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                    <span>1 Menit Baca</span>
                  </div>
                </div>

                <div
                  className="prose prose-slate prose-lg max-w-none text-slate-600 mb-12 bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-sm"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.content || page.dynamic_content || "") }}
                />

                {/* File Download Section - Dinamis dengan Nama File Asli */}
                {fileUrl && (
                  <div className="mt-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-blue-50 rounded-[2rem] border border-blue-100 group hover:bg-blue-600 hover:border-blue-700 transition-all duration-500">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:bg-white group-hover:shadow-none transition-all">
                        <FileText className="w-8 h-8 text-white group-hover:text-blue-600" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <p className="font-black text-blue-900 group-hover:text-white transition-colors text-lg line-clamp-1">
                          {page.file?.split('/').pop()?.replace(/^PAGE-[a-f0-9-]{36}-/, '') || 'Dokumen Lampiran'}
                        </p>
                        <p className="text-sm text-blue-600 font-medium group-hover:text-blue-100 transition-colors">
                          Klik unduh untuk menyimpan berkas
                        </p>
                      </div>
                      <a
                        href={fileUrl}
                        download
                        className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-none transition-all"
                      >
                        <Download className="w-5 h-5" />
                        Unduh
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* List of Related Articles */}
              {paginatedPages.length > 0 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Daftar Berkas & Dokumen</h2>
                  </div>

                  <div className="space-y-6">
                    {paginatedPages.map((related) => (
                      <Link
                        key={related.id}
                        href={`/pages/${related.id}`}
                        className="group block"
                      >
                        <article className="flex flex-col md:flex-row gap-6 p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300">
                          <div className="relative w-full md:w-48 h-40 flex-shrink-0 rounded-2xl overflow-hidden">
                            {related.image ? (
                              <Image
                                src={getMediaUrl(related.image) || ""}
                                alt={related.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-slate-200" />
                                {related.file ? (
                                  <FileText className="w-8 h-8 text-slate-400" />
                                ) : (
                                  <BookOpen className="w-8 h-8 text-slate-200" />
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-4 text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">
                              <span>{related.menu?.title || 'Dokumen'}</span>
                              <span className="w-1 h-1 bg-slate-300 rounded-full" />
                              <span className="text-slate-400 font-medium normal-case">
                                {formatDate(related.createdAt || (related as any).created_at)}
                              </span>
                            </div>

                            <div className="flex items-start justify-between gap-4">
                              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                                {related.title}
                              </h3>
                              {related.file && (
                                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold border border-emerald-100">
                                  <Download className="w-3.5 h-3.5" />
                                  PDF
                                </div>
                              )}
                            </div>

                            <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                              {related.content?.replace(/<[^>]*>/g, '').substring(0, 160)}...
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                              <div className="flex items-center gap-2 text-blue-600 text-sm font-bold group-hover:gap-4 transition-all">
                                {related.file ? 'Unduh Dokumen' : 'Lihat Detail'}
                                <ArrowRight className="w-4 h-4" />
                              </div>
                              {related.file && (
                                <span className="text-[10px] font-bold text-slate-400 italic">
                                  Klik untuk mengunduh berkas
                                </span>
                              )}
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-12">
                      <p className="text-sm text-slate-500">
                        Menampilkan <span className="font-bold text-slate-900">{paginatedPages.length}</span> dari <span className="font-bold text-slate-900">{filteredPages.length}</span> konten
                      </p>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-xl h-11 w-11 border-slate-200 hover:bg-white hover:shadow-md"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>

                        <div className="bg-white h-11 px-4 flex items-center rounded-xl border border-slate-200 text-sm font-bold">
                          {currentPage} / {totalPages}
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-xl h-11 w-11 border-slate-200 hover:bg-white hover:shadow-md"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
