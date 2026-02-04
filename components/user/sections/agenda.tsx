"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, CalendarDays, ArrowRight } from "lucide-react"
import { format, isSameDay } from "date-fns"
import { id } from "date-fns/locale"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { EmptyState } from "@/components/ui/empty-user"

import { Agenda as AgendaType } from "@/types/agenda-prop"

export default function Agenda({ data = [] }: { data: AgendaType[] }) {
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const [currentPage, setCurrentPage] = React.useState(1)
    const itemsPerPage = 3

    React.useEffect(() => {
        setDate(new Date())
    }, [])

    React.useEffect(() => {
        setCurrentPage(1)
    }, [date])

    const filteredAgendas = data.filter(item =>
        date ? isSameDay(new Date(item.date), date) : false
    )

    const totalPages = Math.ceil(filteredAgendas.length / itemsPerPage)
    const paginatedAgendas = filteredAgendas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handlePageChange = (e: React.MouseEvent, page: number) => {
        e.preventDefault()
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    return (
        <section className="py-15" id="agenda">
            <div className="container mx-auto">
                <div className="flex flex-col items-center text-center mb-12 space-y-3">
                    <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide">
                        Jadwal Kegiatan
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">
                        Agenda Puskesmas
                    </h2>
                    <p className="max-w-2xl text-sm md:text-base text-slate-600 leading-relaxed">
                        Cek jadwal kegiatan dan layanan kesehatan terkini di Puskesmas kami.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
                    <div className="lg:col-span-5 xl:col-span-4">
                        <Card className="border-none shadow-md overflow-hidden rounded-2xl sticky top-24">
                            <CardContent className="p-6 flex flex-col items-center">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="rounded-md border-none w-full flex justify-center p-0"
                                    locale={id}
                                    classNames={{
                                        head_cell: "text-slate-500 font-medium text-sm pt-4 w-10",
                                        cell: "text-center text-sm p-0 relati-ve [&:has([aria-selected])]:bg-transparent focus-within:relative focus-within:z-20",
                                        day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors",
                                        day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white shadow-md",
                                        day_today: "bg-slate-100 text-slate-900 font-bold",
                                    }}
                                />
                                <div className="mt-6 w-full pt-6 border-t border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                        Agenda Terpilih
                                    </p>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex flex-col">
                                            <span className="text-base font-bold text-slate-900 leading-none">
                                                {date ? format(date, "d MMMM yyyy", { locale: id }) : "Belum dipilih"}
                                            </span>
                                            <span className="text-xs text-slate-500 mt-2">
                                                {filteredAgendas.length} Kegiatan Terjadwal
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 shrink-0">
                                            <CalendarDays className="w-5 h-5 text-blue-600" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-3">
                        {paginatedAgendas.length > 0 ? (
                            <>
                                {paginatedAgendas.map((item) => (
                                    <Card
                                        key={item._id}
                                        className="group border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white overflow-hidden"
                                    >
                                        <div className="flex">
                                            {/* Accent line */}
                                            <div className="w-1.5 bg-blue-600 shrink-0" />

                                            <CardContent className="p-4 flex flex-col sm:flex-row gap-4 sm:items-center w-full">
                                                {/* Time Info */}
                                                <div className="flex flex-row sm:flex-col items-center sm:items-start gap-2 sm:gap-0 min-w-[85px]">
                                                    <span className="text-base font-bold text-blue-600 leading-none">{item.time}</span>
                                                    <div className="sm:hidden w-1 h-1 bg-slate-300 rounded-full" />
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.effective_date}</span>
                                                </div>

                                                {/* Divider for Desktop */}
                                                <div className="hidden sm:block h-10 w-[1px] bg-slate-100 mx-2" />

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                                                        {item.activity_name}
                                                    </h4>
                                                    <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                                                        <MapPin className="w-4 h-4 text-blue-400/60" />
                                                        <span className="truncate">{item.location}</span>
                                                    </div>
                                                </div>

                                                <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 group-hover:bg-blue-50 transition-colors">
                                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                                                </div>
                                            </CardContent>
                                        </div>
                                    </Card>
                                ))}

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="mt-4">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        href="#"
                                                        onClick={(e) => handlePageChange(e, currentPage - 1)}
                                                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                    />
                                                </PaginationItem>

                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                    <PaginationItem key={page}>
                                                        <PaginationLink
                                                            href="#"
                                                            isActive={currentPage === page}
                                                            onClick={(e) => handlePageChange(e, page)}
                                                        >
                                                            {page}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                ))}

                                                <PaginationItem>
                                                    <PaginationNext
                                                        href="#"
                                                        onClick={(e) => handlePageChange(e, currentPage + 1)}
                                                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </>
                        ) : (
                            <EmptyState
                                title="Tidak Ada Kegiatan"
                                description="Tidak ada agenda kegiatan yang terjadwal pada tanggal ini."
                                icon={CalendarDays}
                            />
                        )}

                    </div>
                </div>
            </div>
        </section>
    )
}
