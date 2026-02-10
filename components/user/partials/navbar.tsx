import { menuList } from "@/constants/navbar-data"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import Image from "next/image"
import Link from "next/link"
import MobileNavbar from "./mobile-navbar"

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur border-b">
            <div className="container mx-auto px-6 md:px-12 lg:px-16 flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/kotabogor.webp"
                        alt="Logo Kota Bogor"
                        width={28}
                        height={28}
                    />
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Image
                            src="/puskesmasLogo.png"
                            alt="Logo Puskesmas"
                            width={28}
                            height={28}
                        />
                    </div>
                    <div className="leading-tight">
                        <p className="font-bold text-sm text-primary">
                            PUSKESMAS
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            Kecamatan Sehat
                        </p>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <NavigationMenu className="hidden lg:flex">
                    <NavigationMenuList className="gap-2">
                        {menuList.map((item) => (
                            <NavigationMenuItem key={item.href}>
                                <NavigationMenuLink
                                    href={item.href}
                                    className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:text-primary hover:bg-primary/10 transition"
                                >
                                    {item.label}
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Mobile */}
                <MobileNavbar />
            </div>
        </nav>
    )
}
