'use client'

import { useEffect, useState } from 'react'
import { getDashboardStats, DashboardStats } from '@/services/admin/dashboard-service'
import {
    MessageSquare, Star, Calendar, Image,
    TrendingUp, FolderOpen, Users, Eye,
    ArrowUpRight, Film, Menu, FileText, Book
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Skeleton ──────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
    return <div className={cn("animate-pulse bg-muted rounded-lg", className)} />
}

function LoadingState() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-8 w-8 rounded-xl" />
                        </div>
                        <Skeleton className="h-7 w-16" />
                        <Skeleton className="h-3 w-28" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="rounded-2xl border border-border/60 bg-card p-5 space-y-4">
                        <Skeleton className="h-4 w-32" />
                        {[...Array(4)].map((_, j) => (
                            <div key={j} className="flex justify-between">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

// ── Stat Card ─────────────────────────────────────────────────────────
interface StatCardProps {
    title: string
    value: string | number
    description: string
    icon: React.ReactNode
    accent: string
    accentBg: string
}

function StatCard({ title, value, description, icon, accent, accentBg }: StatCardProps) {
    return (
        <div className="group rounded-2xl border border-border/60 bg-card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", accentBg)}>
                    <div className={accent}>{icon}</div>
                </div>
            </div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
    )
}

// ── Table Row ─────────────────────────────────────────────────────────
function DataRow({ label, value, highlight = false }: { label: string; value: number | string; highlight?: boolean }) {
    return (
        <div className={cn(
            "flex items-center justify-between py-2.5",
            highlight
                ? "px-3 rounded-xl bg-muted/50 border border-border/40"
                : "border-b border-border/40 last:border-0"
        )}>
            <span className={cn(
                "text-sm",
                highlight ? "font-semibold text-foreground" : "text-muted-foreground"
            )}>
                {label}
            </span>
            <span className={cn(
                "tabular-nums",
                highlight ? "text-lg font-bold text-foreground" : "text-sm font-semibold text-foreground"
            )}>
                {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
            </span>
        </div>
    )
}

// ── Section Card ──────────────────────────────────────────────────────
function SectionCard({ title, description, icon, children }: {
    title: string
    description: string
    icon: React.ReactNode
    children: React.ReactNode
}) {
    return (
        <div className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="flex items-center gap-2.5 mb-4 pb-4 border-b border-border/40">
                <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
            </div>
            <div className="space-y-0.5">{children}</div>
        </div>
    )
}

// ── DASHBOARD ─────────────────────────────────────────────────────────
export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getDashboardStats()
            .then(setStats)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <LoadingState />

    const statCards: StatCardProps[] = stats ? [
        {
            title: 'Konsultasi',
            value: stats.consultations,
            description: 'Total konsultasi masuk',
            icon: <MessageSquare className="w-4 h-4" />,
            accent: 'text-green-600 dark:text-green-400',
            accentBg: 'bg-green-100 dark:bg-green-900/30',
        },
        {
            title: 'Ulasan',
            value: stats.reviews,
            description: 'Total saran & kritik',
            icon: <Star className="w-4 h-4" />,
            accent: 'text-amber-600 dark:text-amber-400',
            accentBg: 'bg-amber-100 dark:bg-amber-900/30',
        },
        {
            title: 'Agenda',
            value: stats.agendas,
            description: 'Jadwal kegiatan',
            icon: <Calendar className="w-4 h-4" />,
            accent: 'text-violet-600 dark:text-violet-400',
            accentBg: 'bg-violet-100 dark:bg-violet-900/30',
        },
        {
            title: 'Galeri',
            value: `${stats.galleries} foto`,
            description: 'Total foto tersimpan',
            icon: <Image className="w-4 h-4" />,
            accent: 'text-pink-600 dark:text-pink-400',
            accentBg: 'bg-pink-100 dark:bg-pink-900/30',
        },
    ] : []

    return (
        <div className="space-y-5">
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <StatCard key={i} {...card} />
                ))}
            </div>

            {/* Detail sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SectionCard
                    title="Statistik Pengunjung"
                    description="Ringkasan kunjungan website"
                    icon={<TrendingUp className="w-4 h-4" />}
                >
                    <DataRow label="Hari ini" value={stats?.visitors.today ?? 0} />
                    <DataRow label="Bulan ini" value={stats?.visitors.thisMonth ?? 0} />
                    <DataRow label="Tahun ini" value={stats?.visitors.thisYear ?? 0} />
                    <div className="pt-2">
                        <DataRow label="Total keseluruhan" value={stats?.visitors.total ?? 0} highlight />
                    </div>
                </SectionCard>

                <SectionCard
                    title="Media"
                    description="Ringkasan media tersedia"
                    icon={<Film className="w-4 h-4" />}
                >
                    <DataRow label="Foto" value={stats?.galleries ?? 0} />
                    <DataRow label="Album" value={stats?.albums ?? 0} />
                    <DataRow label="Video" value={stats?.videos ?? 0} />
                    <div className="pt-2">
                        <DataRow label="Total media" value={(stats?.galleries ?? 0) + (stats?.albums ?? 0) + (stats?.videos ?? 0)} highlight />
                    </div>
                </SectionCard>

                <SectionCard
                    title="Menu & Konten"
                    description="Ringkasan struktur web"
                    icon={<Menu className="w-4 h-4" />}
                >
                    <DataRow label="Menu" value={stats?.menus ?? 0} />
                    <DataRow label="Konten dinamis" value={stats?.dynamicPages ?? 0} />
                    <DataRow label="Konten statis" value={stats?.staticPages ?? 0} />
                    <div className="pt-2">
                        <DataRow label="Total konten" value={(stats?.menus ?? 0) + (stats?.dynamicPages ?? 0) + (stats?.staticPages ?? 0)} highlight />
                    </div>
                </SectionCard>
            </div>
        </div>
    )
}