import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight } from "lucide-react";

export default function CtaConsultation() {
    return (
        <section className="py-15">
            <div className="container mx-auto">
                <div className="grid lg:grid-cols-2 gap-8 items-center bg-white rounded-2xl border border-blue-100 shadow-sm p-6 md:p-10">

                    {/* Text Content */}
                    <div className="space-y-4 text-center lg:text-left">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide">
                            Konsultasi & Informasi
                        </span>

                        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                            Butuh Informasi Pelayanan Kesehatan?
                        </h2>

                        <p className="text-slate-600 text-sm md:text-base max-w-xl leading-relaxed">
                            Tim Puskesmas siap membantu memberikan informasi layanan,
                            jadwal pemeriksaan, serta konsultasi kesehatan. Hubungi kami
                            untuk mendapatkan pelayanan yang cepat dan tepat.
                        </p>
                    </div>

                    {/* CTA Button */}
                    <div className="flex justify-center lg:justify-end">
                        <Button
                            asChild
                            size="lg"
                            className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-base"
                        >
                            <a
                                href="https://wa.me/your-whatsapp-number"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Konsultasi
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    </div>

                </div>
            </div>
        </section>
    );
}
