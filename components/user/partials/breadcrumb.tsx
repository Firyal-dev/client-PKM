import { TenantLink } from './tenant-link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="flex items-center gap-1 text-sm mb-5" aria-label="Breadcrumb">
            {/* Home */}
            <TenantLink
                href="/"
                className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors duration-150"
            >
                <Home className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">Beranda</span>
            </TenantLink>

            {/* Items */}
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                    <ChevronRight className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
                    {item.href ? (
                        <TenantLink
                            href={item.href}
                            className="text-white/70 hover:text-white transition-colors duration-150 truncate max-w-[160px] sm:max-w-xs"
                        >
                            {item.label}
                        </TenantLink>
                    ) : (
                        <span className="text-white font-semibold truncate max-w-[160px] sm:max-w-xs">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    )
}
