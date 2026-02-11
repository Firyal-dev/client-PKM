import { CustomLink } from "@/components/ui/link"
import React from "react"

interface PageHeaderProps {
    title: string
    description?: string
    linkHref?: string
    linkLabel?: string
}

interface ExtendedPageHeaderProps extends PageHeaderProps {
    children?: React.ReactNode
}

export function PageHeader({ 
    title, 
    description, 
    linkHref, 
    linkLabel, 
    children 
}: ExtendedPageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                {description && <p className="text-muted-foreground text-sm">{description}</p>}
            </div>
            <div className="flex items-center gap-2">
                {children}
                {linkHref && linkLabel && (
                    <CustomLink href={linkHref}>
                        {linkLabel}
                    </CustomLink>
                )}
            </div>
        </div>
    )
}