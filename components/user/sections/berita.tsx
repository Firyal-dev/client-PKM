import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"
import Image from "next/image"
import type { Berita } from "@/types/berita-prop"
import { getMediaUrl } from "@/lib/getMediaUrl"
import { ImageOff } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-user"

export default function Berita({ data }: { data: Berita[] }) {
    const hasData = Array.isArray(data) && data.length > 0

    return (
        <section className="py-16 md:py-24 bg-white" id="berita">
            <div className="container mx-auto px-6 md:px-12 lg:px-16">
                <HeaderSection />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {hasData ? (
                        data.map((item, index) => {
                            const imageUrl = item.image ? getMediaUrl(item.image) : null

                            return (
                                <Link
                                    key={index}
                                    href={`/berita/${item.id}`}
                                    className="group block"
                                >
                                    <Card className="h-full rounded-xl overflow-hidden border border-slate-100 p-0 hover:shadow-sm transition flex flex-col">

                                        {/* IMAGE */}
                                        <div className="relative h-48 w-full">
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={item.title}
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400">
                                                    <ImageOff className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>

                                        {/* CONTENT */}
                                        <CardContent className="p-6 flex flex-col flex-grow">
                                            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 mb-2">
                                                <CalendarDays className="w-3.5 h-3.5" />
                                                <span>{item.publish_at}</span>
                                            </div>

                                            <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                                                {item.title}
                                            </h3>

                                            <div
                                                className="text-sm text-slate-500 line-clamp-3 leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: item.content }}
                                            />
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })
                    ) : (
                        <div className="col-span-full">
                            <EmptyState
                                title="Belum ada berita"
                                description="Saat ini belum tersedia berita terbaru."
                                icon={ImageOff}
                                className="max-w-xl mx-auto"
                            />
                        </div>
                    )}
                </div>

                {hasData && (
                    <div className="mt-10 flex justify-center">
                        <Link
                            href="/berita"
                            className="inline-flex items-center justify-center py-3 px-8 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                        >
                            Lihat Semua Berita
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}

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
