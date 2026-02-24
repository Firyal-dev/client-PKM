"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar"

export function NavMain({ items }: { items: { title: string; url?: string; icon: LucideIcon; isActive?: boolean; items?: { title: string; url: string }[] }[] }) {
  const pathname = usePathname()

  // Helper untuk cek apakah path saat ini aktif (termasuk sub-path)
  const isMatch = (url?: string) => {
    if (!url) return false
    return pathname === url || pathname.startsWith(url + "/")
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Utama</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isItemActive = isMatch(item.url) || item.items?.some(subItem => isMatch(subItem.url))
          const isParentTrulyActive = isMatch(item.url)

          return (
            <Collapsible key={item.title} asChild defaultOpen={isItemActive} className="group/collapsible">
              <SidebarMenuItem>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isParentTrulyActive}
                        className={cn(
                          "transition-all duration-200",
                          isItemActive && !isParentTrulyActive && "bg-accent/50 text-accent-foreground"
                        )}
                      >
                        {item.icon && <item.icon />}
                        <span className="font-medium">{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="border-l-2 ml-4 pl-2 space-y-1 mt-1 transition-all">
                        {item.items?.map((subItem) => {
                          const isSubActive = isMatch(subItem.url)
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={false}
                                className={cn(
                                  "group relative flex items-center gap-2 px-3 transition-all duration-200 rounded-md h-9",
                                  isSubActive
                                    ? "bg-primary/10 text-primary font-semibold shadow-sm"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                )}
                              >
                                <Link href={subItem.url}>
                                  {isSubActive && (
                                    <span className="absolute left-0 w-1 h-4 bg-primary rounded-r-full" />
                                  )}
                                  <span className={cn(
                                    "transition-transform duration-200",
                                    isSubActive ? "translate-x-1" : "group-hover:translate-x-0.5"
                                  )}>
                                    {subItem.title}
                                  </span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : (
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isMatch(item.url)}
                    className="transition-all duration-200"
                  >
                    <Link href={item.url ?? '#'}>
                      {item.icon && <item.icon />}
                      <span className="font-medium">{item.title}</span>
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
