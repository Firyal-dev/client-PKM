import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { lokasi, kontak } from "@/constants/footer-data"
import { Map, MapMarker, MarkerContent, MarkerLabel, MapControls } from "@/components/ui/map"

export default function KontakSection() {
    return (
        <section className="py-16" id="kontak">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center text-center mb-12 space-y-3">
                    <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide">
                        Kontak & Lokasi
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">
                        Hubungi Kami
                    </h2>
                    <p className="max-w-2xl text-sm md:text-base text-slate-600 leading-relaxed">
                        Kami siap melayani Anda. Silakan hubungi kami atau kunjungi lokasi Puskesmas melalui informasi di bawah ini.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Info Kontak */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {kontak.map((item, index) => (
                                <Card key={index} className="border-slate-100 shadow-sm rounded-2xl">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                {item.icon === Phone ? "Telepon" : item.icon === Mail ? "Email" : "Alamat"}
                                            </p>
                                            <p className="text-sm font-semibold text-slate-900 truncate">
                                                {item.label}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            <Card className="border-slate-100 shadow-sm rounded-2xl">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jam Layanan</p>
                                        <p className="text-sm font-semibold text-slate-900 truncate">{lokasi.jam}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden h-[300px] lg:h-[400px]">
                            <Map center={[lokasi.lng, lokasi.lat]} zoom={15}>
                                <MapMarker longitude={lokasi.lng} latitude={lokasi.lat}>
                                    <MarkerContent>
                                        <div className="size-5 rounded-full bg-blue-600 border-2 border-white shadow-lg" />
                                        <MarkerLabel position="bottom">{lokasi.nama}</MarkerLabel>
                                    </MarkerContent>
                                </MapMarker>
                                <MapControls />
                            </Map>
                        </Card>
                    </div>

                    {/* Alamat & CTA */}
                    <div className="flex flex-col gap-6">
                        <Card className="border-none bg-blue-600 text-white rounded-3xl overflow-hidden shadow-xl shadow-blue-200">
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">Puskesmas Bogor Tengah</h3>
                                    <p className="text-blue-100 text-sm leading-relaxed">
                                        Jl. Sudirman No. 123, Kelurahan Tengah, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat.
                                    </p>
                                </div>

                                <a
                                    href={lokasi.lokasi}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center w-full py-4 px-6 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-colors shadow-lg"
                                >
                                    Buka di Google Maps
                                </a>
                            </CardContent>
                        </Card>

                        <div className="bg-slate-100 p-6 rounded-3xl border border-dashed border-slate-300">
                            <h4 className="font-bold text-slate-900 mb-2">Informasi Penting</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Pastikan Anda membawa kartu identitas (KTP) dan kartu BPJS/Asuransi Kesehatan saat berkunjung untuk memudahkan proses pendaftaran. Untuk keadaan darurat, silakan langsung menuju IGD terdekat.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
