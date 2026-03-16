import { Metadata } from "next";
import RefreshButton from "@/components/RefreshButton";
import { checkTenantStatus, getTenantPageType } from "@/services/tenant-status-service";
import { getTenantHeader } from "@/services/server-helpers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Dinonaktifkan - Puskesmas",
    description: "Website dinonaktifkan sementara",
};

export default async function SuspendedPage({
    searchParams,
}: {
    searchParams: Promise<{ message?: string; name?: string }>;
}) {

    const headers = await getTenantHeader();
    const tenantSlug = headers["x-tenant-slug"] || "default";

    const statusInfo = await checkTenantStatus(tenantSlug);
    const currentPageType = getTenantPageType(statusInfo?.status);

    if (currentPageType !== "suspended") {
        redirect("/");
    }

    const { message: searchMessage, name: searchName } = await searchParams;

    const message =
        searchMessage || "Penangguhan akses sedang diberlakukan oleh administrator.";
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
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-red-50 border border-red-100">
                        <svg
                            className="w-7 h-7 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 
                                12.728A9 9 0 015.636 5.636m12.728 
                                12.728L5.636 5.636"
                            />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-semibold text-slate-900 mb-4">
                    Website Dinonaktifkan
                </h1>

                {/* Description */}
                <p className="text-slate-600 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
                    Akses ke sistem informasi Puskesmas ini telah dinonaktifkan
                    sementara oleh administrator.
                </p>

                {/* Admin Message */}
                <div className="text-left border border-red-200 rounded-lg p-5 mb-10 bg-white">
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-500 mb-2">
                        Informasi Administrator
                    </p>

                    <p className="text-sm text-slate-600 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Action */}
                <RefreshButton
                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
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

                {/* Footer */}
                <p className="mt-14 text-xs text-slate-400">
                    © {new Date().getFullYear()} {pkmName}
                </p>

            </div>
        </div>
    );
}