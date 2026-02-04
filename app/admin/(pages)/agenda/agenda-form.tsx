'use client'

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { ChevronDownIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Agenda } from "@/types/agenda-prop"

const initialState: { success: boolean; error: string | undefined } = {
    success: false,
    error: undefined,
}

function DatePicker({ name, required, defaultValue }: { name: string; required?: boolean; defaultValue?: string }) {
    const [date, setDate] = useState<Date | undefined>(defaultValue ? new Date(defaultValue) : undefined)

    return (
        <Popover>
            <input type="hidden" name={name} value={date ? format(date, "yyyy-MM-dd") : ""} required={required} />
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!date}
                    className="data-[empty=true]:text-muted-foreground w-full justify-between text-left font-normal h-10 px-3 rounded-lg border-input bg-background hover:bg-accent hover:text-accent-foreground"
                >
                    {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    defaultMonth={date}
                    locale={id}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

interface AgendaFormProps {
    initialData?: Agenda
    action: (prevState: any, formData: FormData) => Promise<any>
}

export function AgendaForm({ initialData, action }: AgendaFormProps) {
    const [state, formAction, isPending] = useActionState(action, initialState)
    const router = useRouter()

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        }
        if (state?.success) {
            toast.success(initialData ? "Agenda berhasil diperbarui" : "Agenda berhasil dibuat")
            router.push('/admin/agenda')
            router.refresh()
        }
    }, [state, router, initialData])

    return (
        <Card className="w-full border-border/50 shadow-sm overflow-hidden rounded-2xl">
            <CardContent className="p-6 md:p-8">
                <form action={formAction}>
                    <FieldGroup className="space-y-6">
                        <Field className="space-y-2">
                            <FieldLabel htmlFor="activity_name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                Nama Kegiatan
                            </FieldLabel>
                            <Input
                                id="activity_name"
                                name="activity_name"
                                defaultValue={initialData?.activity_name}
                                placeholder="Contoh: Rapat Evaluasi Bulanan"
                                required
                                className="h-11 rounded-lg focus-visible:ring-primary"
                            />
                        </Field>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Field className="space-y-2">
                                <FieldLabel htmlFor="date" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                    Tanggal Agenda
                                </FieldLabel>
                                <DatePicker
                                    name="date"
                                    defaultValue={initialData?.date}
                                    required
                                />
                            </Field>

                            <Field className="space-y-2">
                                <FieldLabel htmlFor="time" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                    Dari jam:
                                </FieldLabel>
                                <Input
                                    id="time"
                                    name="time"
                                    type="time"
                                    defaultValue={initialData?.time}
                                    required
                                    className="h-11 rounded-lg bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden focus-visible:ring-primary"
                                />
                            </Field>

                            <Field className="space-y-2">
                                <FieldLabel htmlFor="effective_date" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                    Sampai jam:
                                </FieldLabel>
                                <Input
                                    id="effective_date"
                                    name="effective_date"
                                    type="time"
                                    defaultValue={initialData?.effective_date}
                                    required
                                    className="h-11 rounded-lg bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden focus-visible:ring-primary"
                                />
                            </Field>
                        </div>

                        <Field className="space-y-2">
                            <FieldLabel htmlFor="location" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                Lokasi
                            </FieldLabel>
                            <Input
                                id="location"
                                name="location"
                                defaultValue={initialData?.location}
                                placeholder="Contoh: Aula Utama"
                                required
                                className="h-11 rounded-lg focus-visible:ring-primary"
                            />
                        </Field>

                        <div className="flex justify-end pt-6 border-t border-border/50">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="min-w-[150px] font-bold rounded-xl h-11"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    initialData ? "Perbarui Agenda" : "Simpan Agenda"
                                )}
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
