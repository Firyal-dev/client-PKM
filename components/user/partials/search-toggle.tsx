'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, Loader2, FileText, Newspaper, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { searchPublicPages } from '@/services/page/page-service'
import Link from 'next/link'

function useScrollState() {
    const [state, setState] = useState('top')
    useEffect(() => {
        const header = document.querySelector('header[data-scroll]')
        if (!header) return
        const update = () => setState(header.getAttribute('data-scroll') ?? 'top')
        const obs = new MutationObserver(update)
        obs.observe(header, { attributes: true, attributeFilter: ['data-scroll'] })
        update()
        return () => obs.disconnect()
    }, [])
    return state
}

export default function SearchToggle() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const scroll = useScrollState()
    const isWhite = scroll === 'up'

    // Fokus input saat dibuka
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 50)
        } else {
            setQuery('')
            setSuggestions([])
        }
    }, [open])

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsLoading(true)
                try {
                    const results = await searchPublicPages(query)
                    setSuggestions(results)
                } catch (error) {
                    console.error('Search error:', error)
                } finally {
                    setIsLoading(false)
                }
            } else {
                setSuggestions([])
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    // Tutup saat tekan Escape atau klik di luar
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
        const onClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        window.addEventListener('keydown', onKey)
        window.addEventListener('mousedown', onClickOutside)
        return () => {
            window.removeEventListener('keydown', onKey)
            window.removeEventListener('mousedown', onClickOutside)
        }
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
        setOpen(false)
    }

    return (
        <div className="hidden lg:flex items-center relative" ref={containerRef}>
            {/* Expanded input */}
            <form
                onSubmit={handleSubmit}
                className={cn(
                    'flex items-center overflow-hidden rounded-xl border transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
                    open ? 'w-64 opacity-100' : 'w-0 opacity-0 pointer-events-none border-transparent',
                    isWhite
                        ? 'bg-slate-100 border-slate-200 focus-within:border-blue-300 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]'
                        : 'bg-white/15 border-white/25 focus-within:bg-white/22 focus-within:border-white/40'
                )}
            >
                {isLoading ? (
                    <Loader2 size={14} className={cn('ml-3 shrink-0 animate-spin', isWhite ? 'text-blue-500' : 'text-white/80')} />
                ) : (
                    <Search
                        size={14}
                        className={cn('ml-3 shrink-0 transition-colors duration-300', isWhite ? 'text-slate-400' : 'text-white/60')}
                    />
                )}
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Cari berita atau pelayanan..."
                    className={cn(
                        'flex-1 bg-transparent px-2.5 py-2 text-[13px] font-medium outline-none placeholder:font-normal',
                        isWhite
                            ? 'text-slate-800 placeholder:text-slate-400'
                            : 'text-white placeholder:text-white/50'
                    )}
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => { setQuery(''); setSuggestions([]) }}
                        className={cn('mr-1 p-1 rounded-lg transition-colors', isWhite ? 'hover:bg-slate-200 text-slate-400' : 'hover:bg-white/20 text-white/60')}
                    >
                        <X size={12} />
                    </button>
                )}
            </form>

            {/* Suggestions Dropdown */}
            {open && suggestions.length > 0 && (
                <div className={cn(
                    "absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200",
                    !isWhite && "mt-3"
                )}>
                    <div className="p-2 max-h-[400px] overflow-y-auto">
                        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Hasil Pencarian
                        </div>
                        {suggestions.map((item) => {
                            // Logic for URL:
                            // 1. Static pages: directly to /[menu-slug]
                            // 2. Dynamic pages (kartu/pdf): to /[menu-slug]/[id]
                            // 3. Dynamic pages (halaman): usually these are single pages for the menu, so /[menu-slug]
                            const detailUrl = (item.is_static || item.type === 'halaman') 
                                ? `/${item.menu_slug}` 
                                : `/${item.menu_slug}/${item.id}`

                            return (
                                <Link
                                    key={`${item.is_static ? 's' : 'd'}-${item.id}`}
                                    href={detailUrl}
                                    onClick={() => setOpen(false)}
                                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                                >
                                    <div className={cn(
                                        "w-9 h-9 shrink-0 rounded-lg flex items-center justify-center transition-colors",
                                        item.category === 'Berita' ? "bg-orange-50 text-orange-600" :
                                        item.category === 'Pelayanan' ? "bg-blue-50 text-blue-600" :
                                        item.category === 'Profil' ? "bg-emerald-50 text-emerald-600" :
                                        "bg-slate-50 text-slate-600"
                                    )}>
                                        {item.category === 'Berita' ? <Newspaper size={18} /> : 
                                         item.category === 'Pelayanan' ? <FileText size={18} /> :
                                         item.category === 'Profil' ? <Search size={18} /> :
                                         <FileText size={18} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className={cn(
                                                "text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase",
                                                item.category === 'Berita' ? "bg-orange-100 text-orange-700" :
                                                item.category === 'Pelayanan' ? "bg-blue-100 text-blue-700" :
                                                item.category === 'Profil' ? "bg-emerald-100 text-emerald-700" :
                                                "bg-slate-100 text-slate-700"
                                            )}>
                                                {item.category}
                                            </span>
                                        </div>
                                        <h4 className="text-[13px] font-semibold text-slate-700 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                            {item.title}
                                        </h4>
                                    </div>
                                    <ArrowRight size={14} className="mt-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* No Results state */}
            {open && query.trim().length >= 2 && !isLoading && suggestions.length === 0 && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 text-center z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search size={24} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-medium text-slate-600">Tidak ada hasil ditemukan</p>
                    <p className="text-xs text-slate-400 mt-1">Coba kata kunci lain</p>
                </div>
            )}

            {/* Toggle button */}
            <button
                onClick={() => setOpen(v => !v)}
                aria-label={open ? 'Tutup pencarian' : 'Buka pencarian'}
                className={cn(
                    'ml-1.5 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200',
                    open
                        ? isWhite
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-white/18 text-white hover:bg-white/28'
                        : isWhite
                            ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                            : 'text-white/75 hover:text-white hover:bg-white/12'
                )}
            >
                <Search size={17} strokeWidth={2.2} className={cn('transition-all duration-200', open && 'scale-90')} />
            </button>
        </div>
    )
}