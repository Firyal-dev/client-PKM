import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { layananList } from "@/constants/layanan"

export default function Layanan() {
    return (
        <section className="pt-15">
            <div className="container mx-auto">
                <Header />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {layananList.map((item, index) => (
                        <Card
                            key={index}
                            className="
                                h-full bg-white
                                border border-slate-100
                                rounded-2xl
                                shadow-sm
                                transition-all duration-300
                                hover:shadow-md hover:border-blue-100
                            "
                        >
                            <CardHeader className="pb-2">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mb-3">
                                    <item.icon className="w-5 h-5" />
                                </div>

                                <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                                    {item.label}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <CardDescription className="text-sm text-slate-500 leading-relaxed">
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

// Header
function Header() {
    return (
        <div className="flex flex-col items-center text-center mb-12 space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide">
                Layanan Kami
            </span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">
                Layanan Kesehatan
            </h2>
            <p className="max-w-2xl text-sm md:text-base text-slate-600 leading-relaxed">
                Puskesmas Bogor Tengah memberikan pelayanan kesehatan yang aman,
                profesional, dan mudah diakses masyarakat.
            </p>
        </div>
    )
}