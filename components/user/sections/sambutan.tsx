import Image from "next/image"
import Link from "next/link"
import { Quote, ArrowRight } from "lucide-react"
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
        <section className="relative py-16 md:py-24 bg-white overflow-hidden" id="sambutan">
            {/* Subtle background accent */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-50/70 -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-slate-50/80 translate-y-1/2 -translate-x-1/3 blur-2xl pointer-events-none" />

            <div className="relative max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">

                {/* Section Label */}
                <div className="flex items-center gap-3 mb-12">
                    <span className="block w-8 h-px bg-blue-400" />
                    <span className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase">Kata Sambutan</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12 lg:gap-20 items-start">

                    {/* Left — Photo + identity */}
                    <div className="flex flex-row lg:flex-col items-start gap-5 lg:sticky lg:top-28">

                        {/* Photo */}
                        <div className="relative w-36 md:w-48 lg:w-full max-w-[220px] flex-shrink-0">
                            {/* Decorative frame */}
                            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl bg-blue-100" />
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg ring-1 ring-slate-200/80">
                                <Image
                                    src={kepalaFoto || "/userPlaceholder.jpg"}
                                    alt={kepalaNama}
                                    fill
                                    className="object-cover"
                                    priority
                                    unoptimized
                                />
                                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-blue-950/60 to-transparent" />
                            </div>
                        </div>

                        {/* Identity card */}
                        <div className="flex-1 lg:w-full">
                            <div className="bg-blue-700 rounded-xl px-5 py-4 shadow-md">
                                <p className="text-[9px] font-bold tracking-[0.18em] text-blue-300 uppercase mb-1.5">
                                    Kepala Puskesmas
                                </p>
                                <p className="text-white font-bold text-sm leading-snug">
                                    {kepalaNama}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right — Content */}
                    <div>

                        <Quote
                            className="text-blue-100 w-10 h-10 mb-4 -ml-1 fill-blue-100 stroke-blue-200"
                            strokeWidth={0.75}
                        />

                        {sanitizedContent ? (
                            <div
                                className="prose prose-slate prose-sm md:prose-base max-w-none leading-relaxed
                                    prose-headings:font-bold prose-headings:text-slate-800
                                    prose-p:text-slate-600 prose-p:my-3
                                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                                    prose-strong:text-slate-700
                                    prose-blockquote:border-blue-300 prose-blockquote:bg-blue-50/60 prose-blockquote:rounded-r-lg prose-blockquote:not-italic"
                                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                            />
                        ) : (
                            <p className="text-slate-500 text-sm italic">Sambutan belum tersedia.</p>
                        )}

                        {/* Signature */}
                        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                                {kepalaNama.charAt(0)}
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 mb-0.5 tracking-wide font-medium uppercase">Hormat kami,</p>
                                <p className="font-bold text-slate-800 text-sm">{kepalaNama}</p>
                                <p className="text-[11px] text-blue-600 font-medium mt-0.5">Kepala Puskesmas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}