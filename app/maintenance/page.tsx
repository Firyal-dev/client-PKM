import { Metadata } from "next";
import RefreshButton from "@/components/RefreshButton";
import { checkTenantStatus, getTenantPageType } from "@/services/tenant-status-service";
import { getTenantHeader } from "@/services/server-helpers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Maintenance - Puskesmas",
    description: "Website sedang dalam perbaikan",
};

export default async function MaintenancePage({
    searchParams,
}: {
    searchParams: Promise<{ message?: string; name?: string }>;
}) {
    const headers = await getTenantHeader();
    const tenantSlug = headers["x-tenant-slug"] || "default";

    const statusInfo = await checkTenantStatus(tenantSlug);
    const currentPageType = getTenantPageType(statusInfo?.status);

    if (currentPageType !== "maintenance") {
        redirect("/");
    }

    const { message: searchMessage, name: searchName } = await searchParams;

    const message =
        searchMessage || "Rencana perawatan sistem sedang berlangsung.";
    const pkmName = searchName || "Puskesmas";

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-6">

            {/* Icon */}
            <div className="mb-10">
                <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-blue-50 border border-blue-100">
                    <svg
                        className="w-10 h-10 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeWidth={1.6}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 
                            0a1.724 1.724 0 002.573 1.066c1.543-.94 
                            3.31.826 2.37 2.37a1.724 1.724 
                            0 001.065 2.572c1.756.426 
                            1.756 2.924 0 3.35a1.724 
                            1.724 0 00-1.066 
                            2.573c.94 1.543-.826 
                            3.31-2.37 2.37a1.724 
                            1.724 0 00-2.572 
                            1.065c-.426 1.756-2.924 
                            1.756-3.35 0a1.724 
                            1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 
                            1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 
                            0-3.35a1.724 1.724 0 
                            001.066-2.573c-.94-1.543.826-3.31 
                            2.37-2.37.996.608 2.296.07 
                            2.572-1.065z"
                        />
                    </svg>
                </div>
            </div>

            {/* Tenant Name */}
            <p className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-3">
                {pkmName}
            </p>

            {/* Title */}
            <h1 className="text-4xl font-semibold text-slate-900 text-center mb-4">
                Sistem Sedang Dalam Pemeliharaan
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-lg text-center max-w-xl mb-10 leading-relaxed">
                Kami sedang melakukan pemeliharaan sistem untuk meningkatkan
                stabilitas dan kualitas layanan.
            </p>

            {/* Message */}
            <p className="text-sm text-slate-500 text-center max-w-md mb-10 leading-relaxed">
                {message}
            </p>

            {/* Button */}
            <RefreshButton
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                icon={
                    <svg
                        className="w-5 h-5 transition-transform duration-500 group-hover:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 4v5h.582m15.356 2A8.001 
                            8.001 0 004.582 9m0 
                            0H9m11 11v-5h-.581m0 
                            0a8.003 8.003 
                            0 01-15.357-2m15.357 
                            2H15"
                        />
                    </svg>
                }
            >
                Muat Ulang Halaman
            </RefreshButton>
        </div>
    );
}