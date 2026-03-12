"use client"

import { useState, useMemo } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Calendar } from "@/components/ui/calendar"
import { EmptyState } from "@/components/ui/empty-user"
import { MapPin, CalendarDays, Clock, Info, ChevronRight, ChevronLeft, Calendar as CalendarIcon, X } from "lucide-react"
import { format, isSameDay, eachMonthOfInterval, startOfYear, endOfYear, getYear, setYear } from "date-fns"
import { id } from "date-fns/locale"
import type { Agenda } from "@/types/agenda-prop"
import HeroHeader from "@/components/user/partials/hero-header"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet"

interface AgendaPageContentProps {
    initialAgendas: Agenda[]
}

export default function AgendaPageContent({ initialAgendas }: AgendaPageContentProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [viewYear, setViewYear] = useState(getYear(new Date()))

    const [emblaRef] = useEmblaCarousel({
        align: "start",
        containScroll: "trimSnaps",
        breakpoints: {
            "(min-width: 768px)": { active: false }
        }
    })

    const filteredAgendas = useMemo(() => {
        if (!selectedDate) return []
        return initialAgendas.filter(item => isSameDay(new Date(item.date), selectedDate))
    }, [initialAgendas, selectedDate])

    const eventDays = useMemo(() => {
        return initialAgendas.map(item => new Date(item.date))
    }, [initialAgendas])

    const months = useMemo(() => {
        return eachMonthOfInterval({
            start: startOfYear(setYear(new Date(), viewYear)),
            end: endOfYear(setYear(new Date(), viewYear))
        })
    }, [viewYear])

    const handleSelectDate = (date: Date | undefined) => {
        if (date) {
            const hasEvents = initialAgendas.some(item => isSameDay(new Date(item.date), date))
            setSelectedDate(date)
            if (hasEvents) setIsSheetOpen(true)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <HeroHeader
                items={[{ label: "Agenda" }]}
                title="Agenda & Jadwal"
                description="Lihat seluruh jadwal kegiatan dan pelayanan Puskesmas sepanjang tahun."
                badge={{ icon: CalendarIcon, text: "Jadwal Tahunan" }}
            >
                <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-center backdrop-blur-md w-fit">
                    <p className="text-xl font-bold text-white">{initialAgendas.length}</p>
                    <p className="text-[10px] text-white/70 mt-0.5 uppercase tracking-wider font-semibold">Total Agenda</p>
                </div>
            </HeroHeader>

            <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16 py-10 space-y-8">

                {/* Year Controller */}
                <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 px-5 py-4 shadow-sm">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Kalender {viewYear}</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Klik tanggal bertanda untuk melihat agenda</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewYear(prev => prev - 1)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-bold text-slate-700 min-w-[48px] text-center tabular-nums">
                            {viewYear}
                        </span>
                        <button
                            onClick={() => setViewYear(prev => prev + 1)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* 12 Months View - Carousel on Mobile, Grid on Desktop */}
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex md:grid md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-4">
                        {months.map((monthDate, idx) => {
                            const monthCount = initialAgendas.filter(a => {
                                const d = new Date(a.date)
                                return d.getMonth() === monthDate.getMonth() &&
                                    d.getFullYear() === monthDate.getFullYear()
                            }).length

                            return (
                                <div
                                    key={idx}
                                    className="min-w-0 flex-[0_0_100%] md:flex-none bg-white rounded-xl border border-slate-100 overflow-hidden hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                                >
                                    {/* Month header */}
                                    <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100 bg-slate-50/30">
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                            {format(monthDate, "MMMM", { locale: id })}
                                        </span>
                                        {monthCount > 0 ? (
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 tabular-nums">
                                                {monthCount}
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-slate-300 font-medium">—</span>
                                        )}
                                    </div>

                                    {/* Calendar */}
                                    <div className="p-1">
                                        <Calendar
                                            mode="single"
                                            month={monthDate}
                                            disableNavigation
                                            selected={selectedDate}
                                            onSelect={handleSelectDate}
                                            locale={id}
                                            className="w-full p-0 [--cell-size:28px] md:[--cell-size:30px]"
                                            modifiers={{ hasEvent: eventDays }}
                                            modifiersClassNames={{
                                                hasEvent: "font-bold text-blue-600 underline underline-offset-2 decoration-blue-400"
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Mobile Hint */}
                <div className="flex md:hidden items-center justify-center gap-2 py-2">
                    <ChevronLeft className="w-3.5 h-3.5 text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Geser untuk bulan lain</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </div>
            </div>

            {/* Detail Drawer */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-md w-full p-0 flex flex-col">
                    {/* Header */}
                    <SheetHeader className="bg-slate-900 text-white px-6 py-6 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="w-9 h-9 rounded-lg bg-blue-600/20 flex items-center justify-center">
                                <CalendarDays className="w-5 h-5 text-blue-400" />
                            </div>
                            <button
                                onClick={() => setIsSheetOpen(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div>
                            <SheetTitle className="text-xl font-bold text-white leading-tight">
                                {selectedDate ? format(selectedDate, "EEEE, d MMMM yyyy", { locale: id }) : ""}
                            </SheetTitle>
                            <SheetDescription className="text-white/50 text-sm mt-1">
                                {filteredAgendas.length} kegiatan terjadwal
                            </SheetDescription>
                        </div>
                    </SheetHeader>

                    {/* Agenda list */}
                    <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3 bg-slate-50">
                        {filteredAgendas.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl border border-slate-100 p-4 hover:border-blue-200 transition-colors"
                            >
                                {/* Time badge */}
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-50 text-blue-600 w-fit">
                                        <Clock className="w-3 h-3" />
                                        <span className="text-[11px] font-bold tabular-nums">{item.time} WIB</span>
                                    </div>
                                    <div className="h-px flex-1 bg-slate-100" />
                                </div>

                                <h4 className="text-sm font-bold text-slate-800 leading-snug mb-3">
                                    {item.activity_name}
                                </h4>

                                <div className="space-y-1.5">
                                    <div className="flex items-start gap-2 text-xs text-slate-500">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                        <span>{item.location}</span>
                                    </div>
                                    {item.effective_date && (
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Info className="w-3.5 h-3.5 shrink-0" />
                                            <span>{item.effective_date}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-4 bg-white border-t border-slate-100">
                        <button
                            onClick={() => setIsSheetOpen(false)}
                            className="w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors"
                        >
                            Tutup
                        </button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}