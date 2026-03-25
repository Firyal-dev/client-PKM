import Image from "next/image"
import { Quote } from "lucide-react"
import { PuskesmasInfo } from "@/types/web-info"
import { getMediaUrl } from "@/lib/getMediaUrl"
import DOMPurify from "isomorphic-dompurify"
import { getTranslations } from "next-intl/server"

interface SambutanProps {
    data: PuskesmasInfo | null;
}

export default async function Sambutan({ data: puskesmasInfo }: SambutanProps) {
    const t = await getTranslations('Sambutan')

    const kepalaNama = puskesmasInfo?.kepala_puskesmas || t('head')
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
                    <span className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase">{t('label')}</span>
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
                                    {t('head')}
                                </p>
                                <p className="text-white font-bold text-sm leading-snug">
                                    {kepalaNama}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right — Content Card */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col overflow-hidden max-h-[540px]">
                        
                        <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Quote className="w-4 h-4 text-blue-500 fill-blue-500/10" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('mainMessage')}</span>
                            </div>
                        </div>

                        {/* Scrollable Greeting Area */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                            {sanitizedContent ? (
                                <div
                                    className="prose prose-blue prose-sm md:prose-base max-w-none leading-relaxed text-slate-600
                                        prose-headings:font-bold prose-headings:text-slate-800
                                        prose-p:my-4
                                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                                        prose-strong:text-slate-800
                                        prose-blockquote:border-blue-300 prose-blockquote:bg-blue-50/60 prose-blockquote:rounded-r-xl prose-blockquote:not-italic"
                                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                                />
                            ) : (
                                <div className="text-center py-20 text-slate-300">
                                    <Quote className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p className="font-bold uppercase tracking-widest text-[10px]">{t('empty')}</p>
                                </div>
                            )}

                            {/* Signature at bottom of scroll */}
                            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-200">
                                    {kepalaNama.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 mb-0.5 tracking-[0.1em] font-bold uppercase">{t('signed')}</p>
                                    <p className="font-black text-slate-900 text-sm md:text-base">{kepalaNama}</p>
                                    <p className="text-[11px] text-blue-600 font-bold mt-0.5">{t('head')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Accent Strip */}
                        <div className="h-1 bg-slate-100">
                            <div className="h-full bg-blue-600 w-16 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}