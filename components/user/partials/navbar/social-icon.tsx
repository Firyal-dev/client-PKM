'use client'

import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

interface SocialIconProps {
    className?: string;
    socialLinks?: {
        facebook?: string | null;
        instagram?: string | null;
        twitter?: string | null;
        youtube?: string | null;
    };
}

export default function SocialIcon({ className = '', socialLinks }: SocialIconProps) {
    const icons = [
        { icon: Facebook, href: socialLinks?.facebook, label: 'Facebook' },
        { icon: Instagram, href: socialLinks?.instagram, label: 'Instagram' },
        { icon: Twitter, href: socialLinks?.twitter, label: 'Twitter' },
        { icon: Youtube, href: socialLinks?.youtube, label: 'Youtube' },
    ].filter(link => link.href && link.href !== '');

    if (icons.length === 0) return null;

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {icons.map((social, index) => (
                <a
                    key={index}
                    href={social.href as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-blue-500 transition-colors"
                    aria-label={social.label}
                >
                    <social.icon size={16} />
                </a>
            ))}
        </div>
    )
}
