import Link from "next/link";
import { Building2 } from "lucide-react";

export default async function TenantSuspendedPage({
    searchParams,
}: {
    searchParams: Promise<{ tenant?: string; reason?: string }>;
}) {
    const params = await searchParams;

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">

            <div className="max-w-xl w-full text-center">

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-red-50 border border-red-100">
                        <Building2 className="w-7 h-7 text-red-600" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-semibold text-slate-900 mb-4">
                    Website Tidak Aktif
                </h1>

                {/* Description */}
                <p className="text-slate-600 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
                    Website puskesmas ini saat ini tidak dapat diakses.
                    Silakan hubungi administrator untuk informasi lebih lanjut.
                </p>

                {/* Tenant */}
                {params.tenant && (
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">
                        {params.tenant}
                    </p>
                )}

                {/* Reason */}
                <div className="border border-red-200 rounded-lg p-5 mb-10 text-left bg-white">
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-500 mb-2">
                        Alasan Penonaktifan
                    </p>

                    <p className="text-sm text-slate-600 leading-relaxed">
                        {params.reason || "Tidak ada informasi tambahan dari administrator."}
                    </p>
                </div>

                {/* Action */}
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                >
                    Kembali ke Beranda
                </Link>

                {/* Footer */}
                <p className="mt-14 text-xs text-slate-400">
                    Sistem Informasi Puskesmas
                </p>

            </div>

        </div>
    );
}