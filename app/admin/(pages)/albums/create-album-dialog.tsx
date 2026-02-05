'use client'

import { useActionState, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createAlbum } from '@/services/album/album-service'

export function CreateAlbumDialog() {
    const [open, setOpen] = useState(false)
    const [state, formAction, isPending] = useActionState(createAlbum, null)

    useEffect(() => {
        if (state?.success) {
            setOpen(false)
            toast.success("Album baru berhasil dibuat")
        }
    }, [state])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    Buat Album
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <form action={formAction}>
                    <DialogHeader>
                        <DialogTitle className="text-xl">Buat Album Baru</DialogTitle>
                        <DialogDescription>
                            Beri judul untuk album koleksi foto lu. Judul ini bisa diubah nanti.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6">
                        <FieldGroup>
                            <Field className="space-y-2">
                                <FieldLabel htmlFor="album_title" className="text-sm font-semibold">
                                    Judul Album
                                </FieldLabel>
                                <Input
                                    id="album_title"
                                    name="album_title"
                                    placeholder="Contoh: Dokumentasi Posyandu 2026"
                                    required
                                    autoComplete="off"
                                    className="h-11 bg-slate-50/50 focus-visible:ring-primary/20"
                                />
                                {state?.error && (
                                    <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                                        {state.error}
                                    </p>
                                )}
                            </Field>
                        </FieldGroup>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="rounded-xl"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="rounded-xl min-w-[120px]"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                "Simpan Album"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}