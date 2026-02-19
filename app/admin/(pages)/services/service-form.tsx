'use client'

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Service, ServiceFlow } from "@/services/services/service-service"

interface ServiceFormProps {
    initialData?: Service
    action: (prevState: any, formData: FormData) => Promise<any>
}

export function ServiceForm({ initialData, action }: ServiceFormProps) {
    const router = useRouter()
    const [state, formAction, isPending] = useActionState(action, null)

    // Flows state
    const [flows, setFlows] = useState<ServiceFlow[]>(
        initialData?.flows?.map(f => ({
            id: f.id,
            title_flow: f.title_flow,
            description_flow: f.description_flow || '',
            step_order: f.step_order
        })) || []
    )

    useEffect(() => {
        if (state?.success) {
            toast.success(initialData ? "Layanan berhasil diperbarui" : "Layanan berhasil dibuat")
            router.push('/admin/services')
            router.refresh()
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state, initialData, router])

    const addFlow = () => {
        setFlows([
            ...flows,
            {
                title_flow: '',
                description_flow: '',
                step_order: flows.length + 1
            }
        ])
    }

    const removeFlow = (index: number) => {
        const newFlows = flows.filter((_, i) => i !== index)
        // Reorder
        setFlows(newFlows.map((f, i) => ({ ...f, step_order: i + 1 })))
    }

    const updateFlow = (index: number, field: keyof ServiceFlow, value: string | number) => {
        const newFlows = [...flows]
        newFlows[index] = { ...newFlows[index], [field]: value }
        setFlows(newFlows)
    }

    // Hidden input for flows data
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget)
        formData.set('flows', JSON.stringify(flows))
        formAction(formData)
    }

    return (
        <Card className="shadow-md rounded-2xl">
            <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <FieldGroup>
                        <Field className="space-y-2">
                            <FieldLabel htmlFor="service_name">Nama Layanan</FieldLabel>
                            <Input
                                id="service_name"
                                name="service_name"
                                defaultValue={initialData?.service_name}
                                placeholder="Contoh: Layanan Kesehatan Masyarakat"
                                required
                                className="h-12 bg-slate-50/50"
                            />
                        </Field>

                        <Field className="space-y-2 pt-4">
                            <FieldLabel htmlFor="icon">Icon (Emoji)</FieldLabel>
                            <Input
                                id="icon"
                                name="icon"
                                defaultValue={initialData?.icon}
                                placeholder="Contoh: 💉"
                                className="h-12 bg-slate-50/50"
                            />
                            <p className="text-xs text-muted-foreground">
                                Masukkan emoji untuk icon layanan
                            </p>
                        </Field>

                        <Field className="space-y-2 pt-4">
                            <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={initialData?.description}
                                placeholder="Tuliskan deskripsi layanan di sini..."
                                className="bg-slate-50/50 min-h-[100px]"
                            />
                        </Field>
                    </FieldGroup>

                    {/* Flow Steps Section */}
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Langkah-langkah Layanan</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addFlow}
                                className="gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Langkah
                            </Button>
                        </div>

                        {flows.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                                <p>Belum ada langkah-langkah layanan</p>
                                <p className="text-sm">Klik "Tambah Langkah" untuk menambahkan</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {flows.map((flow, index) => (
                                    <Card key={index} className="border-muted">
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <Input
                                                        value={flow.title_flow}
                                                        onChange={(e) => updateFlow(index, 'title_flow', e.target.value)}
                                                        placeholder={`Langkah ${index + 1}: Judul`}
                                                        className="bg-slate-50/50"
                                                    />
                                                    <Textarea
                                                        value={flow.description_flow || ''}
                                                        onChange={(e) => updateFlow(index, 'description_flow', e.target.value)}
                                                        placeholder="Deskripsi langkah..."
                                                        className="bg-slate-50/50 min-h-[60px]"
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name={`flows[${index}][title_flow]`}
                                                        value={flow.title_flow}
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name={`flows[${index}][description_flow]`}
                                                        value={flow.description_flow || ''}
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name={`flows[${index}][step_order]`}
                                                        value={index + 1}
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeFlow(index)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end border-slate-100 pt-4">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                initialData ? "Perbarui Layanan" : "Simpan Layanan"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
