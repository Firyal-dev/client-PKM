"use client"

import * as React from "react"
import { NavMain } from "@/components/nav/nav-main"
import { NavMedia } from "@/components/nav/nav-media"
import { NavUserExperience } from "@/components/nav/nav-user-experience"
import { NavAdminManage } from "@/components/nav/nav-admin-manage"
import { NavWebConfig } from "@/components/nav/nav-web-config"

import { ModeToggle } from "@/components/toggle-theme"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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
import Image from 'next/image'
import { AdminProfileProp } from "@/types/admin-profile-prop"
import { useActionState } from "react"
import { updateProfileAction } from "@/services/admin/update-profile-action"
import { useImagePreview } from '@/hooks/use-photo-preview'

export function AppSidebar({ profile, ...props }: React.ComponentProps<typeof Sidebar> & { profile: AdminProfileProp }) {
  const [logoutState, formLogoutAction, logoutIsLoading] = useActionState(logoutAction, null)
  const [updateState, formUpdateAction, updateIsLoading] = useActionState(updateProfileAction, null)
  const { previewUrl, handleFileChange, resetPreview } = useImagePreview()


  const photoSrc =
    profile.photo
      ? `http://localhost:3002/profiles/${profile.photo}`
      : "/puskesmasLogo.png";

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Sheet>
              <Tooltip>
                <SheetTrigger asChild>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton size="lg" className="cursor-pointer">
                      <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                        <Image src={photoSrc} width={100} height={100} unoptimized className="w-full h-full object-contain rounded-full" alt="Profil" />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{profile.name}</span>
                        <span className="truncate text-xs">Puskesmas Bogor Barat</span>
                      </div>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                </SheetTrigger>
                <TooltipContent side="right">
                  <p>Edit Profil</p>
                </TooltipContent>
              </Tooltip>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Edit Profil</SheetTitle>
                  <SheetDescription>
                    Edit profil anda disini. Klik simpan ketika selesai.
                  </SheetDescription>
                </SheetHeader>
                {previewUrl && (
                  <div className="flex flex-col items-center justify-center gap-3 py-4">
                    <div className="relative group">
                      <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-primary/10 shadow-lg">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                      Preview Foto Baru
                    </p>
                  </div>
                )}
                <form action={formUpdateAction}>
                  <div className="grid flex-1 auto-rows-min gap-6 px-4">
                    <div className="grid gap-3">
                      <Label htmlFor="sheet-demo-name">Foto Profil</Label>
                      <Input id="sheet-demo-name" onChange={handleFileChange} type="file" name="photo" accept="image/*" />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="sheet-demo-name">Nama</Label>
                      <Input id="sheet-demo-name" defaultValue={profile.name} name="name" required />
                    </div>
                  </div>
                  {updateState?.error && (
                    <div className="text-red-500 text-sm">{updateState.error}</div>
                  )}
                  <SheetFooter className="pt-10">
                    <Button type="submit" disabled={updateIsLoading}>{updateIsLoading ? "Memuat..." : "Simpan Perubahan"}</Button>
                  </SheetFooter>
                </form>
              </SheetContent>
            </Sheet>
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
          <form action={formLogoutAction} className="flex-1">
            <Button
              variant="destructive"
              className="cursor-pointer w-full"
              disabled={logoutIsLoading}
            >
              {logoutIsLoading ? "Memuat..." : "Logout"}
            </Button>
          </form>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}