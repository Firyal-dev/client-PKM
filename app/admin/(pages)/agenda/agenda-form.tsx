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
                    className="data-[empty=true]:text-muted-foreground w-full justify-between text-left font-normal h-10 px-3 rounded-lg border-input bg-background hover:bg-accent hover:text-accent-foreground"
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

interface AgendaFormProps {
    initialData?: Agenda
    action: (prevState: any, formData: FormData) => Promise<any>
}

export function AgendaForm({ initialData, action }: AgendaFormProps) {
    const [state, formAction, isPending] = useActionState(action, initialState)
    const router = useRouter()

    // 1. PARSING LOGIC: Pecah string "09:00 - 12:00" jadi dua variable
    const initialTimes = initialData?.time ? initialData.time.split(' - ') : ["", ""];

    const [startTime, setStartTime] = useState(initialTimes[0] || "")
    const [endTime, setEndTime] = useState(initialTimes[1] || "")

    // 2. DATE LOGIC
    const [agendaDate, setAgendaDate] = useState<Date | undefined>(
        initialData?.date ? new Date(initialData.date) : undefined
    )

    // Cek apakah tanggal akhir beda sama tanggal mulai
    const initialEffectiveDate = initialData?.effective_date ? new Date(initialData.effective_date) : undefined;

    const isSameDateInitial = !initialData?.effective_date ||
        (initialData?.date && format(new Date(initialData.date), 'yyyy-MM-dd') === initialData.effective_date);

    const [endDateMode, setEndDateMode] = useState<'same' | 'custom'>(isSameDateInitial ? 'same' : 'custom')
    const [effectiveDate, setEffectiveDate] = useState<Date | undefined>(initialEffectiveDate)

    useEffect(() => {
        if (state?.error) toast.error(state.error)
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
                    {/* INPUT HIDDEN GABUNGAN WAKTU */}
                    <input
                        type="hidden"
                        name="time"
                        value={startTime && endTime ? `${startTime} - ${endTime}` : startTime}
                    />

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

                            <Field className="space-y-2">
                                <FieldLabel htmlFor="start_time" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                    Dari jam:
                                </FieldLabel>
                                <Input
                                    id="start_time"
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                    className="h-11 rounded-lg bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden focus-visible:ring-primary"
                                />
                            </Field>

                            <Field className="space-y-2">
                                <FieldLabel htmlFor="end_time" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                    Sampai jam:
                                </FieldLabel>
                                <Input
                                    id="end_time"
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                    className="h-11 rounded-lg bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden focus-visible:ring-primary"
                                />
                            </Field>
                        </div>

                        <Field className="space-y-2">
                            <FieldLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                Rentang Tanggal
                            </FieldLabel>
                            <div className="flex gap-6 text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="endDateMode"
                                        checked={endDateMode === 'same'}
                                        onChange={() => {
                                            setEndDateMode('same')
                                            setEffectiveDate(agendaDate)
                                        }}
                                        className="w-4 h-4 text-primary focus:ring-primary"
                                    />
                                    Hari yang sama
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="endDateMode"
                                        checked={endDateMode === 'custom'}
                                        onChange={() => {
                                            setEndDateMode('custom')
                                        }}
                                        className="w-4 h-4 text-primary focus:ring-primary"
                                    />
                                    Tanggal lain
                                </label>
                            </div>
                        </Field>

                        {endDateMode === 'custom' && (
                            <Field className="space-y-2">
                                <FieldLabel htmlFor="effective_date" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                    Pilih Tanggal Akhir
                                </FieldLabel>
                                <DatePicker
                                    name="effective_date"
                                    value={effectiveDate}
                                    onChange={setEffectiveDate}
                                    minDate={agendaDate}
                                    required
                                />
                            </Field>
                        )}

                        {endDateMode === 'same' && (
                            <input
                                type="hidden"
                                name="effective_date"
                                value={agendaDate ? format(agendaDate, "yyyy-MM-dd") : ""}
                            />
                        )}

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