"use client"

import Image from "next/image"
import SearchBar from "@/components/user/partials/search-bar"
import { Banner } from "@/types/banner-prop"
import { getMediaUrl } from "@/lib/getMediaUrl"

export default function Hero({ data }: { data: Banner[] }) {
    return (
        <section className="relative">
            {data.map((banner) => (
                <div key={banner._id} className="relative h-[80vh] min-h-[420px] bg-slate-900">
                    <Image
                        src={getMediaUrl(banner.image_path) || "/placeholder.jpg"}
                        alt={banner.title || "Banner"}
                        fill
                        priority
                        className="object-cover opacity-80"
                        unoptimized
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

                    <div className="relative container h-full flex items-center">
                        <div className="max-w-3xl space-y-5">
                            <span className="inline-block px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded-md">
                                Puskesmas Bogor Tengah
                            </span>

                            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                                {banner.title || "Pelayanan Kesehatan Terpadu"}
                            </h1>

                            <p className="text-slate-200 max-w-xl">
                                {banner.description || "Melayani masyarakat dengan cepat, tepat, dan profesional melalui layanan kesehatan yang mudah diakses."}
                            </p>
                        </div>
                    </div>
                </div>
            ))}

            {/* Search */}
            <div className="-mt-10 relative z-10">
                <SearchBar />
            </div>

            <div className="h-10" />
        </section>
    )
}
