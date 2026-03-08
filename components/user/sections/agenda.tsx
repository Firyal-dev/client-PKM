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

    // Filter data
    const filteredAgendas = useMemo(() => {
        return data.filter(item =>
            date ? isSameDay(new Date(item.date), date) : false
        )
    }, [data, date])

    // Reset page tiap ganti tanggal
    useEffect(() => {
        setCurrentPage(1)
    }, [date])

    // Pagination Logic
    const totalPages = Math.ceil(filteredAgendas.length / itemsPerPage)
    const paginatedAgendas = filteredAgendas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <section className="py-12 md:py-16 bg-slate-50" id="agenda">
            <div className="container mx-auto px-6 md:px-12 lg:px-16">
                <HeaderSection />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
                    {/* Kalender */}
                    <aside className="lg:col-span-5 xl:col-span-4">
                        <CalendarCard
                            date={date}
                            onSelect={setDate}
                            count={filteredAgendas.length}
                        />
                    </aside>

                    {/* List Agenda */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
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

                        <div className="mt-4">
                            <Link
                                href="/agenda"
                                className="inline-flex items-center justify-center w-full py-3 px-6 border-2 border-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-colors"
                            >
                                Lihat Semua Jadwal
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// Header
function HeaderSection() {
    return (
        <div className="flex flex-col items-center text-center mb-8 space-y-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide">
                Agenda Kegiatan
            </span>
            <h2 className="text-xl md:text-3xl font-bold tracking-tight text-slate-900">
                Jadwal & Agenda Puskesmas
            </h2>
            <p className="max-w-2xl text-sm md:text-base text-slate-600 leading-relaxed">
                Informasi jadwal pelayanan luar gedung dan kegiatan puskesmas lainnya.
            </p>
        </div>
    )
}

// Calendar
interface CalendarCardProps {
    date?: Date;
    onSelect: (date: Date | undefined) => void;
    count: number;
}

function CalendarCard({ date, onSelect, count }: CalendarCardProps) {
    return (
        <Card className="border-slate-100 shadow-sm rounded-xl sticky top-24">
            <CardContent className="p-3">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={onSelect}
                    locale={id}
                    className="w-full flex justify-center"
                />

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-900">
                            {date ? format(date, "d MMM yyyy", { locale: id }) : "-"}
                        </p>
                        <p className="text-xs text-blue-600 font-medium">
                            {count} kegiatan
                        </p>
                    </div>

                    <CalendarDays className="w-4 h-4 text-blue-600" />
                </div>
            </CardContent>
        </Card>
    )
}

// Agenda Item
function AgendaItem({ item }: { item: Agenda }) {
    return (
        <Link href={`/agenda/${item.id}`} className="group">
            <Card className="border border-slate-100 hover:border-blue-200 hover:shadow-sm transition rounded-xl">
                <CardContent className="p-3 flex items-center gap-3">
                    {/* Waktu */}
                    <div className="min-w-[60px] text-blue-600 font-bold text-xs">
                        {item.time}
                    </div>

                    {/* Konten */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                            {item.activity_name}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{item.location}</span>
                        </p>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 shrink-0" />
                </CardContent>
            </Card>
        </Link>
    )
}

// Pagination
function PaginationWrapper({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) {
    return (
        <div className="mt-6 py-4 border-t border-slate-100">
            <PaginationControl
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={onPageChange}
            />
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">
                Halaman {currentPage} dari {totalPages}
            </p>
        </div>
    )
}