"use client"

import * as React from "react"
import { ChevronsUpDown, Building2 } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { switchTenant } from "@/services/admin/tenant-service"
import { useRouter } from "next/navigation"

export function TenantSwitcher({
    tenants,
    activeTenantId,
}: {
    tenants: {
        id: string
        name: string
    }[]
    activeTenantId?: string
}) {
    const { isMobile } = useSidebar()
    const router = useRouter()

    // Find active tenant or fallback to "Semua Puskesmas" representing null
    const activeTenant = tenants.find(t => t.id === activeTenantId) || { id: 'all', name: 'Semua Puskesmas (Global)' }

    const [isPending, startTransition] = React.useTransition()

    const handleSwitch = (tenantId: string) => {
        startTransition(async () => {
            // If 'all', they want to reset to global view (view all puskesmas)
            if (tenantId === 'all') {
                const res = await switchTenant(null); // Pass null to reset
                if (res.success) {
                    window.location.reload();
                } else {
                    alert(res.message);
                }
                return;
            }

            const res = await switchTenant(tenantId);
            if (res.success) {
                // Use hard reload to ensure all Server and Client components are fresh
                window.location.reload();
            } else {
                alert(res.message);
            }
        });
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mt-4 mb-2"
                            disabled={isPending}
                        >
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <Building2 className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{activeTenant.name}</span>
                                <span className="truncate text-xs">Akses Puskesmas</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            Pilih Puskesmas
                        </DropdownMenuLabel>
                        {tenants.map((team) => (
                            <DropdownMenuItem
                                key={team.id}
                                onClick={() => handleSwitch(team.id)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border">
                                    <Building2 className="size-3.5 shrink-0" />
                                </div>
                                {team.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
