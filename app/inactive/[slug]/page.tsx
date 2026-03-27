import { Metadata } from "next";
import { checkTenantStatus, getTenantPageType } from "@/services/tenant-status-service";
import { redirect } from "next/navigation";
import StatusPage from "@/components/status-page";

export const metadata: Metadata = {
    title: "Tidak Aktif - Puskesmas",
    description: "Website sedang tidak aktif",
};

export default async function InactivePage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ message?: string; name?: string }>;
}) {
    const { slug } = await params;
    const statusInfo = await checkTenantStatus(slug);
    const currentPageType = getTenantPageType(statusInfo?.status);

    if (currentPageType !== "inactive") redirect("/");

    const { message: searchMessage, name: searchName } = await searchParams;
    const message = statusInfo?.message || searchMessage || "Website sedang tidak aktif untuk publik.";
    const pkmName = statusInfo?.name || searchName || "Puskesmas";

    return <StatusPage type="inactive" pkmName={pkmName} message={message} />
}
