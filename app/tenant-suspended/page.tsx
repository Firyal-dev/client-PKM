import Link from "next/link";
import { Building2 } from "lucide-react";

export default async function TenantSuspendedPage({
    searchParams,
}: {
    searchParams: Promise<{ tenant?: string; reason?: string }>;
}) {
    // Next.js 15 - searchParams is a Promise
    const params = await searchParams;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                {/* Icon */}
                <div className="mb-6">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <Building2 className="w-10 h-10 text-red-600" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Website Tidak Aktif
                </h1>

                {/* Description */}
                <p className="text-gray-600 mb-4">
                    Maaf, website puskesmas sedang tidak dapat diakses untuk saat ini.
                </p>

                {/* Reason - if provided */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                    <p className="text-sm text-yellow-800">
                        <span className="font-semibold">Alasan:</span>{" "}
                        {params.reason || "Tidak ada informasi"}
                    </p>
                </div>

                {/* Tenant Name */}
                {params.tenant && (
                    <p className="text-sm text-gray-500 mb-6">
                        <span className="font-medium">Puskesmas:</span> {params.tenant}
                    </p>
                )}

                {/* Contact Info */}
                <p className="text-sm text-gray-500 mb-6">
                    Silakan hubungi administrator untuk informasi lebih lanjut.
                </p>

                {/* Back to Home */}
                <Link
                    href="/"
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
}
