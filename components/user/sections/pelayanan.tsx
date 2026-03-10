import Link from "next/link"
import { Menu } from "@/services/menu/menu-service"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, ArrowRight, Stethoscope } from "lucide-react"

interface PelayananProps {
    data: Menu[]
}

const iconColors = [
    { bg: "bg-blue-50", icon: "text-blue-500", border: "border-blue-100" },
    { bg: "bg-emerald-50", icon: "text-emerald-500", border: "border-emerald-100" },
    { bg: "bg-violet-50", icon: "text-violet-500", border: "border-violet-100" },
    { bg: "bg-amber-50", icon: "text-amber-500", border: "border-amber-100" },
    { bg: "bg-rose-50", icon: "text-rose-500", border: "border-rose-100" },
    { bg: "bg-cyan-50", icon: "text-cyan-500", border: "border-cyan-100" },
]

export default function Pelayanan({ data }: PelayananProps) {
    const isEmpty = !data || data.length === 0

    return (
        <section className="relative z-10 -mt-30" id="pelayanan">
            <div className="container mx-auto px-6 md:px-12 lg:px-16">
                <Card className="border-slate-100 shadow-lg shadow-slate-200/60 py-0 overflow-hidden gap-0">

                    {/* Header */}
                    <div className="px-8 pt-7 pb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                        <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-semibold uppercase tracking-wider">
                                <Stethoscope className="w-3 h-3" />
                                Pelayanan
                            </span>
                            <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                                Layanan Kesehatan Kami
                            </h2>
                        </div>

                        {!isEmpty && (
                            <Link
                                href="/pelayanan"
                                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:text-blue-700 transition-colors shrink-0 group"
                            >
                                Lihat Semua
                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        )}
                    </div>

                    {/* Content */}
                    <CardContent className="px-8 py-6">
                        {isEmpty ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                                    <AlertCircle className="w-5 h-5 text-slate-400" />
                                </div>
                                <p className="text-slate-700 font-semibold text-sm mb-1">Belum ada layanan</p>
                                <p className="text-xs text-slate-400 max-w-xs">
                                    Silakan kembali lagi nanti atau hubungi kami untuk informasi lebih lanjut.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                                {data.map((item, i) => {
                                    const color = iconColors[i % iconColors.length]
                                    return (
                                        <Link
                                            key={item.id}
                                            href={`/${item.slug}`}
                                            className="group flex flex-col items-center gap-2.5 p-3 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 hover:shadow-sm transition-all duration-200 text-center"
                                            aria-label={`Pelayanan ${item.title}`}
                                        >
                                            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${color.bg} ${color.border}`}>
                                                <Stethoscope className={`w-5 h-5 ${color.icon}`} strokeWidth={1.8} />
                                            </div>
                                            <p className="text-[11.5px] font-semibold text-slate-600 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2">
                                                {item.title}
                                            </p>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}