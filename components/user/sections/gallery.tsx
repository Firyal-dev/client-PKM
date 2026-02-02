"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { CustomLink } from "@/components/ui/link"

const galleryData = [
    {
        id: 1,
        title: "Pemeriksaan Lansia",
        category: "Layanan Medis",
        image: "/authBg.jpg",
        description:
            "Pemeriksaan kesehatan rutin untuk lansia guna memantau kondisi fisik dan mental.",
    },
    {
        id: 2,
        title: "Senam Prolanis",
        category: "Kegiatan",
        image: "/authBg.jpg",
        description:
            "Kegiatan senam bersama untuk menjaga kebugaran peserta program pengelolaan penyakit kronis.",
    },
    {
        id: 3,
        title: "Penyuluhan Gizi",
        category: "Edukasi",
        image: "/authBg.jpg",
        description:
            "Edukasi pentingnya gizi seimbang untuk mencegah stunting pada balita.",
    },
    {
        id: 4,
        title: "Vaksinasi COVID-19",
        category: "Imunisasi",
        image: "/authBg.jpg",
        description:
            "Pelayanan vaksinasi dosis lengkap dan booster untuk masyarakat umum.",
    },
    {
        id: 5,
        title: "Kunjungan Rumah",
        category: "Home Care",
        image: "/authBg.jpg",
        description:
            "Petugas kesehatan mengunjungi pasien yang memiliki keterbatasan mobilitas.",
    },
]

export default function Gallery() {
    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="container flex flex-col items-center mx-auto">
                <div className="flex flex-col items-center text-center mb-10 space-y-3">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-[10px] font-semibold uppercase tracking-wide">
                        Dokumentasi
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">
                        Galeri Kegiatan
                    </h2>
                    <p className="max-w-xl text-slate-600 text-sm md:text-base">
                        Momen berharga pelayanan kesehatan kami.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-3 h-[420px] w-full max-w-6xl mx-auto">
                    {galleryData.map((item, index) => (
                        <div
                            key={item.id}
                            className={cn(
                                "group relative flex-1 min-h-[80px] md:min-h-full",
                                "bg-slate-200 rounded-2xl overflow-hidden cursor-pointer",
                                "transition-all duration-500 ease-out",
                                "hover:flex-[2.5] hover:shadow-xl hover:shadow-blue-900/20"
                            )}
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 33vw"
                                priority={index === 0}
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                            <div className="absolute inset-x-0 bottom-0 p-5 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <span className="inline-block px-2 py-0.5 mb-2 text-[10px] font-semibold text-white bg-blue-600/90 rounded-full">
                                    {item.category}
                                </span>
                                <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
                                    {item.title}
                                </h3>
                                <p className="text-slate-200 text-xs md:text-sm line-clamp-2">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <CustomLink href="/" variant="outline" className="mt-8 mx-auto">
                    Lihat Semua
                </CustomLink>
            </div>
        </section>
    )
}
