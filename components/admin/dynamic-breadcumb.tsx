"use client"

import { usePathname } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import React from "react"

export function DynamicBreadcrumb() {
    const pathname = usePathname()
    const segments = pathname.split("/").filter(Boolean).slice(1)

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {segments.map((segment, index) => {
                    const fullPath = "/" + pathname.split("/").slice(1, index + 3).join("/")
                    const isLast = index === segments.length - 1
                    const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")

                    return (
                        <React.Fragment key={fullPath}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage className="font-semibold">{title}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={fullPath} className="capitalize">{title}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
