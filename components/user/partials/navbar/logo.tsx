'use client'

import Image from 'next/image'
import { TenantLink } from '@/components/user/partials/tenant-link'
import { getMediaUrl } from '@/lib/getMediaUrl'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
    className?: string
    webTitle?: string
    logoUrl?: string
}

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

export default function Logo({ className = '', webTitle, logoUrl }: LogoProps) {
    const scroll = useScrollState()
    const isWhite = scroll === 'up'

    const defaultLogo = '/puskesmasLogo.png'
    const finalLogo = getMediaUrl(logoUrl) || defaultLogo
    const titleParts = webTitle?.split(' ') ?? []
    const firstWord = titleParts[0] ?? 'Puskesmas'
    const rest = titleParts.slice(1).join(' ') || 'Kecamatan Sehat'

    return (
        <TenantLink href="/" className={cn('flex items-center gap-3 group flex-shrink-0', className)}>
            {/* Logo kota */}
            <div className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden border transition-all duration-[450ms] shrink-0',
                isWhite ? 'bg-slate-100 border-slate-200' : 'bg-white/15 border-white/20'
            )}>
                <Image src="/kotabogor.webp" alt="Logo Kota Bogor" width={28} height={28} className="object-contain" />
            </div>

            {/* Divider */}
            <div className={cn(
                'w-px h-7 transition-all duration-[450ms]',
                isWhite ? 'bg-slate-200' : 'bg-white/25'
            )} />

            {/* Logo puskesmas */}
            <div className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden border transition-all duration-[450ms] shrink-0',
                isWhite ? 'bg-blue-50 border-blue-100' : 'bg-white/15 border-white/20'
            )}>
                <Image src={finalLogo} alt="Logo Puskesmas" width={28} height={28} className="object-contain" unoptimized />
            </div>

            {/* Teks */}
            <div className="leading-none">
                <p className={cn(
                    'font-bold text-[15px] tracking-tight transition-all duration-[450ms]',
                    isWhite
                        ? 'text-slate-800 group-hover:text-blue-700'
                        : 'text-white'
                )}>
                    {firstWord}
                </p>
                <p className={cn(
                    'text-[9px] font-semibold uppercase tracking-[0.12em] mt-1 transition-all duration-[450ms]',
                    isWhite ? 'text-slate-400' : 'text-white/55'
                )}>
                    {rest}
                </p>
            </div>
        </TenantLink>
    )
}