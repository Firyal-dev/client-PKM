import { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import RefreshButton from "@/components/RefreshButton";
import { checkTenantStatus, getTenantPageType } from "@/services/tenant-status-service";
import { getTenantHeader } from "@/services/server-helpers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Layanan Puskesmas Non-Aktif",
    description: "Status layanan sistem Puskesmas",
};

export default async function InactivePage({
    searchParams,
}: {
    searchParams: Promise<{ message?: string; name?: string }>;
}) {

    const headers = await getTenantHeader();
    const tenantSlug = headers["x-tenant-slug"] || "default";

    const statusInfo = await checkTenantStatus(tenantSlug);
    const currentPageType = getTenantPageType(statusInfo?.status);

    if (currentPageType !== "inactive") {
        redirect("/");
    }

    const { message: searchMessage, name: searchName } = await searchParams;

    const message =
        searchMessage || "Tidak ada keterangan tambahan dari administrator.";
    const pkmName = searchName || "Puskesmas";

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">

            <div className="max-w-2xl w-full text-center">

                {/* Tenant */}
                <p className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-6">
                    {pkmName}
                </p>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-100">
                        <AlertCircle className="w-7 h-7 text-emerald-600" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-semibold text-slate-900 mb-4">
                    Layanan Tidak Aktif
                </h1>

                {/* Description */}
                <p className="text-slate-600 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
                    Sistem informasi Puskesmas ini saat ini tidak aktif.
                    Silakan hubungi administrator atau coba kembali beberapa saat lagi.
                </p>

                {/* Admin Message */}
                <div className="text-left border border-slate-200 rounded-lg p-5 mb-10 bg-white">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                        Pesan Administrator
                    </p>

                    <p className="text-sm text-slate-600 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">

                    <RefreshButton
                        className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition"
                    >
                        Periksa Kembali
                    </RefreshButton>

                    <Link
                        href="/"
                        className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition"
                    >
                        Hubungi Administrator
                    </Link>

                </div>

                {/* Footer */}
                <p className="mt-14 text-xs text-slate-400">
                    © {new Date().getFullYear()} {pkmName}
                </p>

            </div>
        </div>
    );
}