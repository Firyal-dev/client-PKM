import Image from "next/image"
import { Quote } from "lucide-react"

export default function Sambutan() {
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
                                    src="/dokter.png"
                                    alt="Kepala Puskesmas Bogor Tengah"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* Kutipan */}
                            <div className="absolute -bottom-4 left-4 right-4 bg-blue-600 text-white p-3 rounded-xl shadow-md">
                                <Quote className="w-4 h-4 mb-1 opacity-60" />
                                <p className="text-xs font-semibold italic leading-snug">
                                    Melayani dengan Hati, Menuju Masyarakat Sehat
                                </p>
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
                                    Puskesmas Bogor Tengah
                                </h2>
                            </div>

                            <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed">
                                <p className="font-semibold text-slate-900">
                                    Assalamu&apos;alaikum Wr. Wb.
                                </p>

                                <p>
                                    Puji syukur kami panjatkan ke hadirat Tuhan Yang Maha Esa atas
                                    tersedianya website resmi Puskesmas Bogor Tengah sebagai media
                                    informasi dan komunikasi kepada masyarakat.
                                </p>

                                <p>
                                    Kami berkomitmen untuk memberikan pelayanan kesehatan yang
                                    profesional, transparan, dan mudah diakses oleh seluruh lapisan
                                    masyarakat. Melalui website ini, kami berharap informasi
                                    layanan, kegiatan, dan program kesehatan dapat diperoleh
                                    dengan lebih cepat dan jelas.
                                </p>

                                <div className="pt-2 text-sm">
                                    <p>Hormat kami,</p>
                                    <p className="font-bold text-slate-900">
                                        Kepala UPTD Puskesmas Bogor Tengah
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
