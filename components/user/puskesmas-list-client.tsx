'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Building2, ArrowRight, MapPin, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { PaginationControl } from '@/components/pagination-control'
import { getSubdomainUrl } from '@/lib/getSubdomain'

interface Puskesmas {
    id: string
    name: string
    slug: string
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

export function PuskesmasListClient({ initialData }: PuskesmasListClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchValue, setSearchValue] = useState(searchParams.get('q') || '')
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSearching(true)
        const params = new URLSearchParams(searchParams.toString())
        if (searchValue) {
            params.set('q', searchValue)
            params.set('page', '1')
        } else {
            params.delete('q')
        }
        router.push(`/puskesmas?${params.toString()}`)
        setTimeout(() => setIsSearching(false), 500)
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
        <div className="max-w-5xl mx-auto px-6 py-12">
            {/* Search */}
            <form onSubmit={handleSearch} className="mb-8">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Cari puskesmas..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="pl-9 h-11 rounded-xl border-slate-200 bg-white text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors"
                    >
                        Cari
                    </button>
                    {hasSearch && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="h-11 px-4 text-slate-500 hover:text-slate-700 rounded-xl text-sm flex items-center gap-1.5"
                        >
                            <X className="w-4 h-4" /> Reset
                        </button>
                    )}
                </div>
            </form>

            {/* Results Info */}
            {hasSearch && (
                <p className="text-sm text-slate-500 mb-6">
                    Menampilkan hasil pencarian "{searchParams.get('q')}" - {initialData.docs.length} puskesmas ditemukan
                </p>
            )}

            {/* List */}
            {initialData.docs.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                    <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">
                        {hasSearch ? 'Puskesmas tidak ditemukan.' : 'Belum ada puskesmas terdaftar.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {initialData.docs.map((puskesmas: Puskesmas) => (
                        <Link
                            key={puskesmas.id}
                            href={getSubdomainUrl(puskesmas.slug)}
                            className="group block bg-white rounded-2xl border border-slate-100 p-5 hover:border-blue-200 hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors duration-200">
                                    <Building2 className="w-4.5 h-4.5 text-blue-500 group-hover:text-white transition-colors duration-200" />
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all duration-200 mt-1 flex-shrink-0" />
                            </div>

                            <h2 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug mb-1.5">
                                {puskesmas.name}
                            </h2>

                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-slate-300 flex-shrink-0" />
                                <span className="text-[11px] text-slate-400 font-mono">
                                    {puskesmas.slug}.localhost
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {initialData.docs.length > 0 && totalPages > 1 && (
                <div className="mt-10">
                    <PaginationControl
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                    <p className="text-center text-xs text-slate-400 mt-4">
                        Menampilkan {initialData.docs.length} dari {initialData.totalDocs} puskesmas
                    </p>
                </div>
            )}
        </div>
    )
}