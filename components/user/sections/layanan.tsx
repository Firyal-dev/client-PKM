import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { layananList } from "@/constants/layanan"
import Link from "next/link"

export default function Layanan() {
    return (
        <section className="py-16 bg-white" id="layanan">
            <div className="container mx-auto px-4">
                <Header />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {layananList.map((item, index) => (
                        <Link
                            key={index}
                            href={`/layanan`}
                            className="group"
                        >
                            <Card
                                className="
                                    h-full rounded-xl border border-slate-100
                                    transition-all duration-200
                                    hover:border-blue-200 hover:shadow-md
                                "
                            >
                                <CardContent className="p-5 flex gap-4">
                                    {/* Icon */}
                                    <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                                        <item.icon className="w-5 h-5" />
                                    </div>

                                    {/* Text */}
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-slate-900 leading-tight line-clamp-2">
                                            {item.label}
                                        </h3>
                                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                                            {item.desc}
                                        </p>
                                    </div>
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
function Header() {
    return (
        <div className="flex flex-col items-center text-center mb-12 space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide">
                Layanan Kami
            </span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">
                Pilihan Layanan Kesehatan
            </h2>
            <p className="max-w-2xl text-sm md:text-base text-slate-600 leading-relaxed">
                Kami menyediakan berbagai unit layanan yang dikelola oleh tenaga medis profesional tenaga ahli di bidangnya.
            </p>
        </div>
    )
}