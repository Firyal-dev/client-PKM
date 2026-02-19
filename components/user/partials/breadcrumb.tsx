import Link from 'next/link'
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
        <nav className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mb-6">
            {/* Home Link */}
            <Link
                href="/"
                className="flex items-center gap-1 hover:text-primary dark:hover:text-primary-foreground transition-colors"
            >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Beranda</span>
            </Link>

            {/* Breadcrumb Items */}
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="hover:text-primary dark:hover:text-primary-foreground transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-slate-700 dark:text-slate-200 font-medium">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    )
}
