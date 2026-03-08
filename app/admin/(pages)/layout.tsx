import { AppSidebar } from "@/components/admin/app-sidebar"
import { DynamicBreadcrumb } from "@/components/admin/dynamic-breadcumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { getAdminProfile } from "@/services/admin/admin-service"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { BreadcrumbProvider } from "@/components/admin/breadcrumb-context"
import { getTenants } from "@/services/admin/tenant-service"
import { headers } from "next/headers"

export const metadata: Metadata = {
    title: "Puskesmas",
    description: "Sistem Informasi Manajemen Puskesmas",
};

// Halaman yang diizinkan untuk SUPER_ADMIN yang BELUM pilih puskesmas
const ALLOWED_ROUTES_FOR_SUPERADMIN_WITHOUT_PUSKESMAS = [
    '/admin/dashboard',
    '/admin/admin-data',
    '/admin/activities-log',
    '/admin/admin-data/create',
    '/admin/admin-data/edit',
]

function isSuperAdminAllowed(pathname: string, hasSelectedPuskesmas: boolean): boolean {
    // Jika sudah pilih puskes, semua route diizinkan
    if (hasSelectedPuskesmas) {
        return true
    }
    // Jika belum pilih puskes, cek apakah route termasuk yang diizinkan
    return ALLOWED_ROUTES_FOR_SUPERADMIN_WITHOUT_PUSKESMAS.some(route => pathname === route || pathname.startsWith(route + '/'))
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const profile = await getAdminProfile();

    if (!profile) {
        redirect("/admin/login");
    }

    // Proteksi akses untuk SUPER_ADMIN
    if (profile.role === 'SUPER_ADMIN') {
        const headersList = await headers()
        const pathname = headersList.get('x-pathname') || ''
        const hasSelectedPuskesmas = !!profile.active_tenant

        // Jika belum pilih puskes dan akses halaman lain, redirect ke dashboard
        if (pathname && !isSuperAdminAllowed(pathname, hasSelectedPuskesmas)) {
            redirect("/admin/dashboard");
        }
    }

    let tenants = [];
    if (profile.role === 'SUPER_ADMIN') {
        tenants = await getTenants();
    }

    return (
        <SidebarProvider>
            <BreadcrumbProvider>
                <AppSidebar profile={profile} tenants={tenants} />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <DynamicBreadcrumb />
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        {children}
                    </div>
                </SidebarInset>
            </BreadcrumbProvider>
        </SidebarProvider>
    );
}