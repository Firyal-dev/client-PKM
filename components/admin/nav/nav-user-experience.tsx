"use client"

import {
    type LucideIcon,
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from 'next/link'

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavUserExperience({
    navUserExperience,
}: {
    navUserExperience: {
        name: string
        url: string
        icon: LucideIcon
    }[]
}) {
    const pathname = usePathname()

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Pengalaman Pengguna</SidebarGroupLabel>
            <SidebarMenu>
                {navUserExperience.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={item.url === pathname}>
                            <Link href={item.url}>
                                <item.icon />
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}

