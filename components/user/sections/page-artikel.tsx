"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getMediaUrl } from "@/lib/getMediaUrl"
import { Page } from "@/services/page/page-service"
import Breadcrumb from "@/components/user/partials/breadcrumb"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

interface PageLayoutArtikelProps {
  page: Page
  menuTitle?: string
  breadcrumbItems?: { label: string; href?: string }[]
  relatedPages?: Page[]
}

// Layout: Artikel (default - single column with image)
export function PageLayoutArtikel({ page, menuTitle, breadcrumbItems, relatedPages = [] }: PageLayoutArtikelProps) {
  const imageUrl = page.image ? getMediaUrl(page.image) : null

  // Search and pagination state
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Filter pages by search
  const filteredPages = relatedPages.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Paginate
  const totalPages = Math.ceil(filteredPages.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPages = filteredPages.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <Breadcrumb items={breadcrumbItems} />
      )}

      {/* Header dengan gambar */}
      {imageUrl && (
        <div className="relative w-full h-[300px] md:h-[400px] mb-8 rounded-xl overflow-hidden">
          <Image
            src={imageUrl}
            alt={page.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Judul */}
      <h1 className="text-3xl md:text-4xl font-bold mb-6">{page.title}</h1>

      {/* Konten dengan HTML */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />

      {/* Related Pages Section */}
      {paginatedPages.length > 0 && (
        <div className="mt-16 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">Artikel Terkait</h2>

          {/* Search */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="max-w-xs"
            />
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPages.map((relatedPage) => {
              const relatedImageUrl = relatedPage.image ? getMediaUrl(relatedPage.image) : null
              return (
                <Link
                  key={relatedPage.id}
                  href={`/${relatedPage.menu?.title?.toLowerCase().replace(/\s+/g, '-') || 'page'}`}
                  className="group block"
                >
                  <article className="bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                    {relatedImageUrl && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={relatedImageUrl}
                          alt={relatedPage.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedPage.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {relatedPage.content?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                      </p>
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
            <p className="text-center text-muted-foreground py-8">
              Tidak ada artikel yang ditemukan.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
