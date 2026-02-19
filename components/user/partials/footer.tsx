import { Phone, Mail, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import SocialIcon from './navbar/social-icon'

// Dummy data - bisa diganti dari database
const dummyPhone = '(0251) 1234567'
const dummyEmail = 'puskesmas@kecamatansaht.co.id'
const dummyAddress = 'Jl. Raya Bogor No.XX, Kecamatan Sehat, Kota Bogor'
const dummyName = 'Puskesmas Kecamatan Sehat'
const dummyLongitude = 106.7995
const dummyLatitude = -6.5973

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

                    {/* Map Section */}
                    <div className="space-y-6">
                        <div className="h-[200px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-800">
                            {/* Placeholder map - bisa diganti sama Map component asli */}
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                    <p className="text-xs text-slate-400">Peta Lokasi</p>
                                    <p className="text-xs text-slate-500">{dummyAddress}</p>
                                </div>
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

                    {/* Contact Info Section */}
                    <div className="space-y-6">
                        <h4 className="font-semibold text-white text-sm uppercase tracking-wider">
                            Hubungi Kami
                        </h4>

                        <div className="space-y-4">
                            {/* Alamat */}
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
                                <div>
                                    <p className="text-sm text-slate-300">{dummyAddress}</p>
                                </div>
                            </div>

                            {/* Telepon */}
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-blue-500" />
                                <a
                                    href={`tel:${dummyPhone.replace(/[^0-9]/g, '')}`}
                                    className="text-sm text-slate-300 hover:text-blue-400 transition"
                                >
                                    {dummyPhone}
                                </a>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-500" />
                                <a
                                    href={`mailto:${dummyEmail}`}
                                    className="text-sm text-slate-300 hover:text-blue-400 transition"
                                >
                                    {dummyEmail}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
