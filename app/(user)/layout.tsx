import Navbar from "@/components/user/partials/navbar"
import Footer from "@/components/user/partials/footer"
import { FloatingMenu } from "@/components/user/partials/floating-menu"
import { FloatingReview } from "@/components/user/partials/floating-review"
import { FloatingConsultation } from "@/components/user/partials/floating-consultation"
import { createReviewAction } from "@/services/review/review-service"
import { createConsultationAction } from "@/services/consultation/consultation-service"
import Script from "next/script"
import { redirect } from "next/navigation";
import { checkTenantStatus, getTenantPageType, TenantStatus } from "@/services/tenant-status-service";
import { getTenantHeader } from "@/services/server-helpers";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Get tenant slug from headers
    const headers = await getTenantHeader();
    const tenantSlug = headers['x-tenant-slug'] || 'default';

    // Check tenant status early
    const statusInfo = await checkTenantStatus(tenantSlug);
    const pageType = getTenantPageType(statusInfo?.status as TenantStatus);

    // Redirect to special pages for maintenance/suspended
    const commonParams = `?name=${encodeURIComponent(statusInfo?.name || 'Puskesmas')}&message=${encodeURIComponent(statusInfo?.message || '')}`;

    if (pageType === 'maintenance') {
        redirect(`/maintenance${commonParams}`);
    }

    if (pageType === 'suspended') {
        redirect(`/suspended${commonParams}`);
    }

    if (pageType === 'inactive') {
        redirect(`/inactive${commonParams}`);
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            {/* Header */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <Footer />

            <FloatingMenu>
                <FloatingConsultation onSubmit={createConsultationAction} />
                <FloatingReview onSubmit={createReviewAction} />
            </FloatingMenu>
            <Script src="https://cdn.jsdelivr.net/npm/sienna-accessibility@latest/dist/sienna-accessibility.umd.js" defer></Script>

        </div>
    )
}
