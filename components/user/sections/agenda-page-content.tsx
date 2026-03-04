"use client"

import { useState, useMemo } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-user"
import Breadcrumb from "@/components/user/partials/breadcrumb"
import { MapPin, CalendarDays, ArrowRight, Clock, Info } from "lucide-react"
import { format, isSameDay } from "date-fns"
import { id } from "date-fns/locale"
import type { Agenda } from "@/types/agenda-prop"
import Link from "next/link"

interface AgendaPageContentProps {
    initialAgendas: Agenda[]
}

export default function AgendaPageContent({ initialAgendas }: AgendaPageContentProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

    const breadcrumbItems = [{ label: "Agenda" }]

    // Filter agenda berdasarkan tanggal yang dipilih
    const filteredAgendas = useMemo(() => {
        if (!selectedDate) return []
        return initialAgendas.filter(item =>
            isSameDay(new Date(item.date), selectedDate)
        )
    }, [initialAgendas, selectedDate])

    // Highlight tanggal yang ada kegiatannya di kalender
    const eventDays = useMemo(() => {
        return initialAgendas.map(item => new Date(item.date))
    }, [initialAgendas])

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
                <div className="container mx-auto px-4 py-12 md:py-16">
                    <Breadcrumb items={breadcrumbItems} />
                    <div className="mt-6 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-100 text-[10px] font-bold uppercase tracking-wider border border-white/20">
                            <CalendarDays className="w-3.5 h-3.5" />
                            Jadwal & Agenda
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                            Agenda Kegiatan Puskesmas
                        </h1>
                        <p className="text-blue-100 max-w-2xl text-lg opacity-90 leading-relaxed">
                            Pantau jadwal pelayanan kami, penyuluhan kesehatan, dan berbagai kegiatan operasional
                            Puskesmas lainnya secara transparan.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                    {/* Left Side: Calendar Card */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden sticky top-32 bg-white">
                            <CardHeader className="bg-slate-900 text-white p-6 md:p-8">
                                <CardTitle className="text-xl font-bold flex items-center justify-between">
                                    Pilih Tanggal
                                    <CalendarDays className="w-6 h-6 text-blue-400" />
                                </CardTitle>
                                <CardDescription className="text-slate-300">
                                    Cari kegiatan berdasarkan tanggal
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 md:p-6">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    locale={id}
                                    className="w-full flex justify-center p-0"
                                    modifiers={{ event: eventDays }}
                                    modifiersStyles={{
                                        event: {
                                            fontWeight: "bold",
                                            color: "var(--blue-600)",
                                            textDecoration: "underline",
                                            textDecorationColor: "#3b82f6",
                                            textUnderlineOffset: "4px"
                                        }
                                    }}
                                />

                                <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">Terpilih</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {selectedDate ? format(selectedDate, "d MMMM yyyy", { locale: id }) : "-"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">Kegiatan</p>
                                        <p className="text-sm font-bold text-blue-600 flex items-center gap-1.5">
                                            {filteredAgendas.length} Jadwal
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side: Agenda List */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                List Acara
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            </h2>
                            {selectedDate && (
                                <span className="text-sm text-slate-400 font-medium italic">
                                    Menampilkan agenda pada {format(selectedDate, "eee, d MMM yyyy", { locale: id })}
                                </span>
                            )}
                        </div>

                        {filteredAgendas.length > 0 ? (
                            <div className="space-y-4">
                                {filteredAgendas.map((item) => (
                                    <AgendaDetailItem key={item.id} item={item} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                title="Tidak Ada Jadwal"
                                description={`Tidak ada agenda kegiatan yang terjadwal pada tanggal ${selectedDate ? format(selectedDate, "d MMMM yyyy", { locale: id }) : ""}. Silakan pilih tanggal lain yang di tandai.`}
                                icon={Info}
                                className="bg-slate-50 border-2 border-dashed border-slate-200 py-20 rounded-3xl"
                            />
                        )}

                        {!selectedDate && (
                            <div className="mt-10 p-8 rounded-3xl bg-blue-50 border border-blue-100 text-blue-700 flex flex-col md:flex-row items-center gap-6">
                                <div className="p-4 rounded-2xl bg-white shadow-sm shrink-0">
                                    <CalendarDays className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Pilih tanggal di kalender</h4>
                                    <p className="text-blue-600/70 text-sm">Pilih salah satu tanggal di samping untuk melihat jadwal kegiatan pada hari tersebut secara mendetail.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function AgendaDetailItem({ item }: { item: Agenda }) {
    return (
        <Card className="group relative border-none shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 rounded-2xl bg-white overflow-hidden border-l-4 border-l-blue-500">
            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
                {/* Time Indicator */}
                <div className="md:w-32 flex md:flex-col items-center md:items-start gap-3 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Pukul</p>
                        <p className="text-lg md:text-xl font-extrabold text-blue-600 tracking-tight">
                            {item.time}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                        {item.activity_name}
                    </h3>

                    <div className="flex flex-wrap gap-y-2 gap-x-6">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="font-medium">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Info className="w-4 h-4 text-slate-400" />
                            <span className="font-medium italic">Sifat: {item.effective_date || "Terbuka untuk Umum"}</span>
                        </div>
                    </div>
                </div>

                {/* Action */}
                <Link
                    href={`/agenda/${item.id}`}
                    className="shrink-0 w-full md:w-auto px-6 py-3 rounded-xl bg-slate-50 hover:bg-blue-600 text-slate-900 hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2 group/btn"
                >
                    Detail
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
            </CardContent>
        </Card>
    )
}
