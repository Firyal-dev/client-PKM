import Link from "next/link"
import { Menu } from "@/services/menu/menu-service"
import { AlertCircle, ArrowRight, Stethoscope } from "lucide-react"

interface PelayananProps {
    data: Menu[]
}

// Distinct color per card slot
const COLORS = [
    { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-100", hover: "group-hover:bg-blue-600" },
    { bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-100", hover: "group-hover:bg-emerald-600" },
    { bg: "bg-violet-50", icon: "text-violet-600", border: "border-violet-100", hover: "group-hover:bg-violet-600" },
    { bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-100", hover: "group-hover:bg-amber-600" },
    { bg: "bg-rose-50", icon: "text-rose-600", border: "border-rose-100", hover: "group-hover:bg-rose-600" },
    { bg: "bg-cyan-50", icon: "text-cyan-600", border: "border-cyan-100", hover: "group-hover:bg-cyan-600" },
]

export default function Pelayanan({ data }: PelayananProps) {
    const isEmpty = !data || data.length === 0

    return (
        <section className="relative z-10 -mt-14" id="pelayanan">
            <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/60 overflow-hidden">

                    {/* Header */}
                    <div className="px-6 md:px-8 pt-6 pb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                                <Stethoscope className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-[0.18em] text-blue-500 uppercase">Layanan Kami</p>
                                <h2 className="text-base font-bold text-slate-900 leading-tight">Pelayanan Kesehatan</h2>
                            </div>
                        </div>

                        {!isEmpty && (
                            <Link
                                href="/pelayanan"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
                            >
                                Lihat Semua
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        )}
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
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                                {data.map((item, i) => {
                                    const color = COLORS[i % COLORS.length]
                                    return (
                                        <Link
                                            key={item.id}
                                            href={`/${item.slug}`}
                                            className="group flex flex-col items-center gap-2.5 p-3 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all duration-200 text-center"
                                            aria-label={`Pelayanan ${item.title}`}
                                        >
                                            <div className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-colors duration-200 ${color.bg} ${color.border} ${color.hover} group-hover:text-white group-hover:border-transparent`}>
                                                <Stethoscope className={`w-5 h-5 transition-colors duration-200 ${color.icon} group-hover:text-white`} strokeWidth={1.8} />
                                            </div>
                                            <p className="text-[11px] font-semibold text-slate-600 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2">
                                                {item.title}
                                            </p>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}