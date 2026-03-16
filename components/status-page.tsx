'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RefreshCw, Home } from 'lucide-react'
import { useState } from 'react'

interface StatusPageProps {
    type: 'suspended' | 'maintenance' | 'inactive'
    pkmName: string
    message: string
}

const CONFIG = {
    suspended: {
        bg: 'bg-red-600',
        lightBg: 'bg-red-50',
        border: 'border-red-100',
        badge: 'bg-red-100 text-red-700',
        msgBorder: 'border-red-200',
        msgLabel: 'text-red-500',
        btnPrimary: 'bg-red-600 hover:bg-red-700 text-white',
        label: 'Ditangguhkan',
        title: 'Website Ditangguhkan',
        subtitle: 'Akses ke sistem informasi puskesmas ini telah ditangguhkan sementara oleh administrator.',
        msgTitle: 'Informasi Administrator',
        icon: (
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
        ),
        patternColor: 'rgba(239,68,68,0.06)',
    },
    maintenance: {
        bg: 'bg-blue-600',
        lightBg: 'bg-blue-50',
        border: 'border-blue-100',
        badge: 'bg-blue-100 text-blue-700',
        msgBorder: 'border-blue-100',
        msgLabel: 'text-blue-500',
        btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
        label: 'Maintenance',
        title: 'Sedang Dalam Pemeliharaan',
        subtitle: 'Kami sedang melakukan perawatan sistem untuk meningkatkan stabilitas dan kualitas layanan.',
        msgTitle: 'Estimasi & Keterangan',
        icon: (
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        patternColor: 'rgba(37,99,235,0.06)',
    },
    inactive: {
        bg: 'bg-slate-700',
        lightBg: 'bg-slate-50',
        border: 'border-slate-200',
        badge: 'bg-slate-100 text-slate-600',
        msgBorder: 'border-slate-200',
        msgLabel: 'text-slate-400',
        btnPrimary: 'bg-slate-900 hover:bg-slate-800 text-white',
        label: 'Non-Aktif',
        title: 'Layanan Tidak Aktif',
        subtitle: 'Sistem informasi puskesmas ini saat ini tidak aktif. Silakan hubungi administrator atau coba kembali nanti.',
        msgTitle: 'Pesan Administrator',
        icon: (
            <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        patternColor: 'rgba(100,116,139,0.06)',
    },
}

export default function StatusPage({ type, pkmName, message }: StatusPageProps) {
    const router = useRouter()
    const [refreshing, setRefreshing] = useState(false)
    const cfg = CONFIG[type]

    const handleRefresh = () => {
        setRefreshing(true)
        setTimeout(() => {
            router.refresh()
            window.location.reload()
        }, 400)
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 relative overflow-hidden">

            {/* Dot pattern background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle, ${cfg.patternColor} 1.5px, transparent 1.5px)`,
                    backgroundSize: '28px 28px',
                }}
            />

            {/* Blurred circle accent */}
            <div className={`absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl ${cfg.lightBg}`} />
            <div className={`absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10 blur-3xl ${cfg.lightBg}`} />

            <div className="relative max-w-md w-full">

                {/* Card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/60 overflow-hidden">

                    {/* Top accent stripe */}
                    <div className={`h-1.5 w-full ${cfg.bg}`} />

                    <div className="px-8 pt-8 pb-10">

                        {/* Badge */}
                        <div className="flex justify-center mb-7">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase ${cfg.badge}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                                {cfg.label}
                            </span>
                        </div>

                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className={`w-16 h-16 rounded-2xl ${cfg.lightBg} border ${cfg.border} flex items-center justify-center`}>
                                {cfg.icon}
                            </div>
                        </div>

                        {/* Puskesmas name */}
                        <p className="text-center text-[11px] font-semibold tracking-[0.15em] uppercase text-slate-400 mb-3">
                            {pkmName}
                        </p>

                        {/* Title */}
                        <h1 className="text-center text-2xl font-bold text-slate-900 leading-tight mb-3">
                            {cfg.title}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-center text-sm text-slate-500 leading-relaxed mb-7">
                            {cfg.subtitle}
                        </p>

                        {/* Message box */}
                        <div className={`rounded-2xl border ${cfg.msgBorder} bg-slate-50 p-4 mb-7`}>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${cfg.msgLabel} mb-2`}>
                                {cfg.msgTitle}
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {message}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2.5">
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${cfg.btnPrimary} disabled:opacity-60`}
                            >
                                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                Muat Ulang
                            </button>
                            <Link
                                href="/puskesmas"
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                            >
                                <Home className="w-4 h-4" />
                                Beranda
                            </Link>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-slate-400 mt-6">
                    © {new Date().getFullYear()} {pkmName}
                </p>

            </div>
        </div>
    )
}