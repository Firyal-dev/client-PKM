"use client"

import * as React from "react"
import { NavMain } from "@/components/admin/nav/nav-main"
import { NavMedia } from "@/components/admin/nav/nav-media"
import { NavUserExperience } from "@/components/admin/nav/nav-user-experience"
import { NavAdminManage } from "@/components/admin/nav/nav-admin-manage"
import { NavWebConfig } from "@/components/admin/nav/nav-web-config"
import { NavMainTable } from "@/components/admin/nav/nav-main-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ModeToggle } from "@/components/admin/toggle-theme"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { sidebarData } from "@/constants/sidebar-data"
import { logoutAction } from "@/services/auth/logout-service"
import { useActionState } from "react"
import { UpdateProfile } from "@/components/admin/update-profile"
import { AdminProfileProp } from "@/types/admin-profile-prop"


export function AppSidebar({ profile, ...props }: { profile: AdminProfileProp } & React.ComponentProps<typeof Sidebar>) {
  const [logoutState, formLogoutAction, logoutIsLoading] = useActionState(logoutAction, null)

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
        <NavUserExperience navUserExperience={sidebarData.navUserExperience} />
        <NavAdminManage navAdminManage={sidebarData.navAdminManage} />
        <NavMainTable navMainTable={sidebarData.navMainTable} />
        <NavWebConfig navWebConfig={sidebarData.navWebConfig} />

      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-row gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="cursor-pointer flex-1 gap-2"
                disabled={logoutIsLoading}
              >
                {logoutIsLoading ? "Memuat..." : "Logout"}
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Yakin mau keluar?</AlertDialogTitle>
                <AlertDialogDescription>
                  Sesi berakhir dan anda harus login ulang untuk akses dashboard admin.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
                <form action={formLogoutAction}>
                  <AlertDialogAction
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer"
                  >
                    Keluar
                  </AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
