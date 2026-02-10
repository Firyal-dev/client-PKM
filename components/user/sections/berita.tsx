import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, ArrowRight } from "lucide-react"

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
        <section className="py-16 md:py-24 bg-white" id="berita">
            <div className="container mx-auto px-6 md:px-12 lg:px-16">

                <HeaderSection />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {news.map((item, index) => (
                        <Link
                            key={index}
                            href={`/berita/${item.slug}`}
                            className="group block"
                        >
                            <Card className="h-full border-slate-100 rounded-xl overflow-hidden hover:shadow-sm transition flex flex-col">
                                {/* Placeholder gambar */}
                                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200" />
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                        <span className="text-[10px] font-semibold uppercase tracking-widest">
                                            Gambar Berita
                                        </span>
                                    </div>
                                </div>

                                <CardContent className="flex flex-col flex-grow">
                                    {/* Tanggal */}
                                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 mb-2">
                                        <CalendarDays className="w-3.5 h-3.5" />
                                        <span>{item.date}</span>
                                    </div>

                                    {/* Judul */}
                                    <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </h3>

                                    {/* Deskripsi */}
                                    <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-10 flex justify-center">
                    <Link
                        href="/berita"
                        className="inline-flex items-center justify-center py-3 px-8 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                    >
                        Lihat Semua Berita
                    </Link>
                </div>
            </div>
        </section>
    )
}

// Header Section
function HeaderSection() {
    return (
        <div className="flex flex-col items-center text-center mb-12 space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide">
                Informasi Terkini
            </span>

            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">
                Berita & Informasi Kesehatan
            </h2>

            <p className="max-w-2xl text-sm md:text-base text-slate-600 leading-relaxed">
                Update terbaru mengenai kegiatan puskesmas dan informasi kesehatan untuk masyarakat.
            </p>
        </div>
    )
}
