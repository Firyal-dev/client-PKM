'use client'

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Loader2, Calendar as CalendarIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Agenda } from "@/types/agenda-prop"

const initialState = { success: false, error: undefined }

export function AgendaForm({ initialData, action }: { initialData?: Agenda, action: any }) {
    const [state, formAction, isPending] = useActionState(action, initialState)
    const router = useRouter()

    // States
    const initialTimes = initialData?.time?.split(' - ') || ["", ""]
    const [startTime, setStartTime] = useState(initialTimes[0])
    const [endTime, setEndTime] = useState(initialTimes[1])
    const [agendaDate, setAgendaDate] = useState<Date | undefined>(
        initialData?.date ? new Date(initialData.date) : undefined
    )
    const [effectiveDate, setEffectiveDate] = useState<Date | undefined>(
        initialData?.effective_date ? new Date(initialData.effective_date) : undefined
    )
    const [isMultiDay, setIsMultiDay] = useState(!!initialData?.effective_date && initialData.date !== initialData.effective_date)

    // Effects
    useEffect(() => {
        if (state?.error) toast.error(state.error)
        if (state?.success) {
            toast.success(initialData ? "Agenda berhasil diperbarui" : "Agenda berhasil dibuat")
            router.push('/admin/agenda')
            router.refresh()
        }
    }, [state, router, initialData])

    return (
        <Card className="shadow-md rounded-2xl">
            <CardContent className="p-6 md:p-8">
                <form action={formAction} className="space-y-6">
                    {/* Hidden Inputs */}
                    <input type="hidden" name="time" value={`${startTime} - ${endTime}`} />
                    <input type="hidden" name="effective_date" value={isMultiDay && effectiveDate ? format(effectiveDate, "yyyy-MM-dd") : (agendaDate ? format(agendaDate, "yyyy-MM-dd") : "")} />

                    <FieldGroup>
                        {/* Nama kegiatan */}
                        <div className="space-y-4">
                            <Field className="space-y-2">
                                <FieldLabel htmlFor="activity_name">Nama Kegiatan</FieldLabel>
                                <Input
                                    id="activity_name"
                                    name="activity_name"
                                    defaultValue={initialData?.activity_name}
                                    placeholder="Contoh: Rapat Koordinasi Kesehatan"
                                    required
                                    className="h-12 bg-slate-50/50"
                                />
                            </Field>
                        </div>

                        {/* Waktu Pelaksanaan */}
                        <div className="space-y-6 pt-4">
                            {/* Baris Tanggal */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field className="space-y-2">
                                    <FieldLabel>Tanggal Mulai</FieldLabel>
                                    <CustomDatePicker 
                                        name="date" 
                                        value={agendaDate} 
                                        onChange={(d: Date | undefined) => { 
                                            setAgendaDate(d); 
                                            if(!isMultiDay) setEffectiveDate(d); 
                                        }} 
                                    />
                                </Field>

                                {isMultiDay ? (
                                    <Field className="space-y-2 animate-in fade-in slide-in-from-right-2">
                                        <FieldLabel>Tanggal Selesai</FieldLabel>
                                        <CustomDatePicker 
                                            name="effective_date_display" 
                                            value={effectiveDate} 
                                            onChange={setEffectiveDate}
                                            minDate={agendaDate}
                                        />
                                    </Field>
                                ) : (
                                    <div className="flex items-end pb-1">
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            onClick={() => setIsMultiDay(true)}
                                            className="text-primary text-sm hover:bg-primary/5 h-12 w-full border border-dashed border-primary/30 rounded-lg"
                                        >
                                            + Tambah Tanggal Selesai
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Checkbox Multi-day */}
                            {isMultiDay && (
                                <div className="flex justify-end">
                                    <button 
                                        type="button" 
                                        onClick={() => { setIsMultiDay(false); setEffectiveDate(agendaDate); }}
                                        className="text-xs text-red-500 hover:underline"
                                    >
                                        Hapus Tanggal Selesai (Set Hari yang Sama)
                                    </button>
                                </div>
                            )}

                            {/* Baris Jam */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field className="space-y-2">
                                    <FieldLabel>Jam Mulai</FieldLabel>
                                    <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="h-12" />
                                </Field>
                                <Field className="space-y-2">
                                    <FieldLabel>Jam Selesai</FieldLabel>
                                    <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="h-12" />
                                </Field>
                            </div>
                        </div>

                        {/* Lokasi */}
                        <div className="space-y-4 pt-4">
                            <Field className="space-y-2">
                                <FieldLabel htmlFor="location">Lokasi Kegiatan</FieldLabel>
                                <Input
                                    id="location"
                                    name="location"
                                    defaultValue={initialData?.location}
                                    placeholder="Contoh: Aula Puskesmas Lt. 2"
                                    required
                                    className="h-12 bg-slate-50/50"
                                />
                            </Field>
                        </div>
                    </FieldGroup>

                    <div className="flex justify-end border-slate-100">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : (initialData ? "Perbarui Agenda" : "Simpan Agenda")}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

// Custom Date Picker
function CustomDatePicker({ name, value, onChange, minDate }: any) {
    return (
        <Popover>
            <input type="hidden" name={name} value={value ? format(value, "yyyy-MM-dd") : ""} />
            <PopoverTrigger asChild>
                <Button variant="outline" className={`w-full justify-between text-left h-12 px-4 rounded-lg bg-slate-50/50 ${!value && 'text-muted-foreground'}`}>
                    {value ? format(value, "PPP", { locale: id }) : "Pilih tanggal"}
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar 
                    mode="single" 
                    selected={value} 
                    onSelect={onChange} 
                    disabled={(date) => minDate ? date < minDate : false} 
                    locale={id} 
                />
            </PopoverContent>
        </Popover>
    )
}