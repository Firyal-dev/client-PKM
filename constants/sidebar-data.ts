import {
    Settings2,
    LayoutDashboard,
    BookImage,
    Album,
    Video,
    PanelRightDashed,
    UserStar,
    Headset,
    Users,
    ClipboardClock,
    Hospital,
    ClipboardList,
    Building2
} from "lucide-react"

export const sidebarData = {
    navMain: [
        {
            title: "Dashboard",
            url: "/admin/dashboard",
            icon: LayoutDashboard,
        },

        {
            title: "Dinamis",
            icon: Settings2,
            items: [
                {
                    title: "Menu",
                    url: "/admin/menus",
                },
                {
                    title: "Halaman Dinamis",
                    url: "/admin/dynamic-pages",
                },
                {
                    title: "Halaman Statis",
                    url: "/admin/static-pages",
                }
            ]
        },
    ],

    navMedia: [
        {
            title: "Media",
            items: [
                {
                    title: "Galeri",
                    url: "/admin/gallery",
                    icon: BookImage,
                },
                {
                    title: "Album",
                    url: "/admin/albums",
                    icon: Album,
                },
                {
                    title: "Video",
                    url: "/admin/videos",
                    icon: Video,
                },
                {
                    title: "Banner",
                    url: "/admin/banners",
                    icon: PanelRightDashed,
                },
            ]
        },
    ],

    navUserExperience: [
        {
            title: "User Experience",
            items: [
                {
                    title: "Kritik & Saran",
                    url: "/admin/reviews",
                    icon: UserStar,
                },
                {
                    title: "Konsultasi",
                    url: "/admin/consultations",
                    icon: Headset,
                }
            ]
        },
    ],

    navActivities: [
        {
            title: "Aktivitas",
            items: [
                {
                    title: "Agenda",
                    url: "/admin/agenda",
                    icon: ClipboardList,
                },
                {
                    title: "Pengunjung",
                    url: "/admin/visitors",
                    icon: Users,
                }
            ]
        },
    ],

    navWebConfig: [
        {
            title: "Konfigurasi Web",
            items: [
                {
                    title: "Informasi Puskesmas",
                    url: "/admin/puskesmas-info",
                    icon: Hospital,
                },
                {
                    title: "Puskesmas",
                    url: "/admin/puskes",
                    icon: Building2,
                }
            ]
        },
    ],

    navAdminManage: [
        {
            title: "Manajemen Admin",
            items: [
                {
                    title: "Data Admin",
                    url: "/admin/admin-data",
                    icon: Users,
                },
                {
                    title: "Log Aktivitas",
                    url: "/admin/activities-log",
                    icon: ClipboardClock,
                }
            ]
        },
    ],
}
