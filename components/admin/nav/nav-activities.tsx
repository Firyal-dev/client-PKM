"use client"

import { type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from 'next/link'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export function NavActivities({ navActivities }: { navActivities: { name: string; url: string; icon: LucideIcon }[] }) {
  const pathname = usePathname()

  const isMatch = (url: string) => {
    return pathname === url || pathname.startsWith(url + "/")
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Activities</SidebarGroupLabel>
      <SidebarMenu>
        {navActivities.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild isActive={isMatch(item.url)}>
              <Link href={item.url}><item.icon /><span>{item.name}</span></Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
