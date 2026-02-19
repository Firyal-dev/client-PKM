import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
    className?: string
}

export default function Logo({ className = '' }: LogoProps) {
    return (
        <Link href="/" className={`flex items-center gap-3 ${className}`}>
            <Image
                src="/kotabogor.webp"
                alt="Logo Kota Bogor"
                width={28}
                height={28}
                className="dark:invert"
            />
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Image
                    src="/puskesmasLogo.png"
                    alt="Logo Puskesmas"
                    width={28}
                    height={28}
                />
            </div>
            <div className="leading-tight">
                <p className="font-bold text-sm text-primary dark:text-primary-foreground">
                    PUSKESMAS
                </p>
                <p className="text-[10px] text-muted-foreground dark:text-slate-400 uppercase tracking-wider">
                    Kecamatan Sehat
                </p>
            </div>
        </Link>
    )
}
