import { Metadata } from "next";
import { checkTenantStatus, getTenantPageType } from "@/services/tenant-status-service";
import { getTenantHeader } from "@/services/server-helpers";
import { redirect } from "next/navigation";
import StatusPage from "@/components/status-page";

export const metadata: Metadata = {
    title: "Ditangguhkan - Puskesmas",
    description: "Website ditangguhkan sementara",
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

    if (currentPageType !== "suspended") redirect("/");

    const { message: searchMessage, name: searchName } = await searchParams;

    const message = statusInfo?.message || searchMessage || "Penangguhan akses sedang diberlakukan oleh administrator.";
    const pkmName = statusInfo?.name || searchName || "Puskesmas";

    return <StatusPage type="suspended" pkmName={pkmName} message={message} />
}