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

const agendas = [
    {
        id: 1,
        title: "Rapat Koordinasi Bulanan",
        date: new Date(2026, 1, 2),
        time: "08:00 - 10:00 WIB",
        location: "Ruang Rapat Lt. 2",
        description: "Evaluasi kinerja bulanan seluruh staf Puskesmas.",
        category: "Internal"
    },
    {
        id: 2,
        title: "Penyuluhan Kesehatan Gigi Anak",
        date: new Date(2026, 1, 2),
        time: "08:00 - 11:00 WIB",
        location: "Aula Utama Puskesmas",
        description: "Kegiatan pemeriksaan dan edukasi kesehatan gigi untuk anak-anak usia dini.",
        category: "Penyuluhan"
    },
    {
        id: 3,
        title: "Vaksinasi Lansia Tahap 2",
        date: new Date(2026, 1, 2),
        time: "09:00 - 14:00 WIB",
        location: "Ruang Vaksinasi",
        description: "Pemberian dosis kedua vaksin booster untuk lansia di wilayah Bogor Tengah.",
        category: "Vaksinasi"
    },
    {
        id: 4,
        title: "Senam Prolanis Bersama",
        date: new Date(2026, 1, 2),
        time: "06:30 - 08:30 WIB",
        location: "Halaman Depan Puskesmas",
        description: "Program pengelolaan penyakit kronis melalui aktivitas fisik bersama.",
        category: "Olahraga"
    },
    {
        id: 5,
        title: "Posyandu Balita Mawar",
        date: new Date(2026, 1, 2),
        time: "09:00 - 12:00 WIB",
        location: "Posyandu Mawar RW 03",
        description: "Penimbangan berat badan dan imunisasi rutin balita.",
        category: "Posyandu"
    },
    {
        id: 6,
        title: "Kunjungan Dokter Spesialis",
        date: new Date(2026, 1, 12),
        time: "10:00 - 12:00 WIB",
        location: "Poli Spesialis",
        description: "Kunjungan rutin dokter spesialis penyakit dalam.",
        category: "Medis"
    }
]

export default function Agenda() {
    // Initialize with undefined to prevent hydration mismatch (server date vs client date)
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const [currentPage, setCurrentPage] = React.useState(1)
    const itemsPerPage = 3

    // Set default date on client side mount
    React.useEffect(() => {
        setDate(new Date())
    }, [])

    // Reset pagination when date changes
    React.useEffect(() => {
        setCurrentPage(1)
    }, [date])

    // Filter agendas based on selected date
    const filteredAgendas = agendas.filter(item =>
        date ? isSameDay(item.date, date) : false
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
        <section className="py-24 bg-slate-50" id="agenda">
            <div className="container mx-auto">
                <div className="flex flex-col items-center text-center mb-16 space-y-4">
                    <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide">
                        Jadwal Kegiatan
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                        Agenda Puskesmas
                    </h2>
                    <p className="max-w-2xl text-slate-600">
                        Cek jadwal kegiatan dan layanan kesehatan terkini di Puskesmas kami.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
                    {/* Left Column: Calendar */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <Card className="border-none shadow-lg overflow-hidden rounded-3xl sticky top-24">
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
                                    <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                                        <span>Tanggal Terpilih:</span>
                                    </div>
                                    <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <CalendarDays className="w-5 h-5 text-blue-600" />
                                        {date ? format(date, "d MMMM yyyy", { locale: id }) : "Belum dipilih"}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Activity List */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-slate-900">
                                Kegiatan Hari Ini
                            </h3>
                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                {filteredAgendas.length} Kegiatan
                            </span>
                        </div>

                        {paginatedAgendas.length > 0 ? (
                            <>
                                {paginatedAgendas.map((item) => (
                                    <Card
                                        key={item.id}
                                        className="group border border-slate-100 shadow-sm hover:shadow-md transition rounded-xl bg-white"
                                    >
                                        <CardContent className="p-4 flex gap-4 items-start">
                                            {/* Time */}
                                            <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-600 rounded-xl w-16 h-16 shrink-0 border border-blue-100 text-center group-hover:bg-blue-600 group-hover:text-white transition">
                                                <span className="text-[10px] font-semibold">
                                                    {item.time.split(" - ")[0]}
                                                </span>
                                                <span className="text-[9px] opacity-80">
                                                    {item.time.split(" - ")[1]}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 space-y-1">
                                                <h4 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition leading-tight">
                                                    {item.title}
                                                </h4>
                                                <p className="text-sm md:text-base text-slate-600 line-clamp-2">
                                                    {item.description}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-sm text-slate-500 pt-1">
                                                    <MapPin className="w-4 h-4 text-blue-500" />
                                                    <span className="font-medium">{item.location}</span>
                                                </div>
                                            </div>
                                        </CardContent>
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
                            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <CalendarDays className="w-8 h-8 text-slate-300" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-1">
                                    Tidak Ada Kegiatan
                                </h4>
                                <p className="text-slate-500 max-w-xs mx-auto">
                                    Tidak ada agenda kegiatan yang terjadwal pada tanggal ini.
                                </p>
                            </div>
                        )}

                        {filteredAgendas.length > 0 && totalPages <= 1 && (
                            <Button variant="ghost" className="w-full mt-4 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                                Lihat Semua Agenda Bulan Ini <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
