'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header className={cn(
            "sticky top-0 z-[100] w-full transition-all duration-300",
            isScrolled
                ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
                : "bg-white border-b border-slate-100"
        )}>
            {children}
        </header>
    )
}   