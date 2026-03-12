'use client'

import { useActionState, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createPuskesmasAction, updatePuskesmasAction, Puskesmas } from '@/services/puskesmas/puskesmas-service'

export function CreatePuskesDialog() {
    const [open, setOpen] = useState(false)
    const [state, formAction, isPending] = useActionState(createPuskesmasAction, null)

    const [status, setStatus] = useState<string>("ACTIVE")

    useEffect(() => {
        if (state?.success) {
            setOpen(false)
            toast.success("Puskesmas baru berhasil dibuat")
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    Tambah Puskesmas
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <form action={formAction}>
                    <DialogHeader>
                        <DialogTitle className="text-xl">Tambah Puskesmas</DialogTitle>
                        <DialogDescription>
                            Masukkan informasi dasar puskesmas baru.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-4">
                        <FieldGroup>
                            <Field className="space-y-2">
                                <FieldLabel htmlFor="c_name" className="text-sm font-semibold">Nama Puskesmas</FieldLabel>
                                <Input id="c_name" name="name" placeholder="Contoh: Puskesmas Sehat Selalu" required autoComplete="off" className="h-11 bg-slate-50/50 focus-visible:ring-primary/20" />
                            </Field>
                            <Field className="space-y-2">
                                <FieldLabel htmlFor="c_slug" className="text-sm font-semibold">Slug (URL)</FieldLabel>
                                <Input id="c_slug" name="slug" placeholder="Contoh: sehat-selalu" required autoComplete="off" className="h-11 bg-slate-50/50 focus-visible:ring-primary/20" />
                                <p className="text-xs text-muted-foreground">Digunakan untuk URL (contoh: domain.com/puskes/sehat-selalu)</p>
                            </Field>
                            <Field className="space-y-2">
                                <FieldLabel htmlFor="c_status" className="text-sm font-semibold">Status</FieldLabel>
                                <input type="hidden" name="status" value={status} />
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="h-11 bg-slate-50/50 focus-visible:ring-primary/20">
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Aktif</SelectItem>
                                        <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                                        <SelectItem value="SUSPENDED">Ditangguhkan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            {state?.error && (
                                <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                                    {state.error}
                                </p>
                            )}
                        </FieldGroup>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">Batal</Button>
                        <Button type="submit" disabled={isPending} className="rounded-xl min-w-[120px]">
                            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : "Simpan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function UpdatePuskesDialog({ puskesmas, open, onOpenChange }: { puskesmas: Puskesmas, open: boolean, onOpenChange: (open: boolean) => void }) {
    const updateAction = updatePuskesmasAction.bind(null, puskesmas.id)
    const [state, formAction, isPending] = useActionState(updateAction as unknown as (state: any, payload: FormData) => Promise<any>, null)

    // We update the local status state safely using useEffect, so it reflects the selected row 
    const [status, setStatus] = useState<string>(puskesmas.status)

    useEffect(() => {
        setStatus(puskesmas.status)
    }, [puskesmas])

    useEffect(() => {
        if (state?.success) {
            onOpenChange(false)
            toast.success("Data puskesmas diperbarui")
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state, onOpenChange])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <form action={formAction}>
                    <DialogHeader>
                        <DialogTitle className="text-xl">Ubah Puskesmas</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi dasar puskesmas.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-4">
                        <FieldGroup>
                            <Field className="space-y-2">
                                <FieldLabel htmlFor="u_name" className="text-sm font-semibold">Nama Puskesmas</FieldLabel>
                                <Input id="u_name" name="name" defaultValue={puskesmas.name} required autoComplete="off" className="h-11 bg-slate-50/50 focus-visible:ring-primary/20" />
                            </Field>
                            <Field className="space-y-2">
                                <FieldLabel htmlFor="u_slug" className="text-sm font-semibold">Slug (URL)</FieldLabel>
                                <Input id="u_slug" name="slug" defaultValue={puskesmas.slug} required autoComplete="off" className="h-11 bg-slate-50/50 focus-visible:ring-primary/20" />
                            </Field>
                            <Field className="space-y-2">
                                <FieldLabel htmlFor="u_status" className="text-sm font-semibold">Status</FieldLabel>
                                <input type="hidden" name="status" value={status} />
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="h-11 bg-slate-50/50 focus-visible:ring-primary/20">
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Aktif</SelectItem>
                                        <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                                        <SelectItem value="SUSPENDED">Ditangguhkan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            {state?.error && (
                                <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                                    {state.error}
                                </p>
                            )}
                        </FieldGroup>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl">Batal</Button>
                        <Button type="submit" disabled={isPending} className="rounded-xl min-w-[120px]">
                            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : "Perbarui"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
