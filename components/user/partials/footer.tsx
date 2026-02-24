import { Phone, Mail, MapPin, Users, Calendar, Clock, BarChart3 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import SocialIcon from './navbar/social-icon'
import { getPublicVisitorStats } from '@/services/visitor/visitor-service'

// Dummy data - bisa diganti dari database
const dummyPhone = '(0251) 1234567'
const dummyEmail = 'puskesmas@kecamatansaht.co.id'
const dummyAddress = 'Jl. Raya Bogor No.XX, Kecamatan Sehat, Kota Bogor'

export default async function Footer() {
    const stats = await getPublicVisitorStats()

    const statItems = [
        { label: 'Hari Ini', value: stats.today, icon: Clock, color: 'text-blue-400' },
        { label: 'Bulan Ini', value: stats.thisMonth, icon: Calendar, color: 'text-blue-400' },
        { label: 'Tahun Ini', value: stats.thisYear, icon: BarChart3, color: 'text-blue-400' },
        { label: 'Total Pengunjung', value: stats.total, icon: Users, color: 'text-emerald-400' },
    ]

    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

                    {/* Map Section */}
                    <div className="space-y-6">
                        <div className="h-[200px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-800">
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                <div className="text-center p-4">
                                    <MapPin className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                    <p className="text-xs text-slate-400 mb-1">Peta Lokasi</p>
                                    <p className="text-xs text-slate-500 line-clamp-2">{dummyAddress}</p>
                                </div>
                            </div>
                        </div>

                        {/* Alamat Ringkas di bawah Map */}
                        <div className="flex items-start gap-3 px-2">
                            <div className="text-xs space-y-1">
                                <p className="text-slate-400 italic">"{dummyAddress}"</p>
                            </div>
                        </div>
                    </div>

                    {/* Brand Section */}
                    <div className="space-y-6">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/puskesmasLogo.png"
                                alt="Logo Puskesmas"
                                width={40}
                                height={40}
                                className="rounded-lg"
                            />
                            <div>
                                <p className="font-bold text-lg text-white leading-none">
                                    PUSKESMAS
                                </p>
                                <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
                                    Kecamatan Sehat
                                </p>
                            </div>
                        </Link>

                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Memberikan pelayanan kesehatan yang bermutu, merata, dan terjangkau bagi seluruh
                            masyarakat di wilayah Kota Bogor.
                        </p>

                        <SocialIcon className="text-slate-400" />
                    </div>

                    {/* Stats Section (Visit Counter) */}
                    <div className="space-y-6">
                        <h4 className="font-semibold text-white text-sm uppercase tracking-wider">
                            Statistik Pengunjung
                        </h4>

                        <div className="grid grid-cols-2 gap-4">
                            {statItems.map((item) => (
                                <div
                                    key={item.label}
                                    className="bg-slate-800/50 border border-white/5 p-4 rounded-xl flex flex-col gap-2 hover:bg-slate-800 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <item.icon className={`w-4 h-4 ${item.color}`} />
                                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                                            {item.label}
                                        </span>
                                    </div>
                                    <p className="text-xl font-bold text-white tabular-nums">
                                        {item.value.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
