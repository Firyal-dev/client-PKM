import { Metadata } from "next";
import { checkTenantStatus, getTenantPageType } from "@/services/tenant-status-service";
import { redirect } from "next/navigation";
import StatusPage from "@/components/status-page";

export const metadata: Metadata = {
    title: "Maintenance - Puskesmas",
    description: "Website sedang dalam perbaikan",
};

export default async function MaintenancePage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ message?: string; name?: string }>;
}) {
    const { slug } = await params;
    const statusInfo = await checkTenantStatus(slug);
    const currentPageType = getTenantPageType(statusInfo?.status);

    if (currentPageType !== "maintenance") redirect("/");

    const { message: searchMessage, name: searchName } = await searchParams;
    const message = statusInfo?.message || searchMessage || "Rencana perawatan sistem sedang berlangsung.";
    const pkmName = statusInfo?.name || searchName || "Puskesmas";

    return <StatusPage type="maintenance" pkmName={pkmName} message={message} />
}
