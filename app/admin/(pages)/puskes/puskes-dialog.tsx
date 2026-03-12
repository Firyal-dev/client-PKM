'use client'

import { useEffect, useActionState, useState } from "react"
import { Loader2, Save, Building2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

import { Puskesmas, createPuskesmasAction, updatePuskesmasAction } from "@/services/puskesmas/puskesmas-service"

interface PuskesDialogProps {
    initialData?: Puskesmas
    action: (prevState: any, formData: FormData) => Promise<any>
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function PuskesDialog({ initialData, action, open: controlledOpen, onOpenChange: controlledOnOpenChange }: PuskesDialogProps) {

    const router = useRouter()

    const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : uncontrolledOpen
    const setOpen = isControlled ? controlledOnOpenChange! : setUncontrolledOpen

    const [status, setStatus] = useState<string>(
        initialData?.status || "ACTIVE"
    )

    const [state, formAction, isPending] = useActionState(action, null)

    useEffect(() => {

        if (state?.success) {

            toast.success(
                initialData
                    ? "Puskesmas berhasil diperbarui"
                    : "Puskesmas berhasil dibuat"
            )

            setOpen(false)

            router.refresh()

        } else if (state?.error) {

            toast.error(state.error)

        }

    }, [state, initialData, router])


    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger asChild>
                <Button>
                    {initialData ? "Edit Puskesmas" : "Tambah Puskesmas"}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] rounded-2xl">

                <form action={formAction}>

                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            {initialData
                                ? "Ubah Puskesmas"
                                : "Tambah Puskesmas"}
                        </DialogTitle>

                        <DialogDescription>
                            {initialData
                                ? "Perbarui informasi dasar puskesmas."
                                : "Masukkan informasi dasar puskesmas baru."}
                        </DialogDescription>
                    </DialogHeader>


                    <div className="space-y-4 py-6">

                        {initialData?.id && (
                            <input
                                type="hidden"
                                name="id"
                                value={initialData.id}
                            />
                        )}

                        {/* Nama */}
                        <div className="space-y-2">

                            <Label htmlFor="name">
                                Nama Puskesmas
                            </Label>

                            <Input
                                id="name"
                                name="name"
                                placeholder="Contoh: Puskesmas Sehat Selalu"
                                defaultValue={initialData?.name}
                                required
                                className="h-11"
                            />

                        </div>


                        {/* Slug */}
                        <div className="space-y-2">

                            <Label htmlFor="slug">
                                Slug (URL)
                            </Label>

                            <Input
                                id="slug"
                                name="slug"
                                placeholder="Contoh: sehat-selalu"
                                defaultValue={initialData?.slug}
                                required
                                className="h-11"
                            />

                            <p className="text-xs text-muted-foreground">
                                Digunakan untuk URL akses website
                                (contoh: domain.com/puskes/sehat-selalu)
                            </p>

                        </div>


                        {/* Status */}
                        <div className="space-y-2">

                            <Label>Status</Label>

                            <input
                                type="hidden"
                                name="status"
                                value={status}
                            />

                            <Select
                                value={status}
                                onValueChange={setStatus}
                            >
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>

                                <SelectContent>

                                    <SelectItem value="ACTIVE">
                                        Aktif
                                    </SelectItem>

                                    <SelectItem value="INACTIVE">
                                        Tidak Aktif
                                    </SelectItem>

                                    <SelectItem value="SUSPENDED">
                                        Ditangguhkan
                                    </SelectItem>

                                    <SelectItem value="MAINTENANCE">
                                        Maintenance
                                    </SelectItem>

                                </SelectContent>
                            </Select>

                        </div>


                        {state?.error && (
                            <p className="text-xs text-destructive">
                                {state.error}
                            </p>
                        )}

                    </div>


                    <DialogFooter>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                        >
                            Batal
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending}
                        >

                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {initialData ? "Perbarui" : "Simpan"}
                                </>
                            )}

                        </Button>

                    </DialogFooter>

                </form>

            </DialogContent>
        </Dialog>
    )
}

export function CreatePuskesDialog() {
    return (
        <PuskesDialog
            action={createPuskesmasAction}
        />
    )
}

export function UpdatePuskesDialog({
    puskesmas,
    open,
    onOpenChange
}: {
    puskesmas: Puskesmas,
    open: boolean,
    onOpenChange: (open: boolean) => void
}) {
    // Wrap the action to pass the ID
    const updateAction = updatePuskesmasAction.bind(null, puskesmas.id)

    return (
        <PuskesDialog
            initialData={puskesmas}
            action={updateAction}
            open={open}
            onOpenChange={onOpenChange}
        />
    )
}