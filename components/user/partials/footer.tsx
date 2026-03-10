import { Phone, MapPin, Users, Mail } from 'lucide-react'
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
        <footer className="bg-slate-900 text-slate-300">

            {/* Top divider */}
            <div className="h-px bg-slate-800" />

            <div className="max-w-7xl mx-auto px-6 pt-16 pb-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 pb-14 border-b border-slate-800">

                    {/* ── Col 1: Map + Kontak ── */}
                    <div className="space-y-5">
                        <h4 className="text-[11px] font-bold tracking-[0.14em] text-slate-500 uppercase">
                            Lokasi & Kontak
                        </h4>

                        <div className="h-[190px] rounded-xl overflow-hidden ring-1 ring-slate-700">
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
                                    <div className="text-center space-y-2">
                                        <MapPin className="w-6 h-6 text-slate-500 mx-auto" />
                                        <p className="text-xs text-slate-500 px-4 line-clamp-2">
                                            {webInfo?.location || 'Alamat belum diatur'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2.5 pt-0.5">
                            <p className="text-xs text-slate-400 leading-relaxed">
                                {webInfo?.location || 'Alamat belum diatur'}
                            </p>
                            {webInfo?.contact && (
                                <div className="flex items-center gap-2.5">
                                    <Phone size={12} className="text-slate-500 flex-shrink-0" />
                                    <span className="text-xs text-slate-400">{webInfo.contact}</span>
                                </div>
                            )}
                            {webInfo?.email && (
                                <div className="flex items-center gap-2.5">
                                    <Mail size={12} className="text-slate-500 flex-shrink-0" />
                                    <span className="text-xs text-slate-400">{webInfo.email}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Col 2: Brand ── */}
                    <div className="space-y-7">
                        <h4 className="text-[11px] font-bold tracking-[0.14em] text-slate-500 uppercase">
                            Tentang Kami
                        </h4>

                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 ring-1 ring-slate-700 flex items-center justify-center flex-shrink-0">
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
                                <p className="text-sm font-bold text-white leading-none">
                                    {webInfo?.web_title?.split(' ')[0] || "PUSKESMAS"}
                                </p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-[0.1em] mt-1">
                                    {webInfo?.web_title?.split(' ').slice(1).join(' ') || "Kecamatan Sehat"}
                                </p>
                            </div>
                        </Link>

                        <p className="text-sm text-slate-400 leading-[1.85] max-w-[280px]">
                            Memberikan pelayanan kesehatan yang bermutu, merata, dan terjangkau bagi seluruh
                            masyarakat di wilayah Kota Bogor.
                        </p>

                        <SocialIcon className="text-slate-500" socialLinks={webInfo?.social_links} />
                    </div>

                    {/* ── Col 3: Visitor Stats ── */}
                    <div className="space-y-7">
                        <h4 className="text-[11px] font-bold tracking-[0.14em] text-slate-500 uppercase">
                            Statistik Pengunjung
                        </h4>

                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-300">Pengunjung Website</span>
                        </div>

                        <div className="rounded-xl border border-slate-800 overflow-hidden">
                            {[
                                { label: 'Hari Ini', value: stats.today },
                                { label: 'Bulan Ini', value: stats.thisMonth },
                                { label: 'Tahun Ini', value: stats.thisYear },
                            ].map((stat, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800 bg-slate-800/30"
                                >
                                    <span className="text-xs text-slate-400">{stat.label}</span>
                                    <span className="text-sm font-semibold text-slate-200 tabular-nums">
                                        {stat.value.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            ))}

                            <div className="flex items-center justify-between px-4 py-4 bg-slate-800">
                                <span className="text-xs font-bold tracking-widest text-slate-300 uppercase">Total</span>
                                <span className="text-lg font-bold text-white tabular-nums">
                                    {stats.total.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ── Footer Bottom ── */}
                <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-2 text-[11px] text-slate-600 tracking-widest uppercase">
                    <p>© {new Date().getFullYear()} Pemerintah Kota Bogor</p>
                </div>
            </div>
        </footer>
    )
}