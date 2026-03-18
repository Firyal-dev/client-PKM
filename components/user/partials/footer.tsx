import { Phone, MapPin, Mail, Users, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import SocialIcon from './navbar/social-icon'
import { getPublicVisitorStats } from '@/services/visitor/visitor-service'
import { getPublicPuskesmasInfo } from '@/services/puskesmas-info-service'
import { getMediaUrl } from '@/lib/getMediaUrl'
import { FooterMap } from './footer-map'

export default async function Footer() {
    const [stats, webInfo] = await Promise.all([
        getPublicVisitorStats(),
        getPublicPuskesmasInfo()
    ])

    return (
        <footer className="bg-slate-950 text-slate-300">

            {/* ── Map strip — full width, di atas konten footer ── */}
            <div className="w-full h-[280px] relative border-b border-slate-800">
                {webInfo?.lantitude && webInfo?.longtitude ? (
                    <FooterMap puskesmasInfo={webInfo} />
                ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center gap-3 text-slate-600">
                        <MapPin className="w-5 h-5" />
                        <span className="text-sm">{webInfo?.location || 'Lokasi belum diatur'}</span>
                    </div>
                )}

                {/* Gradient overlay bawah supaya blend ke footer */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
            </div>

            {/* ── Footer content ── */}
            <div className="max-w-7xl mx-auto px-6 pt-12 pb-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-slate-800/60">

                    {/* ── Col 1: Brand ── */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-800 ring-1 ring-slate-700 flex items-center justify-center flex-shrink-0">
                                <Image
                                    src={getMediaUrl(webInfo?.logo) || "/puskesmasLogo.png"}
                                    alt="Logo Puskesmas"
                                    width={44}
                                    height={44}
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white leading-none">
                                    {webInfo?.web_title?.split(' ')[0] || "PUSKESMAS"}
                                </p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-[0.12em] mt-1">
                                    {webInfo?.web_title?.split(' ').slice(1).join(' ') || "Kecamatan Sehat"}
                                </p>
                            </div>
                        </Link>

                        <p className="text-sm text-slate-400 leading-relaxed max-w-[260px]">
                            Memberikan pelayanan kesehatan yang bermutu, merata, dan terjangkau bagi seluruh masyarakat.
                        </p>

                        <SocialIcon className="text-slate-500" socialLinks={webInfo?.social_links} />
                    </div>

                    {/* ── Col 2: Kontak ── */}
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-bold tracking-[0.14em] text-slate-500 uppercase">
                            Kontak
                        </h4>

                        <div className="space-y-3.5">
                            {webInfo?.location && (
                                <div className="flex items-start gap-3">
                                    <MapPin size={13} className="text-slate-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-slate-400 leading-relaxed">{webInfo.location}</span>
                                </div>
                            )}
                            {webInfo?.contact && (
                                <div className="flex items-center gap-3">
                                    <Phone size={13} className="text-slate-500 flex-shrink-0" />
                                    <span className="text-sm text-slate-400">{webInfo.contact}</span>
                                </div>
                            )}
                            {webInfo?.email && (
                                <div className="flex items-center gap-3">
                                    <Mail size={13} className="text-slate-500 flex-shrink-0" />
                                    <span className="text-sm text-slate-400">{webInfo.email}</span>
                                </div>
                            )}
                        </div>

                        {/* Google Maps link */}
                        {webInfo?.lantitude && webInfo?.longtitude && (
                            <Link
                                href={`https://www.google.com/maps/search/?api=1&query=${webInfo.lantitude},${webInfo.longtitude}`}
                                target="_blank"
                                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                <ExternalLink size={11} />
                                Buka di Google Maps
                            </Link>
                        )}
                    </div>

                    {/* ── Col 3: Visitor Stats ── */}
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-bold tracking-[0.14em] text-slate-500 uppercase">
                            Statistik Pengunjung
                        </h4>

                        <div className="flex items-center gap-2 text-slate-400">
                            <Users className="w-4 h-4" />
                            <span className="text-sm font-medium">Pengunjung Website</span>
                        </div>

                        <div className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
                            {[
                                { label: 'Hari Ini', value: stats.today },
                                { label: 'Bulan Ini', value: stats.thisMonth },
                                { label: 'Tahun Ini', value: stats.thisYear },
                            ].map((stat, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between px-4 py-3 bg-slate-900/40"
                                >
                                    <span className="text-xs text-slate-500">{stat.label}</span>
                                    <span className="text-sm font-semibold text-slate-300 tabular-nums">
                                        {stat.value.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            ))}
                            <div className="flex items-center justify-between px-4 py-3.5 bg-slate-800/60">
                                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Total</span>
                                <span className="text-base font-bold text-white tabular-nums">
                                    {stats.total.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Bottom bar ── */}
                <div className="py-5 flex flex-col md:flex-row justify-between items-center gap-2 text-[11px] text-slate-700 tracking-widest uppercase">
                    <p>© {new Date().getFullYear()} Pemerintah Kota Bogor</p>
                </div>
            </div>
        </footer>
    )
}