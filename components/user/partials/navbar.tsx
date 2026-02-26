import { getPublicMenus } from "@/services/menu/menu-service"
import NavbarWrapper from "./navbar/wrapper"
import Logo from "./navbar/logo"
import ListMenu from "./navbar/list-menu"
import MobileNavbar from "./mobile-navbar"
import SocialIcon from "./navbar/social-icon"
import { Mail, Phone } from "lucide-react"

const dummyPhone = '(0251) 1234567'
const dummyEmail = 'puskesmas@kecamatansaht.co.id'

export default async function Navbar() {
    const menus = await getPublicMenus()

    return (
        <NavbarWrapper>
            <div className="mx-2 md:mx-6 lg:mx-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-gray-100 dark:border-slate-700 transition-all duration-500 rounded-b-2xl md:rounded-b-3xl shadow-sm">
                
                <div className="transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-[.is-scrolled]:max-h-0 group-[.is-scrolled]:opacity-0 group-[.is-scrolled]:mb-0 max-h-20 opacity-100">
                    <div className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-700">
                        <div className="max-w-7xl mx-auto flex justify-between items-center py-2 px-4 md:px-8 text-xs font-medium text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5"><Phone size={14} className="text-blue-500" /><span>{dummyPhone}</span></div>
                                <div className="hidden lg:flex items-center gap-1.5"><Mail size={14} className="text-blue-500" /><span>{dummyEmail}</span></div>
                            </div>
                            <SocialIcon />
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] py-3 group-[.is-scrolled]:py-2">
                    <Logo />
                    
                    <div className="hidden lg:block">
                        <ListMenu menus={menus} />
                    </div>
                    
                    <div className="block lg:hidden">
                        <MobileNavbar menus={menus} />
                    </div>
                </div>
            </div>
        </NavbarWrapper>
    )
}