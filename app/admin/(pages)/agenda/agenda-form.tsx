'use client'

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Loader2, Calendar as CalendarIcon, CalendarRange, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Agenda } from "@/types/agenda-prop"
import { cn } from "@/lib/utils"

const initialState = { success: false, error: undefined }

export function AgendaForm({ initialData, action }: { initialData?: Agenda; action: any }) {
    const [state, formAction, isPending] = useActionState(action, initialState)
    const router = useRouter()

    const initialTimes = initialData?.time?.split(' - ') || ["", ""]
    const [startTime, setStartTime] = useState(initialTimes[0])
    const [endTime, setEndTime] = useState(initialTimes[1])
    const [agendaDate, setAgendaDate] = useState<Date | undefined>(
        initialData?.date ? new Date(initialData.date) : undefined
    )
    const [effectiveDate, setEffectiveDate] = useState<Date | undefined>(
        initialData?.effective_date ? new Date(initialData.effective_date) : undefined
    )
    const [isMultiDay, setIsMultiDay] = useState(
        !!initialData?.effective_date && initialData.date !== initialData.effective_date
    )

    useEffect(() => {
        if (state?.error) toast.error(state.error)
        if (state?.success) {
            toast.success(initialData ? "Agenda berhasil diperbarui" : "Agenda berhasil dibuat")
            router.push('/admin/agenda')
            router.refresh()
        }
    }, [state, router, initialData])

    return (
        <form action={formAction} className="space-y-5">
            <input type="hidden" name="time" value={`${startTime} - ${endTime}`} />
            <input
                type="hidden"
                name="effective_date"
                value={
                    isMultiDay && effectiveDate
                        ? format(effectiveDate, "yyyy-MM-dd")
                        : agendaDate ? format(agendaDate, "yyyy-MM-dd") : ""
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Main fields */}
                <div className="md:col-span-2 space-y-4">

                    {/* Nama Kegiatan */}
                    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Informasi Kegiatan</p>

                        <Field className="space-y-1.5">
                            <FieldLabel htmlFor="activity_name" className="text-sm font-medium">Nama Kegiatan</FieldLabel>
                            <Input
                                id="activity_name"
                                name="activity_name"
                                defaultValue={initialData?.activity_name}
                                placeholder="Contoh: Rapat Koordinasi Kesehatan"
                                required
                                className="rounded-xl h-10"
                            />
                        </Field>

                        <Field className="space-y-1.5">
                            <FieldLabel htmlFor="location" className="text-sm font-medium">Lokasi</FieldLabel>
                            <Input
                                id="location"
                                name="location"
                                defaultValue={initialData?.location}
                                placeholder="Contoh: Aula Puskesmas Lt. 2"
                                required
                                className="rounded-xl h-10"
                            />
                        </Field>
                    </div>

                    {/* Tanggal */}
                    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tanggal Pelaksanaan</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field className="space-y-1.5">
                                <FieldLabel className="text-sm font-medium">
                                    {isMultiDay ? "Tanggal Mulai" : "Tanggal"}
                                </FieldLabel>
                                <CustomDatePicker
                                    name="date"
                                    value={agendaDate}
                                    onChange={(d: Date | undefined) => {
                                        setAgendaDate(d)
                                        if (!isMultiDay) setEffectiveDate(d)
                                    }}
                                />
                            </Field>

                            {isMultiDay ? (
                                <Field className="space-y-1.5 animate-in fade-in slide-in-from-right-2">
                                    <FieldLabel className="text-sm font-medium">Tanggal Selesai</FieldLabel>
                                    <CustomDatePicker
                                        name="effective_date_display"
                                        value={effectiveDate}
                                        onChange={setEffectiveDate}
                                        minDate={agendaDate}
                                    />
                                </Field>
                            ) : (
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsMultiDay(true)}
                                        className="w-full h-10 flex items-center justify-center gap-2 text-xs font-medium text-primary border border-dashed border-primary/30 rounded-xl hover:bg-primary/5 transition-colors"
                                    >
                                        <CalendarRange className="w-3.5 h-3.5" />
                                        Tambah Tanggal Selesai
                                    </button>
                                </div>
                            )}
                        </div>

                        {isMultiDay && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => { setIsMultiDay(false); setEffectiveDate(agendaDate) }}
                                    className="flex items-center gap-1 text-xs text-destructive/70 hover:text-destructive transition-colors"
                                >
                                    <X className="w-3 h-3" /> Hapus Tanggal Selesai
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Jam */}
                    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Waktu</p>
                        <div className="grid grid-cols-2 gap-3">
                            <Field className="space-y-1.5">
                                <FieldLabel className="text-sm font-medium">Jam Mulai</FieldLabel>
                                <Input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                    className="rounded-xl h-10"
                                />
                            </Field>
                            <Field className="space-y-1.5">
                                <FieldLabel className="text-sm font-medium">Jam Selesai</FieldLabel>
                                <Input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                    className="rounded-xl h-10"
                                />
                            </Field>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Submit */}
                <div className="space-y-4">
                    <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-3 h-fit">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Simpan</p>
                        <p className="text-xs text-muted-foreground/70 leading-relaxed">
                            {initialData
                                ? "Perubahan akan langsung diterapkan ke agenda ini."
                                : "Agenda akan ditambahkan ke daftar kegiatan."}
                        </p>
                        <div className="pt-1">
                            <Button type="submit" disabled={isPending} className="w-full rounded-xl font-semibold">
                                {isPending ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
                                ) : initialData ? "Perbarui Agenda" : "Simpan Agenda"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

function CustomDatePicker({ name, value, onChange, minDate }: any) {
    return (
        <Popover>
            <input type="hidden" name={name} value={value ? format(value, "yyyy-MM-dd") : ""} />
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-between text-left h-10 px-3 rounded-xl font-normal border-border/60",
                        !value && "text-muted-foreground"
                    )}
                >
                    <span className="text-sm">
                        {value ? format(value, "PPP", { locale: id }) : "Pilih tanggal"}
                    </span>
                    <CalendarIcon className="h-3.5 w-3.5 opacity-40 shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-xl" align="start">
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