"use client"

import * as React from "react"
import { NavMain } from "@/components/admin/nav/nav-main"
import { NavMedia } from "@/components/admin/nav/nav-media"
import { NavUserExperience } from "@/components/admin/nav/nav-user-experience"
import { NavAdminManage } from "@/components/admin/nav/nav-admin-manage"
import { NavWebConfig } from "@/components/admin/nav/nav-web-config"
import { NavActivities } from "@/components/admin/nav/nav-activities"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { ModeToggle } from "@/components/admin/toggle-theme"
import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { sidebarData } from "@/constants/sidebar-data"
import { logoutAction } from "@/services/auth/logout-service"
import { useActionState } from "react"
import { UpdateProfile } from "@/components/admin/update-profile"
import { AdminProfileProp } from "@/types/admin-profile-prop"

export function AppSidebar({ profile, ...props }: { profile: AdminProfileProp } & React.ComponentProps<typeof Sidebar>) {
  const [state, logout, isLoading] = useActionState(logoutAction, null)

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <UpdateProfile profile={profile} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        <NavMedia navMedia={sidebarData.navMedia} />
        <NavActivities navActivities={sidebarData.navActivities} />
        <NavUserExperience navUserExperience={sidebarData.navUserExperience} />
        <NavWebConfig navWebConfig={sidebarData.navWebConfig} />
        <NavAdminManage navAdminManage={sidebarData.navAdminManage} />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex gap-2">
          <ConfirmDialog trigger={<Button variant="destructive" className="flex-1 cursor-pointer">{isLoading ? "Memuat..." : "Logout"}</Button>} title="Yakin keluar?" description="Sesi akan berakhir." onConfirm={() => logout()} confirmText="Keluar" />
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
