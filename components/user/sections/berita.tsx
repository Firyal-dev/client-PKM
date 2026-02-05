import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"

const news = [
    {
        slug: "pola-hidup-sehat-musim-pancaroba",
        title: "Pentingnya Pola Hidup Sehat di Musim Pancaroba",
        date: "10 Februari 2026",
        description: "Menjaga daya tahan tubuh tetap prima saat pergantian musim sangatlah penting agar terhindar dari penyakit."
    },
    {
        slug: "sosialisasi-pencegahan-stunting",
        title: "Sosialisasi Pencegahan Stunting di Kelurahan",
        date: "08 Februari 2026",
        description: "Puskesmas Bogor Tengah mengadakan sosialisasi gizi seimbang untuk ibu hamil dan balita."
    },
    {
        slug: "jadwal-baru-poli-gigi",
        title: "Jadwal Baru Pelayanan Poli Gigi",
        date: "05 Februari 2026",
        description: "Mulai bulan ini, pelayanan Poli Gigi akan dibuka lebih awal untuk meningkatkan kenyamanan pasien."
    }
]

export default function Berita() {
    return (
        <section className="py-15">
            <div className="container mx-auto">

                {/* Header */}
                <HeaderSection />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item, index) => (
                        <Link
                            key={index}
                            href={`/berita/${item.slug}`}
                            className="group block"
                        >
                            {/* Content */}
                            <Card className="h-full border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
                                <div className="relative h-40 w-full overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-slate-200 group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <CardContent className="p-5 flex flex-col h-[170px]">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                                        <CalendarDays className="w-4 h-4" />
                                        <span>{item.date}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 line-clamp-2">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

// Header 
function HeaderSection() {
    return (
        <div className="flex flex-col items-center text-center mb-12 space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide">
                Informasi Terkini
            </span>

            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">
                Berita & Artikel Kesehatan
            </h2>

            <p className="max-w-2xl text-sm md:text-base text-slate-600 leading-relaxed">
                Dapatkan informasi terbaru seputar kesehatan dan kegiatan di Puskesmas kami.
            </p>
        </div>
    )
}