import Image from "next/image"
import Link from "next/link"
import { socialList, informasi, layanan } from "@/constants/footer-data"
import { Map, MapControls, MapMarker, MarkerContent, MarkerLabel, MarkerPopup } from "@/components/ui/map"
import { Card } from "@/components/ui/card"
import { lokasi } from "@/constants/footer-data"
import { CustomLink } from "@/components/ui/link"
import { Navigation, Clock } from "lucide-react"

export default function Footer() {
    return (
        <footer className="w-full bg-background/80 backdrop-blur-md py-16">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

                    <div className="md:col-span-4 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/5 p-1.5 rounded-xl ring-1 ring-primary/10 shadow-sm">
                                <Image
                                    src="/puskesmasLogo.png"
                                    alt="Logo"
                                    width={32}
                                    height={32}
                                />
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-foreground">
                                PUSKESMAS
                            </span>
                        </div>

                        <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px]">
                            Melayani dengan sepenuh hati untuk kesehatan masyarakat
                            yang lebih baik, profesional, dan berkualitas di
                            Kecamatan Sehat.
                        </p>

                        <div className="flex gap-4 mt-2">
                            {socialList.map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground bg-background hover:bg-primary hover:text-white hover:border-primary hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    <social.icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="font-bold text-lg text-foreground mb-6">
                            Layanan Kami
                        </h4>
                        <ul className="space-y-3 text-sm">
                            {layanan.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 flex items-center"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="font-bold text-lg text-foreground mb-6">
                            Informasi Pusat
                        </h4>
                        <ul className="space-y-3 text-sm">
                            {informasi.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 flex items-center"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-4">
                        <Card className="h-[260px] md:h-full p-0 overflow-hidden">
                            <Map center={[lokasi.lng, lokasi.lat]} zoom={16}>
                                <MapMarker longitude={lokasi.lng} latitude={lokasi.lat}>
                                    <MarkerContent>
                                        <div className="size-5 rounded-full bg-primary border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform" />
                                        <MarkerLabel position="bottom">{lokasi.nama}</MarkerLabel>
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
                                            <h4 className="font-bold text-xs text-foreground leading-tight mb-1">
                                                {lokasi.nama}
                                            </h4>
                                            <p className="flex items-center text-[12px] text-muted-foreground leading-none">
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
            </div>
        </footer>
    )
}
