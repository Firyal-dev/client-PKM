"use client"

import { type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from 'next/link'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export function NavMedia({ navMedia }: { navMedia: { title: string; items: { title: string; url: string; icon: LucideIcon }[] }[] }) {
  const pathname = usePathname()

  const isMatch = (url: string) => {
    return pathname === url || pathname.startsWith(url + "/")
  }

  return (
    <>
      {navMedia.map((group) => (
        <SidebarGroup key={group.title} className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isMatch(item.url)}>
                  <Link href={item.url}><item.icon /><span>{item.title}</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}

