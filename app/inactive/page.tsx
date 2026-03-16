import { Metadata } from "next";
import { checkTenantStatus, getTenantPageType } from "@/services/tenant-status-service";
import { getTenantHeader } from "@/services/server-helpers";
import { redirect } from "next/navigation";
import StatusPage from "@/components/status-page";

export const metadata: Metadata = {
    title: "Layanan Non-Aktif - Puskesmas",
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

    if (currentPageType !== "inactive") redirect("/");

    const { message: searchMessage, name: searchName } = await searchParams;

    const message = statusInfo?.message || searchMessage || "Tidak ada keterangan tambahan dari administrator.";
    const pkmName = statusInfo?.name || searchName || "Puskesmas";

    return <StatusPage type="inactive" pkmName={pkmName} message={message} />
}