'use client'

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { createAgenda } from "@/services/agenda/agenda-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { ChevronDownIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

const initialState: { success: boolean; error: string | undefined } = {
    success: false,
    error: undefined,
}

function DatePicker({ name, required }: { name: string; required?: boolean }) {
    const [date, setDate] = useState<Date | undefined>(undefined)

    return (
        <Popover>
            <input type="hidden" name={name} value={date ? format(date, "yyyy-MM-dd") : ""} required={required} />
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!date}
                    className="data-[empty=true]:text-muted-foreground w-full justify-between text-left font-normal"
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

export function CreateAgendaForm() {
    const [state, action, isPending] = useActionState(createAgenda, initialState)

    const router = useRouter()

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        }
        if (state?.success) {
            toast.success("Agenda berhasil dibuat")
            router.push('/admin/agenda')
        }
    }, [state, router])

    return (
        <Card className="w-full">
            <CardContent className="p-6">
                <form action={action}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="activity_name">Nama Kegiatan</FieldLabel>
                            <Input
                                id="activity_name"
                                name="activity_name"
                                placeholder="Contoh: Rapat Evaluasi Bulanan"
                                required
                            />
                        </Field>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field>
                                <FieldLabel htmlFor="date">Tanggal Agenda</FieldLabel>
                                <DatePicker
                                    name="date"
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="time">Dari jam:</FieldLabel>
                                <Input
                                    id="time"
                                    name="time"
                                    type="time"
                                    required
                                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="effective_date">Sampai jam:</FieldLabel>
                                <Input
                                    id="effective_date"
                                    name="effective_date"
                                    type="time"
                                    required
                                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel htmlFor="location">Lokasi</FieldLabel>
                            <Input
                                id="location"
                                name="location"
                                placeholder="Contoh: Aula Utama"
                                required
                            />
                        </Field>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Menyimpan..." : "Simpan Agenda"}
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
