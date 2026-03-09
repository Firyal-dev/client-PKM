'use client'

import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface SocialIconProps {
    className?: string
    socialLinks?: {
        facebook?: string | null
        instagram?: string | null
        twitter?: string | null
        youtube?: string | null
    }
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

export default function SocialIcon({ className = '', socialLinks }: SocialIconProps) {
    const scroll = useScrollState()
    const isWhite = scroll === 'up'

    const icons = [
        { icon: Facebook, href: socialLinks?.facebook, label: 'Facebook' },
        { icon: Instagram, href: socialLinks?.instagram, label: 'Instagram' },
        { icon: Twitter, href: socialLinks?.twitter, label: 'Twitter' },
        { icon: Youtube, href: socialLinks?.youtube, label: 'Youtube' },
    ].filter(l => l.href && l.href !== '')

    if (icons.length === 0) return null

    return (
        <div className={cn('flex items-center gap-0.5', className)}>
            {icons.map((s, i) => (
                <a
                    key={i}
                    href={s.href as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200',
                        isWhite
                            ? 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                            : 'text-white/60 bg-white/10 hover:bg-white/20 hover:text-white'
                    )}
                >
                    <s.icon size={13} />
                </a>
            ))}
        </div>
    )
}