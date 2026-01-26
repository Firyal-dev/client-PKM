"use client"

import * as React from "react"
import { useState, useActionState, useEffect } from "react" 
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
// IMPORT Server Action yang baru dibuat
import { updateProfileAction } from "@/services/admin/update-profile-action"

// URL Konfigurasi untuk menampilkan gambar
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api/v1";

export function AppSidebar({ profile, ...props }: React.ComponentProps<typeof Sidebar> & { profile: AdminProfileProp }) {
  // --- AUTH ACTIONS ---
  const [logoutState, logoutTrigger, isLogoutLoading] = useActionState(logoutAction, null)
  
  // --- PROFILE UPDATE ACTIONS ---
  // Gunakan hook useActionState untuk menghubungkan Form dengan Server Action
  const [updateState, updateTrigger, isUpdateLoading] = useActionState(updateProfileAction, null)

  const [isOpen, setIsOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  
  // Efek Samping: Memantau hasil update
  // Jika sukses, tutup sheet dan tampilkan alert
  useEffect(() => {
    if (updateState?.success) {
      alert(updateState.message)
      setIsOpen(false)
      setPreview(null) // Reset preview agar kembali ke gambar dari server (yang sudah baru)
    }
  }, [updateState])

  // --- HELPER IMAGE ---
  const getProfileImage = () => {
    if (preview) return preview; // Jika user sedang pilih file, tampilkan preview lokal
    if (profile?.photo) {
        // Hapus /api/v1 karena static file biasanya di root (http://localhost:3030/uploads/...)
        const rootUrl = API_BASE_URL.replace('/api/v1', ''); 
        return `${rootUrl}/${profile.photo}`;
    }
    return "/puskesmasLogo.png";
  }

  // --- HANDLE FILE CHANGE (Hanya untuk preview UI) ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            
            {/* Sheet dikontrol oleh state isOpen */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <Tooltip>
                <SheetTrigger asChild>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton size="lg" className="cursor-pointer">
                      <div className="text-sidebar-primary-foreground flex aspect-square size-8 cursor-pointer items-center justify-center rounded-lg overflow-hidden border border-gray-200 bg-white">
                        <Image 
                            src={getProfileImage()} 
                            width={100} 
                            height={100} 
                            className="w-full h-full object-cover" 
                            alt="Avatar" 
                            unoptimized 
                        />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
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
                
                {/* FORM UPDATE: action={updateTrigger} langsung ke Server Action */}
                <form action={updateTrigger} className="mt-6 space-y-6">
                    
                    {/* Preview Image */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-sm">
                            <Image 
                                src={getProfileImage()}
                                fill
                                className="object-cover"
                                alt="Preview Avatar"
                                unoptimized
                            />
                        </div>
                    </div>

                  <div className="grid gap-4 p-4">
                    <div className="grid gap-2">
                      <Label htmlFor="photo">Ganti Foto Profil</Label>
                      {/* PENTING: name="photo" agar terbaca di FormData server action */}
                      <Input 
                        id="photo" 
                        name="photo" 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nama Lengkap</Label>
                      {/* PENTING: name="name" agar terbaca di FormData server action */}
                      <Input 
                        id="name" 
                        name="name" 
                        defaultValue={profile?.name} 
                        placeholder="Nama Admin"
                      />
                    </div>
                  </div>

                  {/* Tampilkan Pesan Error jika Gagal */}
                  {updateState?.error && (
                    <p className="text-sm font-medium text-destructive text-center">
                        {updateState.error}
                    </p>
                  )}

                  <SheetFooter>
                    <Button type="submit" disabled={isUpdateLoading}>
                        {isUpdateLoading ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
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
          {/* Form Logout */}
          <form action={logoutTrigger} className="flex-1">
            <Button
              variant="destructive"
              className="cursor-pointer w-full"
              disabled={isLogoutLoading}
            >
              {isLogoutLoading ? "Keluar..." : "Logout"}
            </Button>
          </form>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}