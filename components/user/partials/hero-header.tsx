import Image from "next/image"
import { TenantLink } from "@/components/user/partials/tenant-link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
    label: string
    href?: string
}

interface PageHeaderProps {
    items: BreadcrumbItem[]
    title: string
    description?: string
    badge?: {
        icon: React.ElementType
        text: string
    }
    children?: React.ReactNode
    className?: string
    containerClassName?: string
}

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
            <div className="absolute inset-0 z-0">
                <Image
                    src="/breadcrumb_bg.jpeg"
                    alt=""
                    fill
                    priority
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/40" />
                <div className="absolute inset-0 bg-blue-800/30 mix-blend-multiply" />
            </div>

            <div className={cn(
                "relative z-10 max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16",
                "pt-[124px] pb-10",
                containerClassName,
            )}>

                <nav className="flex items-center gap-1.5 text-xs mb-5" aria-label="Breadcrumb">
                    <TenantLink
                        href="/"
                        className="flex items-center gap-1 text-white/60 hover:text-white transition-colors"
                    >
                        <Home className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="hidden sm:inline">Beranda</span>
                    </TenantLink>
                    {items.map((item, i) => (
                        <span key={i} className="flex items-center gap-1.5">
                            <ChevronRight className="w-3 h-3 text-white/30 flex-shrink-0" />
                            {item.href ? (
                                <TenantLink
                                    href={item.href}
                                    className="text-white/60 hover:text-white transition-colors truncate max-w-[160px]"
                                >
                                    {item.label}
                                </TenantLink>
                            ) : (
                                <span className="text-white/90 font-medium truncate max-w-[200px]">
                                    {item.label}
                                </span>
                            )}
                        </span>
                    ))}
                </nav>

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

                    {children && (
                        <div className="shrink-0">
                            {children}
                        </div>
                    )}
                </div>

                <div className="mt-8 border-t border-white/10" />
            </div>
        </section>
    )
}
