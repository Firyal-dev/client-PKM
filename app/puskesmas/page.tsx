// page.tsx
import { getPuskesmasList } from "@/services/puskesmas-list-service";
import { HeartPulse, MapPin } from "lucide-react";
import { PuskesmasListClient } from "@/components/user/puskesmas-list-client";

export default async function PuskesmasPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; page?: string }>
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const search = params.q;
    const puskesmasList = await getPuskesmasList(page, 9, search);

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Hero Section - Diperkecil (py-20 jadi py-14) */}
            <div className="relative bg-[url('/breadcrumb_bg.jpeg')] bg-cover bg-center bg-no-repeat border-b border-slate-300 overflow-hidden">
                <div className="absolute inset-0 bg-blue-950/80 mix-blend-multiply"></div>
                
                <div className="max-w-5xl mx-auto px-6 py-14 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4">
                        <MapPin className="w-3.5 h-3.5 text-blue-200" />
                        <span className="text-[10px] font-bold text-blue-50 uppercase tracking-[0.2em]">
                            Kota Bogor
                        </span>
                    </div>
                    {/* Ukuran Font diturunkan (text-5xl jadi text-3xl/4xl) */}
                    <h1 className="text-2xl md:text-4xl font-black text-white mb-3 tracking-tight">
                        Portal Puskesmas Kota Bogor
                    </h1>
                    <p className="text-blue-100/80 text-sm md:text-base max-w-lg mx-auto leading-relaxed font-medium">
                        Akses layanan kesehatan terpadu di seluruh wilayah Kota Bogor. Pilih puskesmas terdekat untuk pendaftaran online dan informasi layanan.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-5xl mx-auto px-6 py-8 -mt-10 relative z-20">
                <PuskesmasListClient initialData={puskesmasList} />
            </div>
        </main>
    );
}