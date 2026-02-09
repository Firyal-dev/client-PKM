import {
    Settings2,
    LayoutDashboard,
    GitCommitHorizontal,
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
    Newspaper
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
                    title: "Menu Dinamis",
                    url: "/admin/dynamic-menu",
                },
                {
                    title: "Konten Dinamis",
                    url: "/admin/dynamic-content",
                },
            ],
        },
        {
            title: "Konten Statis",
            url: "/admin/static-content",
            icon: GitCommitHorizontal,
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
            name: "Berita",
            url: "/admin/news",
            icon: Newspaper,
        }
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