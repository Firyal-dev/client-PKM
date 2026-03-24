import Navbar from "@/components/user/partials/navbar"
import Footer from "@/components/user/partials/footer"
import { FloatingMenu } from "@/components/user/partials/floating-menu"
import { FloatingReview } from "@/components/user/partials/floating-review"
import { FloatingConsultation } from "@/components/user/partials/floating-consultation"
import { FloatingSienna } from "@/components/user/partials/floating-sienna"
import { createReviewAction } from "@/services/review/review-service"
import { createConsultationAction } from "@/services/consultation/consultation-service"
import Script from "next/script"
import { redirect } from "next/navigation";
import { checkTenantStatus, getTenantPageType, TenantStatus } from "@/services/tenant-status-service";
import { getTenantHeader } from "@/services/server-helpers";
import { getPublicPuskesmasInfo } from "@/services/puskesmas-info-service";

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

    const webInfo = await getPublicPuskesmasInfo();
    const themeColor = webInfo?.theme_color;
    const customStyle = themeColor ? { 
        '--primary': themeColor,
        '--color-blue-50': `color-mix(in srgb, ${themeColor} 10%, white)`,
        '--color-blue-100': `color-mix(in srgb, ${themeColor} 20%, white)`,
        '--color-blue-200': `color-mix(in srgb, ${themeColor} 40%, white)`,
        '--color-blue-300': `color-mix(in srgb, ${themeColor} 60%, white)`,
        '--color-blue-400': `color-mix(in srgb, ${themeColor} 80%, white)`,
        '--color-blue-500': `color-mix(in srgb, ${themeColor} 90%, white)`,
        '--color-blue-600': themeColor,
        '--color-blue-700': `color-mix(in srgb, ${themeColor} 80%, black)`,
        '--color-blue-800': `color-mix(in srgb, ${themeColor} 60%, black)`,
        '--color-blue-900': `color-mix(in srgb, ${themeColor} 40%, black)`,
        '--color-blue-950': `color-mix(in srgb, ${themeColor} 25%, black)`,
    } as React.CSSProperties : {};

    return (
        <div className="flex min-h-screen flex-col bg-slate-50" style={customStyle}>
            {/* Header */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <Footer />

            <FloatingMenu>
                <FloatingSienna />
                <FloatingConsultation onSubmit={createConsultationAction} />
                <FloatingReview onSubmit={createReviewAction} />
            </FloatingMenu>
            <Script src="https://cdn.jsdelivr.net/npm/sienna-accessibility@latest/dist/sienna-accessibility.umd.js" defer></Script>
            <style dangerouslySetInnerHTML={{ __html: `
                .asw-menu-btn { display: none !important; }
            `}} />
        </div>
    )
}
