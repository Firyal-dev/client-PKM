'use client'

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useRouter, useSearchParams } from "next/navigation"

export function PaginationControl({
    totalPages,
    currentPage
}: {
    totalPages: number,
    currentPage: number
}) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", pageNumber.toString())
        return `?${params.toString()}`
    }

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>

                {pages.map((page) => {
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                        return (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    href={createPageURL(page)}
                                    isActive={page === currentPage}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    }
                    if (page === currentPage - 2 || page === currentPage + 2) {
                        return <PaginationEllipsis key={page} />
                    }
                    return null
                })}

                <PaginationItem>
                    <PaginationNext
                        href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}