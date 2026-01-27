import { CustomLink } from "@/components/ui/link"
import { PageHeaderProps } from "@/types/page-header-prop"

export function PageHeader({ title, description, linkHref, linkLabel }: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                {description && <p className="text-muted-foreground text-sm">{description}</p>}
            </div>
            {linkHref && linkLabel && (
                <CustomLink href={linkHref}>
                    {linkLabel}
                </CustomLink>
            )}
        </div>
    )
}