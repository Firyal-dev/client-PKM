"use client"

import { useState, useEffect, useMemo } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { PaginationControl } from "@/components/pagination-control"
import { EmptyState } from "@/components/ui/empty-user"
import { MapPin, CalendarDays, ArrowRight, Clock } from "lucide-react"
import { format, isSameDay } from "date-fns"
import { enUS, id } from "date-fns/locale"
import type { Agenda } from "@/types/agenda-prop"
import { TenantLink } from "../partials/tenant-link"
import { useTranslations, useLocale } from "next-intl"

export default function Agenda({ data = [] }: { data: Agenda[] }) {
    const t = useTranslations('Agenda')
    const locale = useLocale()
    const dLocale = locale === 'id' ? id : enUS
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
            <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="block w-6 h-px bg-blue-400" />
                            <span className="text-[10px] font-bold tracking-[0.18em] text-blue-500 uppercase">{t('label')}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{t('title')}</h2>
                        <p className="text-sm text-slate-500">{t('desc')}</p>
                    </div>
                    <TenantLink href={`/agenda`} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group shrink-0">
                        {t('viewAll')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </TenantLink>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <aside className="lg:col-span-5 xl:col-span-4">
                        <CalendarCard
                            date={date}
                            onSelect={setDate}
                            count={filteredAgendas.length}
                            eventDates={eventDates}
                            dLocale={dLocale}
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
                                title={t('emptyTitle')}
                                description={t('emptyDesc')}
                                icon={CalendarDays}
                            />
                        )}

                        <div className="mt-2">
                            <TenantLink
                                href="/agenda"
                                className="inline-flex items-center justify-center w-full py-3 px-6 border border-slate-200 text-slate-500 text-sm font-semibold rounded-xl hover:border-blue-300 hover:text-blue-600 transition-colors"
                            >
                                {t('viewAllSchedule')}
                                <ArrowRight className="w-3.5 h-3.5 ml-2" />
                            </TenantLink>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


interface CalendarCardProps {
    date?: Date
    onSelect: (date: Date | undefined) => void
    count: number
    eventDates: Date[]
    dLocale: any
}

function CalendarCard({ date, onSelect, count, eventDates, dLocale }: CalendarCardProps) {
    const t = useTranslations('Agenda')
    return (
        <div className="sticky top-24 rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
            <div className="px-4 pt-4">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={onSelect}
                    locale={dLocale}
                    className="w-full"
                    modifiers={{ hasEvent: eventDates }}
                />
            </div>

            {/* Summary strip */}
            <div className="mx-4 mb-4 mt-2 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-slate-800">
                        {date ? format(date, "EEEE, d MMMM yyyy", { locale: dLocale }) : "—"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {count > 0
                            ? <span className="text-blue-600 font-semibold">{count} {t('scheduled')}</span>
                            : t('noActivity')
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
        <div className="flex items-stretch gap-0 rounded-xl border border-slate-100 bg-white overflow-hidden shadow-sm/0 transition-all duration-200">
            {/* Time sidebar */}
            <div className="flex flex-col items-center justify-center px-4 py-4 bg-slate-50 border-r border-slate-100 min-w-[72px] text-center">
                <Clock className="w-3.5 h-3.5 text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-700 tabular-nums leading-tight">
                    {item.time}
                </span>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 py-4 min-w-0">
                <h4 className="text-sm font-semibold text-slate-800 line-clamp-1 mb-1">
                    {item.activity_name}
                </h4>
                <div className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="text-xs truncate">{item.location}</span>
                </div>
            </div>
        </div>
    )
}

function PaginationWrapper({ currentPage, totalPages, onPageChange }: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}) {
    const t = useTranslations('Agenda')
    return (
        <div className="pt-4 border-t border-slate-100 space-y-3">
            <PaginationControl
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={onPageChange}
            />
            <p className="text-center text-[10px] text-slate-400 tracking-widest uppercase">
                {t('page', { current: currentPage, total: totalPages })}
            </p>
        </div>
    )
}