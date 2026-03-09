import Image from 'next/image'
import Link from 'next/link'
import { getMediaUrl } from '@/lib/getMediaUrl'

interface LogoProps {
    className?: string
    webTitle?: string
    logoUrl?: string
}

export default function Logo({ className = '', webTitle, logoUrl }: LogoProps) {
    const defaultLogo = "/puskesmasLogo.png"
    const finalLogo = getMediaUrl(logoUrl) || defaultLogo

    const titleParts = webTitle?.split(' ') || []
    const firstWord = titleParts[0] || "PUSKESMAS"
    const rest = titleParts.slice(1).join(' ') || "Kecamatan Sehat"

    return (
        <Link href="/" className={`flex items-center gap-3 group ${className}`}>
            {/* Logo kota */}
            <Image
                src="/logokotabogor.jpg"
                alt="Logo Kota Bogor"
                width={32}
                height={32}
                className="shrink-0"
            />

            {/* Divider */}
            <div className="w-px h-8 bg-slate-200" />

            {/* Logo puskesmas */}
            <div className="w-9 h-9 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center overflow-hidden shrink-0">
                <Image
                    src={finalLogo}
                    alt="Logo Puskesmas"
                    width={28}
                    height={28}
                    className="object-contain"
                    unoptimized
                />
            </div>

            {/* Nama */}
            <div className="leading-tight">
                <p className="font-bold text-sm text-slate-800 group-hover:text-primary transition-colors">
                    {firstWord}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                    {rest}
                </p>
            </div>
        </Link>
    )
}