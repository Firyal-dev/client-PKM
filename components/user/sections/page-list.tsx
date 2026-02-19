"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getMediaUrl } from "@/lib/getMediaUrl"
import { Page } from "@/services/page/page-service"
import Breadcrumb from "@/components/user/partials/breadcrumb"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight, Calendar, ArrowRight } from "lucide-react"

interface PageLayoutListProps {
  page: Page
  menuTitle?: string
  breadcrumbItems?: { label: string; href?: string }[]
  relatedPages?: Page[]
}

// Layout: List (list-based display with sidebar feel)
export function PageLayoutList({ page, menuTitle, breadcrumbItems, relatedPages = [] }: PageLayoutListProps) {
  const imageUrl = page.image ? getMediaUrl(page.image) : null

  // Search and pagination state
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter pages by search
  const filteredPages = relatedPages.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Paginate
  const totalPages = Math.ceil(filteredPages.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPages = filteredPages.slice(startIndex, startIndex + itemsPerPage)

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Breadcrumb */}
          {breadcrumbItems && breadcrumbItems.length > 0 && (
            <Breadcrumb items={breadcrumbItems} />
          )}

          {/* Image on top for mobile/tablet */}
          {imageUrl && (
            <div className="relative w-full h-[200px] md:h-[300px] mb-6 rounded-lg overflow-hidden lg:hidden">
              <Image
                src={imageUrl}
                alt={page.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <h1 className="text-2xl md:text-3xl font-bold mb-6">{page.title}</h1>

          <div
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>

        {/* Sidebar - Image dan info */}
        <div className="hidden lg:block lg:col-span-1">
          {imageUrl && (
            <div className="sticky top-24">
              <div className="relative w-full h-[200px] rounded-lg overflow-hidden mb-4">
                <Image
                  src={imageUrl}
                  alt={page.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Informasi</h3>
                <p className="text-sm text-muted-foreground">
                  {page.title} - Halaman ini menampilkan informasi lengkap mengenai {page.title.toLowerCase()}.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Pages Section - Below content */}
      {paginatedPages.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">Daftar Artikel</h2>

          {/* Search */}
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* List View */}
          <div className="space-y-4">
            {paginatedPages.map((relatedPage) => {
              const relatedImageUrl = relatedPage.image ? getMediaUrl(relatedPage.image) : null
              return (
                <Link
                  key={relatedPage.id}
                  href={`/${relatedPage.menu?.title?.toLowerCase().replace(/\s+/g, '-') || 'page'}`}
                  className="group block"
                >
                  <article className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 hover:shadow-md transition-all">
                    {relatedImageUrl && (
                      <div className="relative h-[150px] sm:h-[120px] sm:w-[160px] flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={relatedImageUrl}
                          alt={relatedPage.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                        {relatedPage.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {relatedPage.content?.replace(/<[^>]*>/g, '').substring(0, 150)}...
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
                        <Calendar className="h-3 w-3" />
                        {formatDate(relatedPage.created_at)}
                        <span className="ml-auto flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Baca selengkapnya <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Halaman {currentPage} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* No results */}
          {filteredPages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Tidak ada artikel yang ditemukan.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
