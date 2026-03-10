"use client"

import * as React from "react"
import { ChevronsUpDown, Building2, Search, X, Check } from "lucide-react"

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
import { Input } from "@/components/ui/input"

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
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isSearchFocused, setIsSearchFocused] = React.useState(false)

    // Find active tenant or fallback to "Semua Puskesmas" representing null
    const activeTenant = tenants.find(t => t.id === activeTenantId) || { id: 'all', name: 'Semua Puskesmas (Global)' }

    const [isPending, startTransition] = React.useTransition()

    // Filter tenants based on search query
    const filteredTenants = React.useMemo(() => {
        if (!searchQuery.trim()) return tenants
        const query = searchQuery.toLowerCase()
        return tenants.filter(t => t.name.toLowerCase().includes(query))
    }, [tenants, searchQuery])

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

    const handleCancel = () => {
        startTransition(async () => {
            const res = await switchTenant(null);
            if (res.success) {
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

                        {/* Search Input */}
                        <div className="relative px-2 py-1.5">
                            <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                placeholder="Cari puskesmas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className="h-8 pl-8 pr-8 text-xs"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-7 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        <DropdownMenuSeparator />

                        {/* Cancel/Reset Option - only show if there's an active selection */}
                        {activeTenantId && (
                            <DropdownMenuItem
                                onClick={handleCancel}
                                className="gap-2 p-2 text-muted-foreground hover:text-destructive"
                                disabled={isPending}
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border border-destructive/50">
                                    <X className="size-3.5 shrink-0 text-destructive" />
                                </div>
                                <span className="text-destructive">Batal Pilih (Reset)</span>
                            </DropdownMenuItem>
                        )}

                        {filteredTenants.length === 0 ? (
                            <DropdownMenuItem disabled className="text-muted-foreground">
                                Tidak ada puskesmas ditemukan
                            </DropdownMenuItem>
                        ) : (
                            filteredTenants.map((team) => (
                                <DropdownMenuItem
                                    key={team.id}
                                    onClick={() => handleSwitch(team.id)}
                                    className={`gap-2 p-2 ${activeTenantId === team.id ? "bg-accent text-accent-foreground font-medium" : ""}`}
                                    disabled={isPending}
                                >
                                    <div className={`flex size-6 items-center justify-center rounded-md border ${activeTenantId === team.id ? "border-primary bg-primary text-primary-foreground" : ""}`}>
                                        {activeTenantId === team.id
                                            ? <Check className="size-3.5 shrink-0" />
                                            : <Building2 className="size-3.5 shrink-0" />
                                        }
                                    </div>
                                    {team.name}
                                    {activeTenantId === team.id && (
                                        <Check className="ml-auto size-3.5 text-primary" />
                                    )}
                                </DropdownMenuItem>
                            ))
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
