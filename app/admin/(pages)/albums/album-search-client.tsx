'use client'

import { useRouter } from "next/navigation"
import { SearchFilter } from "@/components/admin/SearchFilter"

export function AlbumSearchClient({ searchValue }: { searchValue: string }) {
  const router = useRouter()
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set("search", value)
    else params.delete("search")
    params.set("page", "1")
    router.push(`/admin/albums?${params.toString()}`)
  }

  const handleReset = () => {
    // drop all filters and go back to base
    router.push("/admin/albums")
  }

  return (
    <SearchFilter
      searchValue={searchValue}
      onSearchChange={handleSearch}
      onReset={handleReset}
      hasActiveFilter={!!searchValue}
      searchPlaceholder="Cari album..."
    />
  )
}
