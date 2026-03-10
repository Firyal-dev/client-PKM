import Image from "next/image"
import { Quote } from "lucide-react"
import { getPublicPuskesmasInfo } from "@/services/puskesmas-info-service"
import { getMediaUrl } from "@/lib/getMediaUrl"
import DOMPurify from "isomorphic-dompurify"

export default async function Sambutan() {
    const puskesmasInfo = await getPublicPuskesmasInfo()

    const kepalaNama = puskesmasInfo?.kepala_puskesmas || 'Kepala Puskesmas'
    const kepalaFoto = puskesmasInfo?.kepala_foto ? getMediaUrl(puskesmasInfo.kepala_foto) : null
    const SambutanKonten = puskesmasInfo?.Sambutan_konten || ''
    const sanitizedContent = DOMPurify.sanitize(SambutanKonten)

    return (
        <section
            className="relative py-12 md:py-20 overflow-hidden bg-white"
            id="sambutan"
        >
            <div className="relative container mx-auto px-6 md:px-12 lg:px-20">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 lg:gap-24 items-start">

                        {/* Left — Foto + identity card */}
                        <div className="flex flex-col items-center lg:items-start lg:sticky lg:top-28">

                            {/* Photo */}
                            <div className="relative w-[200px] lg:w-full max-w-[260px]">
                                <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl bg-blue-100" />
                                <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-3xl bg-blue-50" />
                                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-xl ring-1 ring-slate-200">
                                    <Image
                                        src={kepalaFoto || "/userPlaceholder.jpg"}
                                        alt={kepalaNama}
                                        fill
                                        className="object-cover"
                                        priority
                                        unoptimized
                                    />
                                    <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />
                                </div>
                            </div>

                            {/* Name card */}
                            <div className="relative w-[200px] lg:w-full max-w-[260px] mt-6 px-6 py-5 bg-blue-700 rounded-2xl shadow-lg">
                                <p className="text-[10px] font-bold tracking-[0.15em] text-blue-300 uppercase mb-1.5">
                                    Kepala Puskesmas
                                </p>
                                <p className="text-white font-bold text-[15px] leading-snug">
                                    {kepalaNama}
                                </p>
                            </div>

                        </div>

                        {/* Right — Sambutan content */}
                        <div className="flex flex-col pt-1 lg:pt-2">

                            <Quote
                                className="text-blue-100 w-14 h-14 mb-1 -ml-1 fill-blue-100 stroke-blue-200"
                                strokeWidth={0.75}
                            />

                            <div
                                className="prose prose-slate prose-[15px] max-w-none leading-[1.9]
                                    prose-headings:font-bold prose-headings:text-slate-800 prose-headings:tracking-tight
                                    prose-p:text-slate-600 prose-p:my-4
                                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                                    prose-img:rounded-2xl prose-img:shadow-md
                                    prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50
                                    prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:not-italic
                                    prose-table:text-sm prose-th:bg-blue-50 prose-th:text-blue-800
                                    prose-strong:text-slate-700"
                                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                            />

                            {/* Signature */}
                            <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-8">
                                <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                    {kepalaNama.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 mb-0.5 tracking-wide">Hormat kami,</p>
                                    <p className="font-bold text-slate-800 text-sm">{kepalaNama}</p>
                                    <p className="text-[11px] text-blue-600 font-semibold tracking-wide mt-0.5">Kepala Puskesmas</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}