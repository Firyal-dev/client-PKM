import Image from "next/image"
import { Quote } from "lucide-react"

export default function Sambutan() {
    return (
        <section className="relative py-15 bg-gradient-to-b from-slate-50 to-white overflow-hidden" id="sambutan">
            <BackgroundAccents />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

                        {/* Sisi Kiri: Foto & Motto */}
                        <ProfileSection
                            image="/dokter.png"
                            name="Nama Kepala Puskesmas"
                            motto="ANDA SEHAT KAMI SENANG"
                        />

                        {/* Sisi Kanan: Teks Sambutan */}
                        <MessageSection
                            name="Nama Kepala Puskesmas"
                            title="Kepala UPTD Puskesmas"
                        />

                    </div>
                </div>
            </div>
        </section>
    )
}

// Aksen latar belakang foto
function BackgroundAccents() {
    return (
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-50/50 rounded-full blur-3xl" />
        </div>
    )
}

// Sisi Kiri: Foto & Motto
function ProfileSection({ image, name, motto }: { image: string, name: string, motto: string }) {
    return (
        <div className="relative w-full lg:w-[38%] max-w-[320px] lg:max-w-none mx-auto">

            {/* Decorative background */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-sky-300/30 rounded-full blur-3xl" />

            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-white z-10">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Motto */}
            <div className="mt-4 lg:absolute lg:-bottom-6 lg:-right-8 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-md border border-slate-100 max-w-[200px] z-20">
                <div className="flex items-center gap-2 mb-1.5">
                    <Quote className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Motto</span>
                </div>
                <p className="text-xs md:text-sm font-bold text-slate-800 italic leading-snug">
                    "{motto}"
                </p>
            </div>
        </div>
    )
}

// Sisi Kanan: Teks Sambutan
function MessageSection({ name, title }: { name: string, title: string }) {
    return (
        <div className="w-full lg:w-[62%] space-y-5">
            <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                    Sambutan
                </span>
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                    Selamat Datang di Website Resmi <br />
                    <span className="text-blue-600">Nama Puskesmas</span>
                </h2>
            </div>

            <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed">
                <p className="font-semibold text-slate-950">Assalamu&apos;alaikum Wr. Wb.</p>

                <p>
                    Puji syukur kami panjatkan kehadirat Allah SWT atas limpahan rahmat-Nya sehingga
                    <span className="font-semibold text-slate-900"> Nama Puskesmas </span>
                    dapat menghadirkan website ini sebagai sarana informasi digital bagi masyarakat.
                </p>

                <p>
                    Website ini kami hadirkan untuk memberikan akses informasi layanan kesehatan secara terbuka,
                    transparan, dan cepat kepada seluruh masyarakat mengenai program kesehatan yang kami jalankan.
                </p>

                <div className="pt-2 space-y-0.5">
                    <p>Demikian dan terima kasih.</p>
                    <p className="italic font-semibold text-slate-900">Wassalamu&apos;alaikum Wr. Wb.</p>
                </div>
            </div>

            <div className="pt-5 border-t border-slate-100">
                <h4 className="text-lg font-bold text-slate-900">{name}</h4>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-0.5">
                    {title}
                </p>
            </div>
        </div>
    )
}