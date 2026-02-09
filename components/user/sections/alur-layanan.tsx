import { Card, CardContent } from "@/components/ui/card"
import { steps } from "@/types/alur-layanan-prop"

export default function AlurLayanan() {
    return (
        <section className="py-14 bg-slate-50" id="alur">
            <div className="container mx-auto px-4">
                <Header />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                    {steps.map((step, index) => (
                        <Card
                            key={index}
                            className="border border-slate-100 rounded-xl shadow-sm bg-white"
                        >
                            <CardContent className="p-4 flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                    </div>
                                    <h3 className="font-semibold text-sm text-slate-900">
                                        {step.title}
                                    </h3>
                                </div>

                                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                                    {step.desc}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

function Header() {
    return (
        <div className="flex flex-col items-center text-center mb-10 space-y-3">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide">
                Alur Pelayanan
            </span>
            <h2 className="text-xl md:text-3xl font-bold text-slate-900">
                Cara Mendapatkan Layanan
            </h2>
            <p className="max-w-xl text-sm text-slate-600">
                Ikuti tahapan berikut untuk mendapatkan pelayanan kesehatan.
            </p>
        </div>
    )
}
