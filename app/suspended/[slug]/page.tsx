import { Metadata } from "next";
import { checkTenantStatus, getTenantPageType } from "@/services/tenant-status-service";
import { redirect } from "next/navigation";
import StatusPage from "@/components/status-page";

export const metadata: Metadata = {
    title: "Ditangguhkan - Puskesmas",
    description: "Website ditangguhkan sementara",
};

export default async function SuspendedPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ message?: string; name?: string }>;
}) {
    const { slug } = await params;
    const statusInfo = await checkTenantStatus(slug);
    const currentPageType = getTenantPageType(statusInfo?.status);

    if (currentPageType !== "suspended") redirect("/");

    const { message: searchMessage, name: searchName } = await searchParams;
    const message = statusInfo?.message || searchMessage || "Penangguhan akses sedang diberlakukan oleh administrator.";
    const pkmName = statusInfo?.name || searchName || "Puskesmas";

    return <StatusPage type="suspended" pkmName={pkmName} message={message} />
}
