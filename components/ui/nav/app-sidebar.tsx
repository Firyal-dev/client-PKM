"use client"

import * as React from "react"
import { useRouter } from "next/navigation" 
import { NavMain } from "@/components/ui/nav/nav-main"
import { NavMedia } from "@/components/ui/nav/nav-media"
import { NavUserExperience } from "@/components/ui/nav/nav-user-experience"
import { NavAdminManage } from "@/components/ui/nav/nav-admin-manage"
import { NavWebConfig } from "@/components/ui/nav/nav-web-config"
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
import { logoutAction } from "@/services/auth/logoutService" 
import Image from 'next/image'

export function AppSidebar({ profile, ...props }: React.ComponentProps<typeof Sidebar> & { profile?: any }) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logoutAction() 
    } catch (error) {
      console.error("Gagal logout", error)
      setIsLoading(false)
    }
  }
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
                        <Image src="/puskesmasLogo.png" width={100} height={100} className="w-full h-full object-contain" alt="Logo Puskesmas" />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        {/* Pakai tanda tanya (?) biar aman kalau profile belum load */}
                        <span className="truncate font-medium">{profile?.name || 'Admin'}</span>
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
                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                  <div className="grid gap-3">
                    <Label htmlFor="sheet-demo-name">Foto Profil</Label>
                    <Input id="sheet-demo-name" type="file" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="sheet-demo-name">Nama</Label>
                    <Input id="sheet-demo-name" defaultValue={profile?.name} />
                  </div>
                </div>
                <SheetFooter>
                  <Button type="submit">Simpan Perubahan</Button>
                  <SheetClose asChild>
                    <Button variant="outline">Tutup</Button>
                  </SheetClose>
                </SheetFooter>
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
          <Button 
            variant="destructive" 
            className="flex-1"
            onClick={handleLogout} 
            disabled={isLoading}   
          >
            {isLoading ? "Keluar..." : "Logout"}
          </Button>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}