'use client'

import { updateProfileAction } from "@/services/admin/update-profile-action"
import { useImagePreview } from '@/hooks/use-photo-preview'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useActionState, useEffect, useRef, useState, ChangeEvent } from "react"
import Image from 'next/image'
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { AdminProfileProp } from "@/types/admin-profile-prop"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { getMediaUrl } from "@/lib/getMediaUrl"

export function UpdateProfile({ profile }: { profile: AdminProfileProp }) {
    const [state, formAction, isPending] = useActionState(updateProfileAction, null)
    const { previewUrl, handleFileChange, resetPreview } = useImagePreview()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(profile.name || "")

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
    }

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value
        const cleanedValue = inputValue.replace(/[^a-zA-Z0-9 ]/g, '')
        setName(cleanedValue)
    }

    const photoSrc = getMediaUrl(profile?.photo, 'uploads/profiles') || "/userPlaceholder.jpg"

    // Sync name when profile changes from server (revalidateTag)
    useEffect(() => {
        if (profile?.name) {
            setName(profile.name)
        }
    }, [profile?.name])

    const wasPending = useRef(false)

    useEffect(() => {
        if (!isPending && wasPending.current && state) {
            if (state.success) {
                toast.success("Profil diperbarui!")
                resetPreview()
                setOpen(false)
            } else if (state.error) {
                toast.error("Gagal: " + state.error)
            }
        }
        wasPending.current = isPending
    }, [state, isPending, resetPreview])

    if (!profile) return null

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <SidebarMenuButton size="lg" className="cursor-pointer" tooltip="Edit Profil">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                        <Image src={photoSrc} width={100} height={100} className="w-full h-full object-cover rounded-full" alt="Profil" unoptimized />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{profile.name}</span>
                        <span className="truncate text-xs">{profile.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Operator'}</span>
                    </div>
                </SidebarMenuButton>
            </SheetTrigger>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit Profil</SheetTitle>
                    <SheetDescription>Edit profil. Klik simpan.</SheetDescription>
                </SheetHeader>

                <div className="flex flex-col items-center justify-center gap-3 py-8">
                    <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-primary/10">
                        <Image src={previewUrl || photoSrc} alt="Preview" fill className="object-cover" unoptimized />
                    </div>
                    <p className="text-xs text-muted-foreground uppercase">{previewUrl ? "Preview Baru" : "Foto Saat Ini"}</p>
                </div>

                <form action={formAction}>
                    <div className="grid gap-6 px-4">
                        <div className="grid gap-3">
                            <Label htmlFor="photo-upload">Foto</Label>
                            <Input id="photo-upload" onChange={handleFileChange} type="file" name="photo" accept="image/*" />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="admin-name">Nama</Label>
                            <Input
                                id="admin-name"
                                name="name"
                                required
                                value={name}
                                onChange={handleNameChange}
                                placeholder="huruf dan angka saja"
                            />
                            <p className="text-xs text-muted-foreground">Hanya huruf dan angka, tanpa spasi.</p>
                        </div>
                    </div>
                    <SheetFooter className="pt-10">
                        <Button type="submit" disabled={isPending}>{isPending ? "Memuat..." : "Simpan"}</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
