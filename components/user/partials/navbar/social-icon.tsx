'use client'

import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SocialIconProps {
    className?: string
    socialLinks?: {
        facebook?: string | null
        instagram?: string | null
        twitter?: string | null
        youtube?: string | null
    }
}

export default function SocialIcon({ className = '', socialLinks }: SocialIconProps) {
    const icons = [
        { icon: Facebook, href: socialLinks?.facebook, label: 'Facebook' },
        { icon: Instagram, href: socialLinks?.instagram, label: 'Instagram' },
        { icon: Twitter, href: socialLinks?.twitter, label: 'Twitter' },
        { icon: Youtube, href: socialLinks?.youtube, label: 'Youtube' },
    ].filter(link => link.href && link.href !== '')

    if (icons.length === 0) return null

    return (
        <div className={cn("flex items-center gap-1.5", className)}>
            {icons.map((social, index) => (
                <a
                    key={index}
                    href={social.href as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/8 transition-all duration-200"
                >
                    <social.icon size={15} />
                </a>
            ))}
        </div>
    )
}