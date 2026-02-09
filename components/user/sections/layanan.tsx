import { Card, CardContent } from "@/components/ui/card"
import { layananList } from "@/constants/layanan"
import { steps } from "@/types/alur-layanan-prop"
import Link from "next/link"

export default function Layanan() {
    return (
        <section className="py-20 bg-white" id="layanan">
            <div className="container mx-auto px-4">

                {/* ================= LAYANAN ================= */}
                <div className="mb-24">
                    <Header
                        badge="Layanan"
                        title="Layanan Kesehatan"
                        desc="Berbagai layanan kesehatan yang tersedia dan dikelola oleh tenaga medis profesional."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {layananList.map((item, index) => (
                            <Link
                                key={index}
                                href={`/layanan`}
                                className="group"
                                aria-label={`Layanan ${item.label}`}
                            >
                                <Card className="h-full rounded-xl border border-slate-100 transition-shadow hover:shadow-md">
                                    <CardContent className="flex gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                            <item.icon className="w-6 h-6" />
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-lg text-slate-900">
                                                {item.label}
                                            </h3>
                                            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <Link
                            href="/layanan"
                            className="inline-flex items-center px-6 py-3 text-sm font-semibold rounded-xl border border-slate-200 hover:border-blue-500 hover:text-blue-600 transition"
                        >
                            Lihat Semua Layanan
                        </Link>
                    </div>
                </div>

                {/* ================= ALUR ================= */}
                <div>
                    <div className="relative max-w-5xl mx-auto mt-16">

                        {/* GARIS DESKTOP */}
                        <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-slate-200 z-0" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="relative flex flex-col items-center text-center"
                                >

                                    {/* GARIS MOBILE */}
                                    {index !== steps.length - 1 && (
                                        <div className="md:hidden absolute top-16 left-1/2 -translate-x-1/2 h-12 w-px bg-slate-200" />
                                    )}

                                    {/* BULAT STEP */}
                                    <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4 shadow-sm">
                                        {index + 1}
                                    </div>

                                    <h3 className="text-base font-semibold text-slate-900 mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 leading-relaxed max-w-[220px]">
                                        {step.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


            </div>
        </section>
    )
}

function Header({
    badge,
    title,
    desc,
}: {
    badge: string
    title: string
    desc: string
}) {
    return (
        <div className="flex flex-col items-center text-center mb-12 space-y-4 max-w-3xl mx-auto">
            <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide">
                {badge}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                {title}
            </h2>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                {desc}
            </p>
        </div>
    )
}
