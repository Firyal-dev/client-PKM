import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { layananList } from "@/constants/layanan"

export default function Layanan() {
    return (
        <section className="py-24">
            <div className="container mx-auto">
                <div className="flex flex-col items-center text-center mb-20 space-y-4">
                    <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide">
                        Layanan Kami
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                        Layanan Kesehatan
                    </h2>
                    <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                        Puskesmas Bogor Tengah memberikan pelayanan kesehatan yang aman,
                        profesional, dan mudah diakses masyarakat.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {layananList.map((item, index) => (
                        <Card
                            key={index}
                            className="
                                h-full bg-white
                                border border-slate-200
                                rounded-t-2xl rounded-b-3xl
                                shadow-sm
                                transition
                                hover:shadow-lg
                            "
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                        <item.icon className="w-6 h-6" />
                                    </div>

                                    <CardTitle className="text-lg font-semibold text-slate-900 leading-snug">
                                        {item.label}
                                    </CardTitle>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <CardDescription className="text-base text-slate-600 leading-relaxed">
                                    {item.desc}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
