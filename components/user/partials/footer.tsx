import Image from "next/image"
import Link from "next/link"
import { socialList, informasi, layanan, lokasi } from "@/constants/footer-data"
import {
    Map,
    MapControls,
    MapMarker,
    MarkerContent,
    MarkerLabel,
    MarkerPopup,
} from "@/components/ui/map"
import { Card } from "@/components/ui/card"
import { Clock, Navigation } from "lucide-react"
import { CustomLink } from "@/components/ui/link"

export default function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-slate-900 text-slate-200">
            <div className="container py-14">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

                    {/* Brand */}
                    <div className="md:col-span-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center">
                                <Image
                                    src="/puskesmasLogo.png"
                                    alt="Logo"
                                    width={26}
                                    height={26}
                                />
                            </div>
                            <span className="font-bold text-lg text-white">
                                Puskesmas Kecamatan Sehat
                            </span>
                        </div>

                        <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                            Melayani masyarakat dengan sepenuh hati melalui
                            pelayanan kesehatan yang profesional, terbuka,
                            dan berkelanjutan.
                        </p>

                        <div className="flex gap-3 mt-3">
                            {socialList.map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    className="w-9 h-9 rounded-full border border-slate-700
                                        flex items-center justify-center
                                        text-slate-400 bg-slate-800
                                        hover:bg-primary hover:text-white hover:border-primary
                                        transition"
                                >
                                    <social.icon size={16} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Layanan */}
                    <div className="md:col-span-2">
                        <h4 className="font-semibold text-sm mb-4 text-white">
                            Layanan
                        </h4>
                        <ul className="space-y-2 text-sm">
                            {layanan.map((item, i) => (
                                <li key={i}>
                                    <Link
                                        href={item.href}
                                        className="text-slate-400 hover:text-primary transition"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Informasi */}
                    <div className="md:col-span-2">
                        <h4 className="font-semibold text-sm mb-4 text-white">
                            Informasi
                        </h4>
                        <ul className="space-y-2 text-sm">
                            {informasi.map((item, i) => (
                                <li key={i}>
                                    <Link
                                        href={item.href}
                                        className="text-slate-400 hover:text-primary transition"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Lokasi */}
                    <div className="md:col-span-4">
                        <Card className="h-[260px] md:h-full p-0 overflow-hidden border-slate-800 bg-slate-800">
                            <Map center={[lokasi.lng, lokasi.lat]} zoom={16}>
                                <MapMarker longitude={lokasi.lng} latitude={lokasi.lat}>
                                    <MarkerContent>
                                        <div className="size-5 rounded-full bg-primary border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform" />
                                        <MarkerLabel position="bottom">
                                            {lokasi.nama}
                                        </MarkerLabel>
                                    </MarkerContent>

                                    <MarkerPopup className="p-0 w-48 shadow-2xl border-none bg-transparent">
                                        <div className="relative h-24 overflow-hidden rounded-t-xl">
                                            <Image
                                                fill
                                                src={lokasi.gambar}
                                                alt={lokasi.nama}
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="p-3 bg-background rounded-b-xl border border-t-0">
                                            <h4 className="font-bold text-xs mb-1">
                                                {lokasi.nama}
                                            </h4>

                                            <p className="flex items-center text-[12px] text-muted-foreground">
                                                <Clock className="size-3.5 mr-1.5" />
                                                {lokasi.jam}
                                            </p>

                                            <CustomLink href={lokasi.lokasi} className="mt-3 w-full">
                                                <Navigation className="size-3.5 mr-1.5" />
                                                Buka Maps
                                            </CustomLink>
                                        </div>
                                    </MarkerPopup>

                                    <MapControls />
                                </MapMarker>
                            </Map>
                        </Card>
                    </div>

                </div>

                {/* Copyright */}
                <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-500 text-center">
                    © {new Date().getFullYear()} Puskesmas Kecamatan Sehat. Seluruh hak cipta dilindungi.
                </div>
            </div>
        </footer>
    )
}
