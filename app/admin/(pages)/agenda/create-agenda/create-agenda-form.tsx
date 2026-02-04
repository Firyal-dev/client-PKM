'use client'

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { createAgenda } from "@/services/agenda/agenda-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { ChevronDownIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

const initialState = {
    success: false,
    error: undefined as string | undefined,
}

function DatePicker({
    name,
    value,
    onChange,
    required,
    minDate,
}: {
    name: string
    value?: Date
    onChange?: (date?: Date) => void
    required?: boolean
    minDate?: Date
}) {
    return (
        <Popover>
            <input
                type="hidden"
                name={name}
                value={value ? format(value, "yyyy-MM-dd") : ""}
                required={required}
            />

            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!value}
                    className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                >
                    {value ? format(value, "PPP", { locale: id }) : "Pilih tanggal"}
                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    disabled={(date) =>
                        minDate ? date <= minDate : false
                    }
                    locale={id}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

export function CreateAgendaForm() {
    const [state, action, isPending] = useActionState(createAgenda, initialState)

    const [agendaDate, setAgendaDate] = useState<Date | undefined>()
    const [endDateMode, setEndDateMode] = useState<'same' | 'custom'>('same')
    const [effectiveDate, setEffectiveDate] = useState<Date | undefined>()

    // State untuk jam agar bisa digabungkan
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")

    const router = useRouter()

    useEffect(() => {
        if (state?.error) toast.error(state.error)
        if (state?.success) {
            toast.success("Agenda berhasil dibuat")
            router.push('/admin/agenda')
        }
    }, [state, router])

    return (
        <Card className="w-full">
            <CardContent className="p-6">
                <form action={action}>
                    {/* INPUT HIDDEN UNTUK MENGGABUNGKAN WAKTU */}
                    {/* Backend mengharapkan field 'time', jadi kita buat manual */}
                    <input 
                        type="hidden" 
                        name="time" 
                        value={startTime && endTime ? `${startTime} - ${endTime}` : startTime} 
                    />

                    <FieldGroup>

                        <Field>
                            <FieldLabel>Nama Kegiatan</FieldLabel>
                            <Input
                                name="activity_name"
                                placeholder="Contoh: Rapat Evaluasi Bulanan"
                                required
                            />
                        </Field>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field>
                                <FieldLabel>Tanggal Agenda</FieldLabel>
                                <DatePicker
                                    name="date"
                                    value={agendaDate}
                                    onChange={(date) => {
                                        setAgendaDate(date)
                                        // Default effective date sama dengan agenda date
                                        if (endDateMode === 'same') {
                                            setEffectiveDate(date)
                                        }
                                    }}
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Dari Jam</FieldLabel>
                                <Input
                                    type="time"
                                    // Hapus name="time_start" agar tidak dikirim raw ke server
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Sampai Jam</FieldLabel>
                                <Input
                                    type="time"
                                    // Hapus name="time_end"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Sampai Tanggal</FieldLabel>
                            <div className="flex gap-6 text-sm">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={endDateMode === 'same'}
                                        onChange={() => {
                                            setEndDateMode('same')
                                            setEffectiveDate(agendaDate)
                                        }}
                                    />
                                    Hari yang sama
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={endDateMode === 'custom'}
                                        onChange={() => {
                                            setEndDateMode('custom')
                                            setEffectiveDate(undefined)
                                        }}
                                    />
                                    Tanggal lain
                                </label>
                            </div>
                        </Field>

                        {/* CATATAN PENTING:
                           Di Code B (yang jalan), effective_date tipenya TIME (Sampai jam).
                           Di Code A ini, effective_date tipenya DATE (Sampai tanggal).
                           
                           Jika backend Anda mengharapkan JAM di field 'effective_date',
                           kode di bawah ini mungkin perlu disesuaikan.
                           Namun saya biarkan logic DATE sesuai keinginan UI Anda.
                        */}

                        {endDateMode === 'custom' && agendaDate && (
                            <Field>
                                <FieldLabel>Pilih Tanggal Akhir</FieldLabel>
                                <DatePicker
                                    name="effective_date"
                                    value={effectiveDate}
                                    onChange={setEffectiveDate}
                                    minDate={agendaDate}
                                    required
                                />
                            </Field>
                        )}

                        {endDateMode === 'same' && effectiveDate && (
                            <input
                                type="hidden"
                                name="effective_date"
                                value={format(effectiveDate, "yyyy-MM-dd")}
                            />
                        )}

                        <Field>
                            <FieldLabel>Lokasi</FieldLabel>
                            <Input
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