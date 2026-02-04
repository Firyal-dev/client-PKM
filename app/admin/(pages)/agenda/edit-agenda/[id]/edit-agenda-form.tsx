'use client'

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { updateAgenda } from "@/services/agenda/agenda-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { ChevronDownIcon } from "lucide-react"
import { format, parseISO } from "date-fns"
import { id } from "date-fns/locale"
import { Agenda } from "@/types/agenda-prop"

const initialState: { success: boolean; error: string | undefined } = {
    success: false,
    error: undefined,
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

export function EditAgendaForm({ agenda }: { agenda: Agenda }) {
    const updateAgendaWithId = updateAgenda.bind(null, agenda._id)
    const [state, action, isPending] = useActionState(updateAgendaWithId, initialState)
    const router = useRouter()

    // 1. PARSING LOGIC: Pecah string "09:00 - 12:00" jadi dua variable
    // Kalau format di DB kacau/kosong, kasih fallback string kosong
    const initialTimes = agenda.time ? agenda.time.split(' - ') : ["", ""];
    
    const [startTime, setStartTime] = useState(initialTimes[0] || "")
    const [endTime, setEndTime] = useState(initialTimes[1] || "")

    // 2. DATE LOGIC
    // Konversi string ISO dari DB ke Object Date JS
    const [agendaDate, setAgendaDate] = useState<Date | undefined>(
        agenda.date ? new Date(agenda.date) : undefined
    )

    // Cek apakah tanggal akhir beda sama tanggal mulai
    // Format DB effective_date biasanya YYYY-MM-DD string berdasarkan schema gambar kamu
    const initialEffectiveDate = agenda.effective_date ? new Date(agenda.effective_date) : undefined;
    
    // Tentukan mode awal: Kalau tanggalnya sama (atau effective kosong), mode 'same'
    const isSameDate = !agenda.effective_date || 
        (agenda.date && format(new Date(agenda.date), 'yyyy-MM-dd') === agenda.effective_date);

    const [endDateMode, setEndDateMode] = useState<'same' | 'custom'>(isSameDate ? 'same' : 'custom')
    const [effectiveDate, setEffectiveDate] = useState<Date | undefined>(initialEffectiveDate)

    useEffect(() => {
        if (state?.error) toast.error(state.error)
        if (state?.success) {
            toast.success("Agenda berhasil diperbarui")
            router.push('/admin/agenda')
        }
    }, [state, router])

    return (
        <Card className="w-full">
            <CardContent className="p-6">
                <form action={action}>
                    
                    {/* INPUT HIDDEN GABUNGAN WAKTU */}
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
                                defaultValue={agenda.activity_name}
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
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Sampai Jam</FieldLabel>
                                <Input
                                    type="time"
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
                                            // Jangan reset date null, biarkan user milih atau keep yg lama
                                        }}
                                    />
                                    Tanggal lain
                                </label>
                            </div>
                        </Field>

                        {endDateMode === 'custom' && (
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
                                defaultValue={agenda.location}
                                placeholder="Contoh: Aula Utama"
                                required
                            />
                        </Field>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Menyimpan..." : "Perbarui Agenda"}
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}