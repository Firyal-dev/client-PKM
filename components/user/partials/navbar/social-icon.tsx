'use client'

import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

interface SocialIconProps {
    className?: string
}

// Dummy social icons - bisa diganti sama data dari database
const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Youtube, href: 'https://youtube.com', label: 'Youtube' },
]

export default function SocialIcon({ className = '' }: SocialIconProps) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {socialLinks.map((social, index) => (
                <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-blue-500 transition-colors"
                    aria-label={social.label}
                >
                    <social.icon size={16} />
                </a>
            ))}
        </div>
    )
}
