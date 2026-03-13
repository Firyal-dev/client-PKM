'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

type ScrollState = 'top' | 'hidden' | 'up'

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isHome = pathname === '/'
    
    const [state, setState] = useState<ScrollState>(isHome ? 'top' : 'up')
    const lastY = useRef(0)

    useEffect(() => {
        if (!isHome) {
            setState('up')
        } else {
            setState(window.scrollY <= 10 ? 'top' : 'up')
        }

        const onScroll = () => {
            const y = window.scrollY
            if (isHome && y <= 10) {
                setState('top')
            } else if (y > lastY.current && y > 100) {
                setState('hidden')
            } else {
                setState('up')
            }
            lastY.current = y
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [isHome, pathname])

    return (
        <header
            data-scroll={state}
            className={cn(
                'fixed top-0 left-0 right-0 z-[100]',
                'transition-all duration-[450ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
                state === 'top' && 'bg-transparent',
                state === 'hidden' && '-translate-y-full opacity-0 pointer-events-none',
                state === 'up' && [
                    'bg-white/96 backdrop-blur-xl border-b border-slate-100',
                    'shadow-[0_1px_0_rgba(0,0,0,0.06),0_8px_32px_rgba(0,60,150,0.08)]'
                ],
            )}
        >
            {children}
        </header>
    )
}