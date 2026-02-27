import { Phone, MapPin, Users, Calendar, Clock, BarChart3, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import SocialIcon from './navbar/social-icon'
import { getPublicVisitorStats } from '@/services/visitor/visitor-service'
import { getPublicPuskesmasInfo } from '@/services/puskesmas-info-service'
import { getMediaUrl } from '@/lib/getMediaUrl'

export default async function Footer() {
    const [stats, webInfo] = await Promise.all([
        getPublicVisitorStats(),
        getPublicPuskesmasInfo()
    ])

    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

                    {/* Map Section */}
                    <div className="space-y-6">
                        <div className="h-[200px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-800">
                            {webInfo?.lantitude && webInfo?.longtitude ? (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    src={`https://maps.google.com/maps?q=${webInfo.lantitude},${webInfo.longtitude}&z=15&output=embed`}
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                    <div className="text-center p-4">
                                        <MapPin className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                        <p className="text-xs text-slate-400 mb-1">Peta Lokasi</p>
                                        <p className="text-xs text-slate-500 line-clamp-2">{webInfo?.location || 'Alamat belum diatur'}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Alamat Ringkas di bawah Map */}
                        <div className="flex items-start gap-3 px-2">
                            <div className="text-xs space-y-1">
                                <p className="text-slate-400 italic">"{webInfo?.location || 'Alamat belum diatur'}"</p>
                            </div>
                        </div>

                        {webInfo?.contact && (
                            <div className="flex items-center gap-2 px-2 text-sm">
                                <Phone size={14} className="text-blue-500" />
                                <span className="text-slate-400">{webInfo.contact}</span>
                            </div>
                        )}
                        {webInfo?.email && (
                            <div className="flex items-center gap-2 px-2 text-sm">
                                <Mail size={14} className="text-blue-500" />
                                <span className="text-slate-400">{webInfo.email}</span>
                            </div>
                        )}
                    </div>

                    {/* Brand Section */}
                    <div className="space-y-6">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                                <Image
                                    src={getMediaUrl(webInfo?.logo) || "/puskesmasLogo.png"}
                                    alt="Logo Puskesmas"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                            <div>
                                <p className="font-bold text-lg text-white leading-none">
                                    {webInfo?.web_title?.split(' ')[0] || "PUSKESMAS"}
                                </p>
                                <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
                                    {webInfo?.web_title?.split(' ').slice(1).join(' ') || "Kecamatan Sehat"}
                                </p>
                            </div>
                        </Link>

                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Memberikan pelayanan kesehatan yang bermutu, merata, dan terjangkau bagi seluruh
                            masyarakat.
                        </p>

                        <SocialIcon className="text-slate-400" socialLinks={webInfo?.social_links} />
                    </div>

                    {/* Stats Section (Visit Counter) */}
                    <div className="space-y-6 font-sans">
                        <h4 className="font-semibold text-white text-sm uppercase tracking-wider">
                            Statistik Pengunjung
                        </h4>

                        {/* Highlight Total */}
                        <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-emerald-400" />
                                    <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                                        Total Pengunjung
                                    </span>
                                </div>
                            </div>

                            <p className="text-3xl font-extrabold text-white tabular-nums">
                                {stats.total.toLocaleString('id-ID')}
                            </p>

                            <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-400 rounded-full"
                                    style={{
                                        width: `${Math.min(
                                            (stats.thisMonth / (stats.total || 1)) * 100,
                                            100
                                        )}%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Other Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                {
                                    label: "Hari Ini",
                                    value: stats.today,
                                    icon: Clock,
                                },
                                {
                                    label: "Bulan Ini",
                                    value: stats.thisMonth,
                                    icon: Calendar,
                                },
                                {
                                    label: "Tahun Ini",
                                    value: stats.thisYear,
                                    icon: BarChart3,
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="bg-slate-800/60 border border-white/5 p-4 rounded-xl hover:bg-slate-800 transition-all font-sans"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <item.icon className="w-4 h-4 text-blue-400" />
                                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                                            {item.label}
                                        </span>
                                    </div>

                                    <p className="text-xl font-bold text-white tabular-nums">
                                        {item.value.toLocaleString("id-ID")}
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
