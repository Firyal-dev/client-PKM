"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getMediaUrl } from "@/lib/getMediaUrl"
import { Page } from "@/services/page/page-service"
import Breadcrumb from "@/components/user/partials/breadcrumb"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight, Calendar } from "lucide-react"

interface PageLayoutCardsProps {
  page: Page
  menuTitle?: string
  breadcrumbItems?: { label: string; href?: string }[]
  relatedPages?: Page[]
}

// Layout: Cards (card-based display)
export function PageLayoutCards({ page, menuTitle, breadcrumbItems, relatedPages = [] }: PageLayoutCardsProps) {
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
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        {breadcrumbItems && breadcrumbItems.length > 0 && (
          <Breadcrumb items={breadcrumbItems} />
        )}

        <Card className="overflow-hidden mb-8">
          {imageUrl && (
            <div className="relative w-full h-[250px] md:h-[350px]">
              <Image
                src={imageUrl}
                alt={page.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">{page.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </CardContent>
        </Card>

        {/* Related Pages as Cards Grid */}
        {paginatedPages.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Artikel Terkait</h2>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
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

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPages.map((relatedPage) => {
                const relatedImageUrl = relatedPage.image ? getMediaUrl(relatedPage.image) : null
                return (
                  <Link
                    key={relatedPage.id}
                    href={`/${relatedPage.menu?.title?.toLowerCase().replace(/\s+/g, '-') || 'page'}`}
                    className="group"
                  >
                    <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
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
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedPage.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {relatedPage.content?.replace(/<[^>]*>/g, '').substring(0, 120)}...
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
                          <Calendar className="h-3 w-3" />
                          {formatDate(relatedPage.created_at)}
                        </div>
                      </CardContent>
                    </Card>
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
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
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
    </div>
  )
}
