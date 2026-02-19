'use client'

import { useState, useEffect } from 'react'

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 50)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header
            className={`
        sticky top-0 z-[100]
        transition-all duration-500 ease-in-out
        group ${isScrolled ? 'is-scrolled' : ''}
      `}
        >
            {children}
        </header>
    )
}
