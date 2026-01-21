import {
    Settings2,
    LayoutDashboard,
    GitCommitHorizontal,
    BookImage,
    Album,
    Video,
    PanelRightDashed,
    UserStar,
    User,
    Headset,
    Users,
    ClipboardClock,
    Hospital
} from "lucide-react"

export const sidebarData = {
    navMain: [
        {
            title: "Dashboard",
            url: "/admin/main/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Dinamis",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "Menu Dinamis",
                    url: "#",
                },
                {
                    title: "Konten Dinamis",
                    url: "#",
                },
            ],
        },
        {
            title: "Konten Statis",
            url: "#",
            icon: GitCommitHorizontal,
        },
    ],
    navMedia: [
        {
            name: "Galeri",
            url: "#",
            icon: BookImage,
        },
        {
            name: "Album",
            url: "#",
            icon: Album,
        },
        {
            name: "Video",
            url: "#",
            icon: Video,
        },
        {
            name: "Banner",
            url: "#",
            icon: PanelRightDashed,
        },
    ],
    navUserExperience: [
        {
            name: "Kritik & Saran",
            url: "#",
            icon: UserStar,
        },
        {
            name: "Konsultasi",
            url: "#",
            icon: Headset,
        }
    ],
    navAdminManage: [
        {
            name: "Data Admin",
            url: "#",
            icon: Users,
        },
        {
            name: "Log Aktivitas",
            url: "#",
            icon: ClipboardClock,
        }
    ],
    navWebConfig: [
        {
            name: "Informasi Puskesmas",
            url: "#",
            icon: Hospital,
        },
    ]
}