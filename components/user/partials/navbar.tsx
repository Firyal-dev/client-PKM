import { menuList } from "@/constants/navbar-data"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "../../ui/navigation-menu"
import Image from "next/image"
import Link from "next/link"
import MobileNavbar from "./mobile-navbar"

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md py-3 shadow-sm border-b border-white/50">
            <div className="container flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3 group transition-opacity hover:opacity-90">
                    <div className="bg-primary/5 p-1.5 rounded-xl ring-1 ring-primary/10 group-hover:ring-primary/20 transition-all shadow-sm group-hover:bg-primary/10">
                        <Image src="/puskesmasLogo.png" alt="Logo" width={32} height={32} />
                    </div>
                    <div>
                        <p className="font-bold text-lg tracking-tight leading-none text-primary">
                            PUSKESMAS
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.15em] font-medium text-muted-foreground mt-1">
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
                                    className="group px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary hover:bg-primary/5 rounded-full relative overflow-hidden"
                                >
                                    {item.label}
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>

                <div className="flex items-center gap-4">
                    <MobileNavbar />
                </div>

            </div>
        </nav>
    )
}