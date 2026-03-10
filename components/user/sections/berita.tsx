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
            <div className="container mx-auto px-6 md:px-12 lg:px-16">

                <div className="flex flex-col items-center text-center mb-12 space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="block w-6 h-px bg-blue-400" />
                        <span className="text-[11px] font-bold tracking-[0.14em] text-blue-500 uppercase">Berita</span>
                        <span className="block w-6 h-px bg-blue-400" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                        Berita & Informasi Terkini
                    </h2>
                    <p className="max-w-md text-sm text-slate-500 leading-relaxed">
                        Ikuti berita dan informasi terbaru seputar kegiatan dan layanan puskesmas kami.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {data.map((item) => (
                        <BeritaCard key={item.id} item={item} />
                    ))}
                </div>

                <div className="mt-10 flex justify-center">
                    <Link
                        href={`/${(data[0]?.menu as any)?.slug || 'berita'}`}
                        className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold border border-slate-200 text-slate-500 rounded-xl hover:border-blue-400 hover:text-blue-600 bg-white transition-colors"
                    >
                        Lihat Semua Berita
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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