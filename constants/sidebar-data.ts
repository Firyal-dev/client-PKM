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
    Newspaper,
    Cross
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
                    title: "Halaman",
                    url: "/admin/pages",
                },
            ],
        },
    ],
    navMedia: [
        {
            name: "Galeri",
            url: "/admin/gallery",
            icon: BookImage,
        },
        {
            name: "Album",
            url: "/admin/albums",
            icon: Album,
        },
        {
            name: "Video",
            url: "/admin/videos",
            icon: Video,
        },
        {
            name: "Banner",
            url: "/admin/banners",
            icon: PanelRightDashed,
        },
    ],
    navUserExperience: [
        {
            name: "Kritik & Saran",
            url: "/admin/reviews",
            icon: UserStar,
        },
        {
            name: "Konsultasi",
            url: "/admin/consultations",
            icon: Headset,
        }
    ],
    navActivities: [
        {
            name: "Agenda",
            url: "/admin/agenda",
            icon: ClipboardList,
        },
        {
            name: "Pengunjung",
            url: "/admin/visitors",
            icon: Users,
        },
    ],
    navAdminManage: [
        {
            name: "Data Admin",
            url: "/admin/admin-data",
            icon: Users,
        },
        {
            name: "Log Aktivitas",
            url: "/admin/activities-log",
            icon: ClipboardClock,
        }
    ],
    navWebConfig: [
        {
            name: "Informasi Puskesmas",
            url: "/admin/puskesmas-info",
            icon: Hospital,
        },
    ]
}