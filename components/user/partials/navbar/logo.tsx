import Image from 'next/image'
import Link from 'next/link'
import { getMediaUrl } from '@/lib/getMediaUrl'

interface LogoProps {
    className?: string;
    webTitle?: string;
    logoUrl?: string;
}

export default function Logo({ className = '', webTitle, logoUrl }: LogoProps) {
    const defaultLogo = "/puskesmasLogo.png";
    const finalLogo = getMediaUrl(logoUrl) || defaultLogo;

    return (
        <Link href="/" className={`flex items-center gap-3 ${className}`}>
            <Image
                src="/puskesmasLogo.png"
                alt="Logo Kota Bogor"
                width={28}
                height={28}
                className="dark:invert"
            />
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                <Image
                    src={finalLogo}
                    alt="Logo Puskesmas"
                    width={28}
                    height={28}
                    className="object-contain"
                    unoptimized
                />
            </div>
            <div className="leading-tight">
                <p className="font-bold text-sm text-primary dark:text-primary-foreground">
                    {webTitle?.split(' ')[0] || "PUSKESMAS"}
                </p>
                <p className="text-[10px] text-muted-foreground dark:text-slate-400 uppercase tracking-wider">
                    {webTitle?.split(' ').slice(1).join(' ') || "Kecamatan Sehat"}
                </p>
            </div>
        </Link>
    )
}
