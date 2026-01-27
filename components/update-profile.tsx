'use client'

import { updateProfileAction } from "@/services/admin/update-profile-action"
import { useImagePreview } from '@/hooks/use-photo-preview'
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
import { useActionState, useEffect, useState } from "react"
import Image from 'next/image'
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { AdminProfileProp } from "@/types/admin-profile-prop"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function UpdateProfile({ profile }: { profile: AdminProfileProp }) {
    const [updateState, formUpdateAction, updateIsLoading] = useActionState(updateProfileAction, null)
    const { previewUrl, handleFileChange, resetPreview } = useImagePreview()
    const [open, setOpen] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false);

    const photoSrc = profile.photo
        ? `http://localhost:3002/profiles/${profile.photo}`
        : "/puskesmasLogo.png";

    const displayPreview = previewUrl || photoSrc;

    useEffect(() => {
        if (updateIsLoading) {
            setIsProcessing(true);
        }
        if (!updateIsLoading && isProcessing && updateState) {
            if (updateState.success) {
                toast.success("Profil berhasil diperbarui!");
                resetPreview();
                setOpen(false);
            } else if (updateState.error) {
                toast.error("Gagal: " + updateState.error);
            }
            setIsProcessing(false);
        }
    }, [updateState, updateIsLoading, isProcessing, resetPreview]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <Tooltip>
                <SheetTrigger asChild>
                    <TooltipTrigger asChild>
                        <SidebarMenuButton size="lg" className="cursor-pointer">
                            <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <Image
                                    src={photoSrc || "/userPlaceholder.png"}
                                    width={100}
                                    height={100}
                                    unoptimized
                                    className="w-full h-full object-cover rounded-full"
                                    alt="Profil"
                                />
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

                <div className="flex flex-col items-center justify-center gap-3 py-8">
                    <div className="relative group">
                        <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-primary/10 shadow-lg">
                            <Image
                                src={displayPreview}
                                alt="Preview Foto Profil"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                        {previewUrl ? "Preview Foto Baru" : "Foto Profil Saat Ini"}
                    </p>
                </div>

                <form action={formUpdateAction}>
                    <div className="grid flex-1 auto-rows-min gap-6 px-4">
                        <div className="grid gap-3">
                            <Label htmlFor="photo-upload">Foto Profil</Label>
                            <Input
                                id="photo-upload"
                                onChange={handleFileChange}
                                type="file"
                                name="photo"
                                accept="image/*"
                            />
                            <p className="text-[11px] text-muted-foreground italic">
                                *Kosongkan jika tidak ingin mengubah foto
                            </p>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="admin-name">Nama</Label>
                            <Input
                                id="admin-name"
                                defaultValue={profile.name}
                                name="name"
                                required
                            />
                        </div>
                    </div>

                    <SheetFooter className="pt-10">
                        <Button type="submit" disabled={updateIsLoading}>
                            {updateIsLoading ? "Memuat..." : "Simpan Perubahan"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}