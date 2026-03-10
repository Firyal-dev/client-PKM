"use client"

import { useState, useEffect, useMemo } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { PaginationControl } from "@/components/pagination-control"
import { EmptyState } from "@/components/ui/empty-user"
import { MapPin, CalendarDays, ArrowRight, Clock } from "lucide-react"
import { format, isSameDay } from "date-fns"
import { id } from "date-fns/locale"
import type { Agenda } from "@/types/agenda-prop"
import Link from "next/link"

export default function Agenda({ data = [] }: { data: Agenda[] }) {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 3

    const eventDates = useMemo(() => {
        return data.map(item => new Date(item.date))
    }, [data])

    const filteredAgendas = useMemo(() => {
        return data.filter(item =>
            date ? isSameDay(new Date(item.date), date) : false
        )
    }, [data, date])

    useEffect(() => {
        setCurrentPage(1)
    }, [date])

    const totalPages = Math.ceil(filteredAgendas.length / itemsPerPage)
    const paginatedAgendas = filteredAgendas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <section className="py-16 md:py-24 bg-white" id="agenda">
            <div className="container mx-auto px-6 md:px-12 lg:px-16">
                <HeaderSection />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
                    <aside className="lg:col-span-5 xl:col-span-4">
                        <CalendarCard
                            date={date}
                            onSelect={setDate}
                            count={filteredAgendas.length}
                            eventDates={eventDates}
                        />
                    </aside>

                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-3">
                        {paginatedAgendas.length > 0 ? (
                            <>
                                {paginatedAgendas.map((item) => (
                                    <AgendaItem key={item.id} item={item} />
                                ))}
                                {totalPages > 1 && (
                                    <PaginationWrapper
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                )}
                            </>
                        ) : (
                            <EmptyState
                                title="Tidak Ada Kegiatan"
                                description="Tidak ada agenda kegiatan yang terjadwal pada tanggal ini."
                                icon={CalendarDays}
                            />
                        )}

                        <div className="mt-2">
                            <Link
                                href="/agenda"
                                className="inline-flex items-center justify-center w-full py-3 px-6 border border-slate-200 text-slate-500 text-sm font-semibold rounded-xl hover:border-blue-300 hover:text-blue-600 transition-colors"
                            >
                                Lihat Semua Jadwal
                                <ArrowRight className="w-3.5 h-3.5 ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function HeaderSection() {
    return (
        <div className="flex flex-col items-center text-center mb-12 space-y-3">
            <div className="flex items-center gap-2">
                <span className="block w-6 h-px bg-blue-400" />
                <span className="text-[11px] font-bold tracking-[0.14em] text-blue-500 uppercase">
                    Agenda Kegiatan
                </span>
                <span className="block w-6 h-px bg-blue-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                Jadwal & Agenda Puskesmas
            </h2>
            <p className="max-w-lg text-sm text-slate-500 leading-relaxed">
                Informasi jadwal pelayanan luar gedung dan kegiatan puskesmas lainnya.
            </p>
        </div>
    )
}

interface CalendarCardProps {
    date?: Date
    onSelect: (date: Date | undefined) => void
    count: number
    eventDates: Date[]
}

function CalendarCard({ date, onSelect, count, eventDates }: CalendarCardProps) {
    return (
        <div className="sticky top-24 rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
            <div className="px-4 pt-4">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={onSelect}
                    locale={id}
                    className="w-full"
                    modifiers={{ hasEvent: eventDates }}
                />
            </div>

            {/* Summary strip */}
            <div className="mx-4 mb-4 mt-2 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-slate-800">
                        {date ? format(date, "EEEE, d MMMM yyyy", { locale: id }) : "—"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {count > 0
                            ? <span className="text-blue-600 font-semibold">{count} kegiatan terjadwal</span>
                            : "Tidak ada kegiatan"
                        }
                    </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <CalendarDays className="w-4 h-4 text-blue-500" />
                </div>
            </div>
        </div>
    )
}

function AgendaItem({ item }: { item: Agenda }) {
    return (
        <Link href={`/agenda/${item.id}`} className="group block">
            <div className="flex items-stretch gap-0 rounded-xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all duration-200 overflow-hidden">

                {/* Time sidebar */}
                <div className="flex flex-col items-center justify-center px-4 py-4 bg-slate-50 border-r border-slate-100 min-w-[72px] text-center">
                    <Clock className="w-3.5 h-3.5 text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-slate-700 tabular-nums leading-tight">
                        {item.time}
                    </span>
                </div>

                {/* Content */}
                <div className="flex-1 px-4 py-4 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                        {item.activity_name}
                    </h4>
                    <div className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="text-xs truncate">{item.location}</span>
                    </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center pr-4">
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
            </div>
        </Link>
    )
}

function PaginationWrapper({ currentPage, totalPages, onPageChange }: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}) {
    return (
        <div className="pt-4 border-t border-slate-100 space-y-3">
            <PaginationControl
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={onPageChange}
            />
            <p className="text-center text-[10px] text-slate-400 tracking-widest uppercase">
                Halaman {currentPage} dari {totalPages}
            </p>
        </div>
    )
}