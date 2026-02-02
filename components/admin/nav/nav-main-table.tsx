"use client"

import { ClipboardList, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from 'next/link'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMainTable({
  navMainTable,
}: {
  navMainTable: {
    name: string
    url?: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Utama</SidebarGroupLabel>
      <SidebarMenu>
        {navMainTable.map((item) => {
          const isItemActive = item.url === pathname || item.items?.some(subItem => subItem.url === pathname)

          return (
            <Collapsible
              key={item.name}
              asChild
              defaultOpen={isItemActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.name} isActive={isItemActive}>
                        {item.icon && <item.icon />}
                        <span>{item.name}</span>
                        <ClipboardList className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild isActive={subItem.url === pathname}>
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : (
                  <SidebarMenuButton asChild tooltip={item.name} isActive={item.url === pathname}>
                    <Link href={item.url ?? '#'}>
                      {item.icon && <item.icon />}
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}


