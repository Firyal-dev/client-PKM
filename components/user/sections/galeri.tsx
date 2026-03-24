"use client"

import Image from "next/image"
import Link from "next/link"
import { LayoutGrid, ArrowRight } from "lucide-react"
import { getMediaUrl } from "@/lib/getMediaUrl"
import type { Gallery } from "@/types/gallery-prop"
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { useTranslations } from 'next-intl'

export default function GaleriSection({ data }: { data: Gallery[] }) {
    const t = useTranslations('Galeri')
    const hasData = Array.isArray(data) && data.length > 0

    if (!hasData) return null

    return (
        <section className="py-16 md:py-24 bg-slate-50" id="galeri">
            <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="block w-6 h-px bg-blue-400" />
                            <span className="text-[10px] font-bold tracking-[0.18em] text-blue-500 uppercase">{t('label')}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{t('title')}</h2>
                        <p className="text-sm text-slate-500">{t('desc')}</p>
                    </div>
                    <Link
                        href="/galeri"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group shrink-0"
                    >
                        {t('viewAll')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                {/* Grid */}
                <PhotoProvider>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                        {data.slice(0, 7).map((photo) => (
                            <PhotoView
                                key={photo.id}
                                src={getMediaUrl(photo.image) || "/placeholder.jpg"}
                            >
                                <div className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-200 border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-zoom-in">
                                    <Image
                                        src={getMediaUrl(photo.image) || "/placeholder.jpg"}
                                        alt={photo.image_title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                                        <p className="text-white text-xs font-bold line-clamp-2 leading-snug">
                                            {photo.image_title}
                                        </p>
                                    </div>
                                </div>
                            </PhotoView>
                        ))}

                        {/* Lihat semua tile */}
                        <Link
                            href="/galeri"
                            className="group relative aspect-square overflow-hidden rounded-2xl bg-blue-600 hover:bg-slate-900 border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center gap-3 text-white"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                            <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <LayoutGrid className="w-6 h-6" />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-black uppercase tracking-[0.2em]">{t('viewAll')}</p>
                                <p className="text-[10px] text-white/60 font-medium mt-0.5">{t('label')}</p>
                            </div>
                            <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                        </Link>
                    </div>
                </PhotoProvider>

            </div>
        </section>
    )
}