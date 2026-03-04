import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Page } from "@/services/page/page-service"
import { Stethoscope } from "lucide-react"
import DOMPurify from "isomorphic-dompurify"

interface PelayananProps {
    data: Page[]
}

export default function Pelayanan({ data }: PelayananProps) {
    if (!data || data.length === 0) return null

    return (
        <section className="py-12 md:py-16 bg-slate-50" id="pelayanan">
            <div className="container mx-auto px-6 md:px-12 lg:px-16">
                <div className="mb-8">
                    <div className="flex flex-col items-center text-center mb-8 space-y-2 max-w-3xl mx-auto">
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide">
                            Pelayanan
                        </span>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                            Pelayanan Kesehatan
                        </h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Berbagai layanan kesehatan yang tersedia dan dikelola oleh tenaga medis profesional di Puskesmas kami.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
                        {data.map((item) => (
                            <Link
                                key={item.id}
                                href={`/${item.slug || 'pelayanan'}`}
                                className="group"
                                aria-label={`Pelayanan ${item.title}`}
                            >
                                <Card className="h-full rounded-xl border border-slate-100 transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden">
                                    <div className="h-36 relative bg-blue-50 flex items-center justify-center overflow-hidden">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <Stethoscope className="w-10 h-10 text-blue-200" />
                                        )}
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="space-y-1.5">
                                            <h3 className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                                                {item.title}
                                            </h3>
                                            <div className="text-xs text-slate-500 leading-relaxed line-clamp-2"
                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content?.substring(0, 100) + '...') }}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-6 text-center">
                        <Link
                            href="/pelayanan"
                            className="inline-flex items-center px-5 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
                        >
                            Lihat Semua Pelayanan
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
