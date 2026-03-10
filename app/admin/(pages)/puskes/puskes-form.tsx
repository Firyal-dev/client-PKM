'use client'

import { useEffect, useActionState, useState } from "react"
import { Puskesmas } from "@/services/puskesmas/puskesmas-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save, Building2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface PuskesmasFormProps {
    initialData?: Puskesmas
    action: (prevState: any, formData: FormData) => Promise<any>
}

export function PuskesmasForm({ initialData, action }: PuskesmasFormProps) {
    const router = useRouter()
    const [status, setStatus] = useState<string>(initialData?.status || 'ACTIVE')
    const [state, formAction, isPending] = useActionState(action, null)

    useEffect(() => {
        if (state?.success) {
            toast.success(initialData ? "Puskes diperbarui" : "Puskes ditambahkan")
            router.push('/admin/puskes')
            router.refresh()
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state, initialData, router])

    return (
        <form action={formAction} className="space-y-8">
            {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

            <div className="grid md:grid-cols-2 gap-6">
                {/* General Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            Informasi Dasar
                        </CardTitle>
                        <CardDescription>Nama dan identitas puskes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Puskesmas</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Contoh: Puskesmas Sehat Selalu"
                                defaultValue={initialData?.name}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (URL)</Label>
                            <Input
                                id="slug"
                                name="slug"
                                placeholder="Contoh: sehat-selalu"
                                defaultValue={initialData?.slug}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Slug digunakan untuk URL akses website (contoh: domain.com/puskes/sehat-selalu)
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <input type="hidden" name="status" value={status} />
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Aktif</SelectItem>
                                    <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                                    <SelectItem value="SUSPENDED">Ditangguhkan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" disabled={isPending} className="px-8">
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            {initialData ? 'Perbarui' : 'Simpan'}
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
