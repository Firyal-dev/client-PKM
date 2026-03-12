import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
    label: string
    href?: string
}

interface PageHeaderProps {
    /** Breadcrumb navigation items */
    items: BreadcrumbItem[]
    /** Main title of the page */
    title: string
    /** Optional short subtitle/description */
    description?: string
    /** Optional badge (icon + label) */
    badge?: {
        icon: React.ElementType
        text: string
    }
    /** Optional extra content on the right (e.g. stat chips) */
    children?: React.ReactNode
    /** Override the wrapper className */
    className?: string
    /** Override the inner container className */
    containerClassName?: string
}

/**
 * Reusable page header used across all user-facing inner pages.
 * - Fixed navbar is ~116px tall (44px top-bar + 72px main-nav)
 *   → We use pt-[120px] so content always clears the navbar.
 * - Background uses the custom breadcrumb_bg.jpeg with a dark overlay.
 */
export default function PageHeader({
    items,
    title,
    description,
    badge: Badge,
    children,
    className,
    containerClassName,
}: PageHeaderProps) {
    return (
        <section className={cn("relative overflow-hidden text-white", className)}>
            {/* ── Background image ── */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/breadcrumb_bg.jpeg"
                    alt=""
                    fill
                    priority
                    className="object-cover object-center"
                />
                {/* Dark gradient overlay – strong at top (covers navbar area), lighter below */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/40" />
                {/* Subtle blue tint */}
                <div className="absolute inset-0 bg-blue-800/30 mix-blend-multiply" />
            </div>

            {/* ── Content ── */}
            <div className={cn(
                "relative z-10 max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16",
                // pt-[116px] clears the fixed navbar (44 topbar + 72 main)
                "pt-[124px] pb-10",
                containerClassName,
            )}>

                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-xs mb-5" aria-label="Breadcrumb">
                    <Link
                        href="/"
                        className="flex items-center gap-1 text-white/60 hover:text-white transition-colors"
                    >
                        <Home className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="hidden sm:inline">Beranda</span>
                    </Link>
                    {items.map((item, i) => (
                        <span key={i} className="flex items-center gap-1.5">
                            <ChevronRight className="w-3 h-3 text-white/30 flex-shrink-0" />
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    className="text-white/60 hover:text-white transition-colors truncate max-w-[160px]"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-white/90 font-medium truncate max-w-[200px]">
                                    {item.label}
                                </span>
                            )}
                        </span>
                    ))}
                </nav>

                {/* Title row */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                        {Badge && (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-blue-100 backdrop-blur-sm">
                                <Badge.icon className="w-3 h-3" />
                                {Badge.text}
                            </span>
                        )}
                        <h1 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight text-white drop-shadow-sm">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-sm text-white/70 leading-relaxed max-w-xl">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Slot for stat chips, back button, etc. */}
                    {children && (
                        <div className="shrink-0">
                            {children}
                        </div>
                    )}
                </div>

                {/* Thin separator line at the bottom */}
                <div className="mt-8 border-t border-white/10" />
            </div>
        </section>
    )
}
