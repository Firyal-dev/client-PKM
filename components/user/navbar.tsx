import { menuList } from "@/constants/navbar-data"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "../ui/navigation-menu"
import Image from "next/image"
import Link from "next/link"

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md px-6 py-3">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3 group cursor-pointer transition-transform hover:scale-[1.02]">
                    <div className="bg-primary/5 p-1.5 rounded-xl ring-1 ring-primary/10 group-hover:ring-primary/20 transition-all shadow-sm">
                        <Image src="/puskesmasLogo.png" alt="Logo" width={32} height={32} />
                    </div>
                    <div>
                        <p className="font-black text-xl leading-none text-primary">
                            PUSKESMAS
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/80 mt-1">
                            Kecamatan Sehat
                        </p>
                    </div>
                </Link>

                <NavigationMenu className="hidden lg:flex">
                    <NavigationMenuList className="gap-1">
                        {menuList.map((item) => (
                            <NavigationMenuItem key={item.href}>
                                <NavigationMenuLink
                                    href={item.href}
                                    className="group relative inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                                >
                                    <span className="relative z-10">{item.label}</span>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>

                <div className="flex items-center gap-4">
                    <button className="lg:hidden p-2 rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                    </button>
                </div>

            </div>
        </nav>
    )
}