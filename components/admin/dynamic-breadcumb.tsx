"use client"

import { usePathname } from "next/navigation"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react"

export function DynamicBreadcrumb() {
    const pathname = usePathname()

    const allSegments = pathname.split("/").filter((item) => item !== "")
    const segments = allSegments.slice(1)

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {segments.map((segment, index) => {
                    const fullPath = `/${allSegments.slice(0, index + 2).join("/")}`

                    const isLast = index === segments.length - 1
                    const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")

                    return (
                        <React.Fragment key={fullPath}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage className="font-semibold text-foreground">
                                        {title}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={fullPath} className="capitalize">
                                        {title}
                                    </BreadcrumbLink>
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