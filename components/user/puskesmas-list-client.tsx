'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Building2, ArrowRight, Search, X, Globe } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { PaginationControl } from '@/components/pagination-control'
import { getSubdomainUrl } from '@/lib/getSubdomain'

interface Puskesmas {
    id: string
    name: string
    slug: string
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'MAINTENANCE'
}

interface PuskesmasListClientProps {
    initialData: {
        docs: Puskesmas[]
        totalDocs: number
        limit: number
        page: number
        totalPages: number
    }
}

const STATUS_CONFIG = {
    ACTIVE: { label: 'Aktif', className: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    INACTIVE: { label: 'Nonaktif', className: 'bg-slate-50 text-slate-500 border-slate-200' },
    SUSPENDED: { label: 'Ditangguhkan', className: 'bg-red-50 text-red-600 border-red-100' },
    MAINTENANCE: { label: 'Maintenance', className: 'bg-amber-50 text-amber-600 border-amber-100' },
} as const

export function PuskesmasListClient({ initialData }: PuskesmasListClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchValue, setSearchValue] = useState(searchParams.get('q') || '')

    useEffect(() => {
        setSearchValue(searchParams.get('q') || '')
    }, [searchParams])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams(searchParams.toString())
        if (searchValue) {
            params.set('q', searchValue)
            params.set('page', '1')
        } else {
            params.delete('q')
        }
        router.replace(`/puskesmas?${params.toString()}`)
    }

    const handleReset = () => {
        setSearchValue('')
        router.push('/puskesmas')
    }

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page.toString())
        router.push(`/puskesmas?${params.toString()}`)
    }

    const hasSearch = searchParams.has('q')
    const currentPage = Number(searchParams.get('page')) || 1
    const totalPages = initialData.totalPages || 1

    return (
        <div className="w-full">
            {/* Search Bar */}
            <div className="bg-white p-3 rounded-2xl shadow-xl shadow-blue-900/10 border border-slate-200 mb-8">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Cari puskesmas (contoh: Bogor Timur)..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="pl-10 h-11 rounded-xl border-none bg-slate-50 focus-visible:bg-white text-sm w-full transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[11px] transition-all shadow-md shadow-blue-500/20 uppercase tracking-wider"
                        >
                            Cari
                        </button>
                        {hasSearch && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="h-11 px-4 text-slate-500 hover:text-red-600 hover:bg-red-50 bg-slate-50 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List Grid */}
            {initialData.docs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Tidak Ditemukan</h3>
                    <p className="text-sm text-slate-500">Puskesmas tidak terdaftar atau kata kunci salah.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {initialData.docs.map((puskesmas) => {
                        const statusConfig = STATUS_CONFIG[puskesmas.status] ?? STATUS_CONFIG.INACTIVE

                        return (
                            <Link
                                key={puskesmas.id}
                                href={getSubdomainUrl(puskesmas.slug)}
                                className="group flex flex-col bg-white rounded-[2rem] border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/5 hover:border-blue-400/40 hover:-translate-y-1.5"
                            >
                                <div className="p-7 flex-1 flex flex-col">
                                    {/* Header Card */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center transition-colors group-hover:bg-blue-600">
                                            <Building2 className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${statusConfig.className}`}>
                                            ● {statusConfig.label}
                                        </div>
                                    </div>

                                    {/* Body Card */}
                                    <div className="mb-6 flex-1">
                                        <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight mb-2">
                                            {puskesmas.name}
                                        </h2>
                                        <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">
                                            Layanan kesehatan masyarakat terpadu wilayah {puskesmas.name.replace('Puskesmas ', '')}, Kota Bogor.
                                        </p>
                                    </div>

                                    {/* Link Badge */}
                                    <div className="mt-auto flex items-center gap-2 py-2.5 px-3.5 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                                        <Globe className="w-3.5 h-3.5 text-blue-500" />
                                        <span className="text-[11px] font-bold text-slate-600 lowercase">
                                            {puskesmas.slug}.bogorkota.go.id
                                        </span>
                                    </div>
                                </div>

                                {/* Footer Action */}
                                <div className="px-7 py-4 bg-slate-50/50 border-t border-slate-50 group-hover:bg-blue-600 transition-all flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white/90">
                                        Buka Website
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-white transition-transform group-hover:translate-x-1" />
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}

            {/* Pagination */}
            {initialData.docs.length > 0 && totalPages > 1 && (
                <div className="mt-12 pt-8 border-t border-slate-200">
                    <PaginationControl
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                    <p className="text-center text-[11px] text-slate-400 mt-4 font-bold uppercase tracking-widest">
                        Menampilkan {initialData.docs.length} dari {initialData.totalDocs} Puskesmas
                    </p>
                </div>
            )}
        </div>
    )
}