// page.tsx
import { getPuskesmasList } from "@/services/puskesmas-list-service";
import { HeartPulse } from "lucide-react";
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
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-5xl mx-auto px-6 py-12 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
                        <HeartPulse className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-xs font-medium text-blue-600">Portal Puskesmas</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                        Daftar Puskesmas
                    </h1>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                        Pilih puskesmas untuk mengakses layanan informasi dan pelayanan kesehatan.
                    </p>
                </div>
            </div>
            <div className="max-w-5xl mx-auto px-6 py-10">
                <PuskesmasListClient initialData={puskesmasList} />
            </div>
        </main>
    );
}