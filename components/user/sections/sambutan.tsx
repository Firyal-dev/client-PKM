import Image from "next/image"
import { Quote } from "lucide-react"
import { getPublicPuskesmasInfo } from "@/services/puskesmas-info-service"
import { getMediaUrl } from "@/lib/getMediaUrl"

export default async function Sambutan() {
    const puskesmasInfo = await getPublicPuskesmasInfo()

    const kepalaNama = puskesmasInfo?.kepala_puskesmas || 'Kepala Puskesmas'
    const kepalaFoto = puskesmasInfo?.kepala_foto ? getMediaUrl(puskesmasInfo.kepala_foto) : null
    const SambutanKonten = puskesmasInfo?.Sambutan_konten || ''

    return (
        <section
            className="py-16 md:py-24 bg-slate-50 border-t border-slate-100"
            id="sambutan"
        >
            <div className="container mx-auto px-6 md:px-12 lg:px-16">
                <div className="max-w-7xl mx-auto bg-white rounded-2xl p-6 md:p-10 border border-slate-100 shadow-sm">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

                        {/* Foto Kepala Puskesmas */}
                        <div className="relative w-full lg:w-[32%] max-w-[260px] shrink-0">
                            <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                                <Image
                                    src={kepalaFoto || "/userPlaceholder.jpg"}
                                    alt={kepalaNama}
                                    fill
                                    className="object-cover"
                                    priority
                                    unoptimized
                                />
                            </div>
                        </div>

                        {/* Teks Sambutan */}
                        <div className="flex-1 space-y-6">
                            <div className="space-y-2">
                                <span className="text-blue-600 text-xs font-semibold uppercase tracking-widest">
                                    Sambutan Kepala Puskesmas
                                </span>

                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug">
                                    Selamat Datang di Website Resmi <br className="hidden md:block" />
                                    Puskesmas
                                </h2>
                            </div>

                            <div
                                className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed prose prose-slate max-w-none"
                                dangerouslySetInnerHTML={{ __html: SambutanKonten }}
                            />

                            <div className="pt-2 text-sm">
                                <p>Hormat kami,</p>
                                <p className="font-bold text-slate-900">
                                    {kepalaNama}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
