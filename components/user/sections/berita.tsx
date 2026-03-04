import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
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
        <section className="py-12 md:py-16 bg-white" id="berita">
            <div className="container mx-auto px-6 md:px-12 lg:px-16">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-10 space-y-2 max-w-3xl mx-auto">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-semibold uppercase tracking-wide">
                        Berita
                    </span>
                    <h2 className="text-xl md:text-3xl font-bold tracking-tight text-slate-900">
                        Berita & Informasi Terkini
                    </h2>
                    <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                        Ikuti berita dan informasi terbaru seputar kegiatan dan layanan puskesmas kami.
                    </p>
                </div>

                {/* Card Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {data.map((item) => (
                        <BeritaCard key={item.id} item={item} />
                    ))}
                </div>

                {/* Footer Link */}
                <div className="mt-10 text-center">
                    <Link
                        href={`/${(data[0]?.menu as any)?.slug || 'berita'}`}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition"
                    >
                        Lihat Semua Berita
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    )
}


function BeritaCard({ item }: { item: Page }) {
    const menuSlug = (item.menu as any)?.slug || 'berita'
    const href = `/${menuSlug}/${item.id}`

    // Strip HTML untuk excerpt
    const rawText = item.dynamic_content?.replace(/<[^>]*>/g, '') || ''
    const excerpt = rawText.length > 120 ? rawText.substring(0, 120) + '...' : rawText

    const dateStr = item.createdAt
        ? format(new Date(item.createdAt), "d MMMM yyyy", { locale: id })
        : null

    return (
        <Link href={href} className="group block h-full">
            <Card className="h-full rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                {/* Gambar */}
                <div className="relative h-44 bg-emerald-50 overflow-hidden flex items-center justify-center">
                    {item.image ? (
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <Newspaper className="w-12 h-12 text-emerald-200" />
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Konten */}
                <CardContent className="p-4 flex flex-col gap-2">
                    {/* Tanggal */}
                    {dateStr && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                            <span>{dateStr}</span>
                        </div>
                    )}

                    {/* Judul */}
                    <h3 className="font-semibold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                    </h3>

                    {/* Excerpt */}
                    {excerpt && (
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                            {excerpt}
                        </p>
                    )}

                    {/* Read More */}
                    <div className="mt-auto pt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600 group-hover:gap-2 transition-all">
                        Baca Selengkapnya
                        <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
