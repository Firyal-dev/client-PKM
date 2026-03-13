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
import { useActionState, useTransition } from "react"
import { UpdateProfile } from "@/components/admin/update-profile"
import { AdminProfileProp } from "@/types/admin-profile-prop"
import { TenantSwitcher } from "@/components/admin/tenant-switcher"
import { Building2 } from "lucide-react"
import Link from "next/link"

export function AppSidebar({ profile, tenants = [], ...props }: { profile: AdminProfileProp, tenants?: any[] } & React.ComponentProps<typeof Sidebar>) {
  const [state, logout, isPending] = useActionState(logoutAction, null)
  const [isTransitionPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(() => {
      logout()
    })
  }

  // Cek apakah user adalah SUPER_ADMIN dan sudah memilih puskesmas
  const isSuperAdmin = profile.role === 'SUPER_ADMIN'
  const hasSelectedPuskesmas = !!profile.active_tenant

  // SUPER_ADMIN: hanya tampilkan menu terbatas jika belum memilih puskesmas
  // Jika sudah memilih puskes, tampilkan semua menu
  const showLimitedMenu = isSuperAdmin && !hasSelectedPuskesmas

  //operator
  const isOperator = profile.role === 'OPERATOR'

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <UpdateProfile profile={profile} />
          </SidebarMenuItem>
          {isSuperAdmin && (
            <TenantSwitcher tenants={tenants} activeTenantId={profile.active_tenant} />
          )}
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
 <SidebarContent>
  {showLimitedMenu ? (
    <>
      <NavMain items={sidebarData.navMain.slice(0, 1)} />

      {/* Hanya SUPER_ADMIN */}
      {isSuperAdmin && (
        <NavAdminManage navAdminManage={sidebarData.navAdminManage} />
      )}
    </>
  ) : (
    <>
      <NavMain items={sidebarData.navMain} />
      <NavMedia navMedia={sidebarData.navMedia} />
      <NavActivities navActivities={sidebarData.navActivities} />
      <NavUserExperience navUserExperience={sidebarData.navUserExperience} />
      <NavWebConfig navWebConfig={sidebarData.navWebConfig} />

      {/* Hanya SUPER_ADMIN */}
      {isSuperAdmin && (
        <NavAdminManage navAdminManage={sidebarData.navAdminManage} />
      )}
    </>
  )}
</SidebarContent>
      <SidebarFooter>
        <div className="flex gap-2">
          <ConfirmDialog trigger={<Button variant="destructive" className="flex-1 cursor-pointer">{isPending || isTransitionPending ? "Memuat..." : "Logout"}</Button>} title="Yakin keluar?" description="Sesi akan berakhir." onConfirm={handleLogout} confirmText="Keluar" />
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
