"use client"

import {
    type LucideIcon,
} from "lucide-react"
import { usePathname } from "next/navigation"

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavWebConfig({
    navWebConfig,
}: {
    navWebConfig: {
        name: string
        url: string
        icon: LucideIcon
    }[]
}) {
    const pathname = usePathname()

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Konfigurasi Web</SidebarGroupLabel>
            <SidebarMenu>
                {navWebConfig.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={item.url === pathname}>
                            <a href={item.url}>
                                <item.icon />
                                <span>{item.name}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}

