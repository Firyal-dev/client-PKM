import Link from "next/link"
import Image from "next/image"
import { Page } from "@/services/page/page-service"
import { Newspaper, CalendarDays, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface BeritaProps {
    data: Page[]
}

export default function Berita({ data }: BeritaProps) {
    if (!data || data.length === 0) return null

    return (
        <section className="py-16 md:py-24 bg-white" id="berita">
            <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="block w-6 h-px bg-blue-400" />
                            <span className="text-[10px] font-bold tracking-[0.18em] text-blue-500 uppercase">Berita</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Berita & Informasi Terkini</h2>
                        <p className="text-sm text-slate-500 max-w-md">Ikuti berita dan informasi terbaru seputar kegiatan dan layanan puskesmas.</p>
                    </div>
                    <Link
                        href={`/${(data[0]?.menu as any)?.slug || 'berita'}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group shrink-0"
                    >
                        Lihat Semua
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {data.map((item) => (
                        <BeritaCard key={item.id} item={item} />
                    ))}
                </div>

            </div>
        </section>
    )
}

function BeritaCard({ item }: { item: Page }) {
    const menuSlug = (item.menu as any)?.slug || 'berita'
    const href = `/${menuSlug}/${item.id}`
    const rawText = item.dynamic_content?.replace(/<[^>]*>/g, '') || ''
    const excerpt = rawText.length > 120 ? rawText.substring(0, 120) + '...' : rawText
    const dateStr = item.createdAt
        ? format(new Date(item.createdAt), "d MMMM yyyy", { locale: id })
        : null

    return (
        <Link href={href} className="group block">
            <div className="rounded-2xl border border-slate-100 overflow-hidden bg-white hover:border-blue-200 hover:shadow-md transition-all duration-200">

                {/* Image */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                    {item.image ? (
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Newspaper className="w-10 h-10 text-slate-300" />
                        </div>
                    )}
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col gap-2">
                    {dateStr && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <CalendarDays className="w-3 h-3" />
                            <span>{dateStr}</span>
                        </div>
                    )}
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {item.title}
                    </h3>
                    {excerpt && (
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                            {excerpt}
                        </p>
                    )}
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-blue-500 group-hover:gap-2 transition-all">
                        Baca Selengkapnya
                        <ArrowRight className="w-3 h-3" />
                    </div>
                </div>
            </div>
        </Link>
    )
}