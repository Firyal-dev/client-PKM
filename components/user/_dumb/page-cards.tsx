"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { getMediaUrl } from "@/lib/getMediaUrl"
import { Page } from "@/services/page/page-service"
import Breadcrumb from "@/components/user/partials/breadcrumb"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight, LayoutGrid, FileText, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PageLayoutCardsProps {
  page: Page
  menuTitle?: string
  breadcrumbItems?: { label: string; href?: string }[]
  relatedPages?: Page[]
}

export function PageLayoutCards({ page, menuTitle, breadcrumbItems, relatedPages = [] }: PageLayoutCardsProps) {
  // States
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Filter & Paginate
  const filteredPages = useMemo(() =>
    relatedPages.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [relatedPages, searchQuery]
  )

  const totalPages = Math.ceil(filteredPages.length / itemsPerPage)
  const paginatedPages = filteredPages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">

          {/* Header: Hanya Breadcrumb & Title dari Menu */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-slate-200 pb-10">
            <div className="space-y-4">
              {breadcrumbItems && breadcrumbItems.length > 0 && (
                <Breadcrumb items={breadcrumbItems} />
              )}
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">
                  {menuTitle || page.title}
                </h1>
              </div>
            </div>

            {/* Search Bar Premium */}
            <div className="relative group w-full md:w-[350px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <Input
                placeholder="Cari layanan..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-14 h-14 bg-white border-none shadow-sm rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-medium text-slate-900"
              />
            </div>
          </div>

          {/* GRID 4 KOLOM HORIZONTAL (Kartu Layanan) */}
          {paginatedPages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {paginatedPages.map((related) => {
                // Cek apakah ada konten bermakna untuk "Lihat Selengkapnya"
                const hasContent = related.content && related.content.replace(/<[^>]*>/g, '').trim().length > 0;

                return (
                  <Link
                    key={related.id}
                    href={`/${related.slug}`}
                    className="group"
                  >
                    <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden flex flex-col group-hover:-translate-y-1 bg-white">
                      {/* Media Header */}
                      {related.image ? (
                        <div className="relative h-36 overflow-hidden">
                          <Image
                            src={getMediaUrl(related.image) || ""}
                            alt={related.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-1000"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                      ) : (
                        <div className="h-36 bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center border-b border-slate-50 transition-colors group-hover:from-blue-50 group-hover:to-indigo-50">
                          <FileText className="w-12 h-12 text-slate-200 group-hover:text-blue-200 transition-colors" />
                        </div>
                      )}

                      <CardContent className="p-3 flex-1 flex flex-col">
                        <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors tracking-tight mb-2">
                          {related.title}
                        </h3>

                        {/* CTA - Hanya muncul jika ada konten */}
                        {hasContent && (
                          <div className="mt-auto pt-2 flex items-center gap-1.5 text-blue-600 text-xs font-bold group-hover:gap-2 transition-all">
                            <span>Lihat Selengkapnya</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] p-24 text-center border-2 border-dashed border-slate-100">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <LayoutGrid className="w-12 h-12 text-slate-200" />
              </div>
              <h3 className="text-2xl font-bold text-slate-400 tracking-tight">Data Tidak Tersedia</h3>
              <p className="text-slate-400 text-base mt-2">Belum ada layanan yang dapat ditampilkan</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-20">
              <Button
                variant="outline"
                size="icon"
                className="rounded-2xl h-12 w-12 border-none shadow-sm hover:bg-white hover:shadow-xl"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-6 w-6 text-slate-600" />
              </Button>

              <div className="flex gap-2.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={currentPage === p ? "default" : "ghost"}
                    className={cn(
                      "w-12 h-12 rounded-2xl font-black text-sm",
                      currentPage === p ? "bg-blue-600 shadow-xl shadow-blue-200" : "hover:bg-white hover:shadow-lg text-slate-400"
                    )}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="rounded-2xl h-12 w-12 border-none shadow-sm hover:bg-white hover:shadow-xl"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-6 w-6 text-slate-600" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
