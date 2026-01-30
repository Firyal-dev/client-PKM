import { LayananProp } from "@/types/layanan-prop"
import {
    Stethoscope,
    Ambulance,
    Truck,
    FlaskConical,
    UsersRound,
    HeartPulse
} from "lucide-react"

export const layananList: LayananProp[] = [
    {
        icon: Stethoscope,
        label: "PELAYANAN RAWAT JALAN",
        desc: "Pelayanan ini terdiri dari 15 pelayanan yaitu unit pelayanan dewasa, Unit pelayan Lansia, Unit Pelay...",
    },
    {
        icon: Ambulance,
        label: "PELAYANAN GADAR BENCANA",
        desc: "Pelayanan gadar bencana dilaksanakan jika terjadi suatu keadaan/kondisi yang tidak diharapkan terkai...",
    },
    {
        icon: Truck,
        label: "PELAYANAN PUSKESMAS KELILING",
        desc: "Pelayanan Pusling dilakukan 2 kali dalam 1 minggu pada hari kerja mulai pukul 08.00 - 12.00 WIB di k...",
    },
    {
        icon: FlaskConical,
        label: "PELAYANAN PENUNJANG",
        desc: "Puskesmas Bogor Tengah memiliki beberapa pelayanan penunjang Laboratorium dan Radiologi. ...",
    },
    {
        icon: HeartPulse,
        label: "PELAYANAN LANSIA",
        desc: "Pemeriksaan dan pembinaan Posyandu Lansia, olahraga/kesegaran jasmani bagi lansia, keperawatan keseh...",
    },
    {
        icon: UsersRound,
        label: "PELAYANAN KESEHATAN MASYARAKAT",
        desc: "Kunjungan ke individu/keluarga/kelompok/masyarakat untuk melakukan asuhan keperawatan kasus yang mem...",
    },
]