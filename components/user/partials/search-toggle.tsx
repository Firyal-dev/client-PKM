'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

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
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const scroll = useScrollState()
    const isWhite = scroll === 'up'

    // Fokus input saat dibuka
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 50)
        } else {
            setQuery('')
        }
    }, [open])

    // Tutup saat tekan Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
        setOpen(false)
    }

    return (
        <div className="hidden lg:flex items-center relative">
            {/* Expanded input */}
            <form
                onSubmit={handleSubmit}
                className={cn(
                    'flex items-center overflow-hidden rounded-xl border transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
                    open ? 'w-56 opacity-100' : 'w-0 opacity-0 pointer-events-none border-transparent',
                    isWhite
                        ? 'bg-slate-100 border-slate-200 focus-within:border-blue-300 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]'
                        : 'bg-white/15 border-white/25 focus-within:bg-white/22 focus-within:border-white/40'
                )}
            >
                <Search
                    size={14}
                    className={cn('ml-3 shrink-0 transition-colors duration-300', isWhite ? 'text-slate-400' : 'text-white/60')}
                />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Cari..."
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
                        onClick={() => setQuery('')}
                        className={cn('mr-1 p-1 rounded-lg transition-colors', isWhite ? 'hover:bg-slate-200 text-slate-400' : 'hover:bg-white/20 text-white/60')}
                    >
                        <X size={12} />
                    </button>
                )}
            </form>

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