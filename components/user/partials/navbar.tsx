import { getPublicMenus } from "@/services/menu/menu-service"
import { getPublicPuskesmasInfo } from "@/services/puskesmas-info-service"
import NavbarWrapper from "./navbar/wrapper"
import Logo from "./navbar/logo"
import ListMenu from "./navbar/list-menu"
import MobileNavbar from "./mobile-navbar"
import SocialIcon from "./navbar/social-icon"
import { Phone, Mail } from "lucide-react"
import SearchToggle from "./search-toggle"

export default async function Navbar() {
    const [menus, webInfo] = await Promise.all([
        getPublicMenus(),
        getPublicPuskesmasInfo()
    ])

    const hasSocial = webInfo?.social_links && Object.values(webInfo.social_links).some(l => l && l !== '')
    const hasContact = !!webInfo?.contact || !!webInfo?.email

    return (
        <NavbarWrapper>
            {/* ── Top Bar ── */}
            {(hasContact || hasSocial) && (
                <div className="border-b border-white/10 [header[data-scroll=up]_&]:border-slate-100 transition-colors duration-[450ms]">
                    <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16 h-11 flex items-center justify-between">
                        {/* Kontak */}
                        <div className="flex items-center gap-5 text-[11.5px] font-medium
                            text-white/70 [header[data-scroll=up]_&]:text-slate-500
                            transition-colors duration-[450ms]">
                            {webInfo?.contact && (
                                <a href={`tel:${webInfo.contact}`} className="flex items-center gap-1.5 hover:text-white [header[data-scroll=up]_&]:hover:text-blue-700 transition-colors">
                                    <Phone size={12} />
                                    {webInfo.contact}
                                </a>
                            )}
                            {webInfo?.email && (
                                <a href={`mailto:${webInfo.email}`} className="hidden sm:flex items-center gap-1.5 hover:text-white [header[data-scroll=up]_&]:hover:text-blue-700 transition-colors">
                                    <Mail size={12} />
                                    {webInfo.email}
                                </a>
                            )}
                        </div>

                        <SocialIcon socialLinks={webInfo?.social_links} />
                    </div>
                </div>
            )}

            {/* ── Main Nav ── */}
            <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between gap-8
                h-[72px] [header[data-scroll=up]_&]:h-[60px] transition-all duration-[450ms]">

                <Logo webTitle={webInfo?.web_title} logoUrl={webInfo?.logo} />

                {/* Desktop menu */}
                <div className="hidden lg:block flex-1">
                    <ListMenu menus={menus} />
                </div>

                {/* Search + mobile trigger */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    <SearchToggle />

                    {/* Mobile hamburger */}
                    <div className="block lg:hidden">
                        <MobileNavbar menus={menus} webInfo={webInfo ?? undefined} />
                    </div>
                </div>
            </div>
        </NavbarWrapper>
    )
}