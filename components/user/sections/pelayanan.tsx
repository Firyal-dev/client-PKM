import Link from "next/link"
import { Menu } from "@/services/menu/menu-service"
import { AlertCircle, ArrowRight, Stethoscope } from "lucide-react"

interface PelayananProps {
    data: Menu[]
}

const COLORS = [
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
        <section className="relative z-10 -mt-14" id="pelayanan">
            <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/60 overflow-hidden">

                    {/* Header */}
                    <div className="px-6 md:px-8 pt-6 pb-5 border-b border-slate-100">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <Stethoscope className="w-3.5 h-3.5 text-blue-600" strokeWidth={1.8} />
                                    </div>
                                    <p className="text-[10px] font-bold tracking-[0.18em] text-blue-500 uppercase">
                                        Layanan Kami
                                    </p>
                                </div>
                                <h2 className="text-base font-bold text-slate-900 mb-3">
                                    Pelayanan Kesehatan Terbaik
                                </h2>
                            </div>

                            {!isEmpty && (
                                <Link
                                    href="/pelayanan"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors group shrink-0 mt-1"
                                >
                                    Lihat Semua
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 md:px-8 py-6">
                        {isEmpty ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                                    <AlertCircle className="w-5 h-5 text-slate-400" />
                                </div>
                                <p className="text-slate-600 font-semibold text-sm mb-1">Belum ada layanan</p>
                                <p className="text-xs text-slate-400 max-w-xs">
                                    Silakan kembali lagi nanti untuk informasi layanan.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
                                {data.map((item, i) => {
                                    const color = COLORS[i % COLORS.length]
                                    return (
                                        <Link
                                            key={item.id}
                                            href={`/${item.slug}`}
                                            className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-transparent hover:border-slate-100 hover:shadow-sm transition-all duration-200 text-center"
                                            aria-label={`Pelayanan ${item.title}`}
                                        >
                                            <div className={`
                                                relative w-12 h-12 rounded-2xl border flex items-center justify-center
                                                transition-all duration-200
                                                ${color.bg} ${color.border}
                                                group-hover:bg-slate-800 group-hover:border-transparent group-hover:shadow-md
                                            `}>
                                                <Stethoscope
                                                    className={`w-5 h-5 transition-colors duration-200 ${color.icon} group-hover:text-white`}
                                                    strokeWidth={1.8}
                                                />
                                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity" />
                                            </div>

                                            <p className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors leading-snug line-clamp-2">
                                                {item.title}
                                            </p>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Bottom strip */}
                    <div className="px-6 md:px-8 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        <p className="text-[10px] text-slate-400 font-medium">
                            Seluruh layanan tersedia sesuai jam operasional puskesmas
                        </p>
                    </div>

                </div>
            </div>
        </section>
    )
}