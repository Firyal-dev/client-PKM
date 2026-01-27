"use client"

import * as React from "react"
import { NavMain } from "@/components/nav/nav-main"
import { NavMedia } from "@/components/nav/nav-media"
import { NavUserExperience } from "@/components/nav/nav-user-experience"
import { NavAdminManage } from "@/components/nav/nav-admin-manage"
import { NavWebConfig } from "@/components/nav/nav-web-config"
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
import { ModeToggle } from "@/components/toggle-theme"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { sidebarData } from "@/constants/sidebar-data"
import { logoutAction } from "@/services/auth/logout-service"
import { useActionState } from "react"
import { UpdateProfile } from "@/components/update-profile"
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
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer w-full"
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
