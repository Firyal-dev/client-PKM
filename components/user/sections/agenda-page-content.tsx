"use client"

import { useState, useMemo } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-user"
import Breadcrumb from "@/components/user/partials/breadcrumb"
import { MapPin, CalendarDays, Clock, Info, ChevronRight } from "lucide-react"
import { format, isSameDay } from "date-fns"
import { id } from "date-fns/locale"
import type { Agenda } from "@/types/agenda-prop"

interface AgendaPageContentProps {
    initialAgendas: Agenda[]
}

export default function AgendaPageContent({ initialAgendas }: AgendaPageContentProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

    const breadcrumbItems = [{ label: "Agenda" }]

    const filteredAgendas = useMemo(() => {
        if (!selectedDate) return []
        return initialAgendas.filter(item => isSameDay(new Date(item.date), selectedDate))
    }, [initialAgendas, selectedDate])

    const eventDays = useMemo(() => initialAgendas.map(item => new Date(item.date)), [initialAgendas])

    const totalEvents = initialAgendas.length
    const upcomingCount = initialAgendas.filter(a => new Date(a.date) >= new Date()).length

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
                <div className="container mx-auto px-4 py-12 md:py-16">
                    <Breadcrumb items={breadcrumbItems} />
                    <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-100 text-[10px] font-bold uppercase tracking-wider border border-white/20">
                                <CalendarDays className="w-3.5 h-3.5" />
                                Jadwal &amp; Agenda
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                                Agenda Kegiatan
                            </h1>
                            <p className="text-blue-100 max-w-2xl text-lg opacity-90 leading-relaxed">
                                Pantau jadwal pelayanan kami, penyuluhan kesehatan, dan berbagai kegiatan operasional Puskesmas secara transparan.
                            </p>
                        </div>

                        {/* Stats chips */}
                        <div className="flex gap-3 shrink-0">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 text-center">
                                <p className="text-2xl font-extrabold">{totalEvents}</p>
                                <p className="text-xs text-blue-100 mt-0.5">Total Agenda</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 text-center">
                                <p className="text-2xl font-extrabold">{upcomingCount}</p>
                                <p className="text-xs text-blue-100 mt-0.5">Akan Datang</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Calendar Column */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <Card className="border-none shadow-md rounded-3xl overflow-hidden sticky top-28 bg-white">
                            <div className="bg-blue-600 px-5 py-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-blue-100 uppercase tracking-widest">Pilih Tanggal</p>
                                    <p className="text-white font-semibold text-sm mt-0.5">
                                        {selectedDate
                                            ? format(selectedDate, "EEEE, d MMMM yyyy", { locale: id })
                                            : "Belum ada tanggal dipilih"}
                                    </p>
                                </div>
                                <div className="p-2.5 bg-white/15 rounded-xl">
                                    <CalendarDays className="w-5 h-5 text-white" />
                                </div>
                            </div>

                            <CardContent className="p-3">
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
                                            color: "#2563eb",
                                            textDecoration: "underline",
                                            textDecorationColor: "#3b82f6",
                                            textUnderlineOffset: "4px",
                                        }
                                    }}
                                />
                            </CardContent>

                            {/* Footer info */}
                            <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                                <div className="bg-slate-50 rounded-lg p-2.5">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Kegiatan Hari Ini</p>
                                    <p className="text-lg font-extrabold text-blue-600 mt-0.5">{filteredAgendas.length}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tandai Kalender</p>
                                    <p className="text-[11px] font-semibold text-slate-600 mt-0.5 leading-tight">Tanggal bergaris = ada kegiatan</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Events Column */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-5">
                        {/* Section Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Daftar Kegiatan</h2>
                                {selectedDate && (
                                    <p className="text-sm text-slate-400 mt-0.5">
                                        {format(selectedDate, "EEEE, d MMMM yyyy", { locale: id })}
                                    </p>
                                )}
                            </div>
                            {filteredAgendas.length > 0 && (
                                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100">
                                    {filteredAgendas.length} kegiatan
                                </span>
                            )}
                        </div>

                        {filteredAgendas.length > 0 ? (
                            <div className="space-y-4">
                                {filteredAgendas.map((item, idx) => (
                                    <AgendaCard key={item.id} item={item} index={idx} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                title="Tidak Ada Kegiatan"
                                description={`Tidak ada agenda yang terjadwal pada ${selectedDate ? format(selectedDate, "d MMMM yyyy", { locale: id }) : "tanggal ini"}. Pilih tanggal yang bertanda garis bawah di kalender.`}
                                icon={Info}
                                className="bg-white border border-dashed border-slate-200 py-20 rounded-3xl"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function AgendaCard({ item, index }: { item: Agenda; index: number }) {
    return (
        <Card className="group border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white overflow-hidden">
            <CardContent className="p-0 flex">
                {/* Left accent bar + time */}
                <div className="w-20 sm:w-24 shrink-0 bg-blue-50 flex flex-col items-center justify-center py-4 gap-1 border-r border-blue-100">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <p className="text-sm font-extrabold text-blue-600 tabular-nums leading-none">{item.time}</p>
                    <p className="text-[10px] text-blue-400 font-semibold">WIB</p>
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-4">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Kegiatan #{index + 1}
                            </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                            {item.activity_name}
                        </h3>
                        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{item.location}</span>
                            </div>
                            {item.effective_date && (
                                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="italic">{item.effective_date}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-blue-600 flex items-center justify-center transition-colors duration-200">
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
