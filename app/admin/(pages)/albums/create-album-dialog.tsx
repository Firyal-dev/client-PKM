'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createAlbum } from '@/services/album/album-service'
import { Plus } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

export function CreateAlbumDialog() {
    const [open, setOpen] = useState(false)
    const [state, formAction, isPending] = useActionState(createAlbum, null)

    // Reset open state when redirected (page reloads) or on success
    useEffect(() => {
        if (state?.success) {
            setOpen(false)
            toast.success("Album berhasil dibuat")
        }
    }, [state])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Buat Album
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={formAction}>
                    <DialogHeader>
                        <DialogTitle>Buat Album Baru</DialogTitle>
                        <DialogDescription>
                            Masukkan judul untuk album foto baru Anda.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="album_title">Judul Album</FieldLabel>
                                <Input
                                    id="album_title"
                                    name="album_title"
                                    placeholder="Contoh: Kegiatan Puskesmas 2024"
                                    required
                                />
                            </Field>
                            {state?.error && (
                                <p className="text-sm font-medium text-destructive">{state.error}</p>
                            )}
                        </FieldGroup>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Menyimpan..." : "Buat Album"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
