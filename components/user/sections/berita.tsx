
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, ArrowRight } from "lucide-react"

const news = [
    {
        title: "Pentingnya Pola Hidup Sehat di Musim Pancaroba",
        date: "10 Februari 2026",
        category: "Tips Sehat",
        image: "/authBg.jpg",
        description: "Menjaga daya tahan tubuh tetap prima saat pergantian musim sangatlah penting agar terhindar dari penyakit."
    },
    {
        title: "Sosialisasi Pencegahan Stunting di Kelurahan",
        date: "08 Februari 2026",
        category: "Kegiatan",
        image: "/authBg.jpg",
        description: "Puskesmas Bogor Tengah mengadakan sosialisasi gizi seimbang untuk ibu hamil dan balita."
    },
    {
        title: "Jadwal Baru Pelayanan Poli Gigi",
        date: "05 Februari 2026",
        category: "Pengumuman",
        image: "/authBg.jpg",
        description: "Mulai bulan ini, pelayanan Poli Gigi akan dibuka lebih awal untuk meningkatkan kenyamanan pasien."
    }
]

export default function Berita() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="space-y-4 max-w-2xl">
                        <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide">
                            Informasi Terkini
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                            Berita & Artikel Kesehatan
                        </h2>
                        <p className="text-slate-600 text-lg">
                            Dapatkan informasi terbaru seputar kesehatan dan kegiatan di Puskesmas kami.
                        </p>
                    </div>
                    <Button variant="ghost" className="hidden md:flex gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        Lihat Semua Berita <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item, index) => (
                        <Card key={index} className="group border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="relative h-48 w-full overflow-hidden">
                                {/* Placeholder Image */}
                                <div className="absolute inset-0 bg-slate-200 group-hover:scale-105 transition-transform duration-500">
                                    {/* Replace with actual Image logic if needed, using generic bg for now */}
                                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-slate-200" />
                                </div>
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-blue-600 shadow-sm">
                                    {item.category}
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                                    <CalendarDays className="w-4 h-4" />
                                    <span>{item.date}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed line-clamp-3 mb-6">
                                    {item.description}
                                </p>
                                <Button className="w-full rounded-xl bg-slate-900 text-white hover:bg-blue-600 transition-colors">
                                    Baca Selengkapnya
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-8 md:hidden text-center">
                    <Button variant="outline" className="gap-2">
                        Lihat Semua Berita <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </section>
    )
}
