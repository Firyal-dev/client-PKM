"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu as MenuIcon, MessageSquare, ChevronRight } from "lucide-react"

import { Menu as MenuType } from "@/services/menu/menu-service"
import { cn } from "@/lib/utils"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

interface MobileNavbarProps {
    menus?: MenuType[]
}

export default function MobileNavbar({ menus = [] }: MobileNavbarProps) {
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({})

    useEffect(() => {
        setMounted(true)
    }, [])

    const getParentId = (menu: MenuType): string | null => {
        return menu.parent_id ?? menu.parent?.id ?? null
    }

    const mainMenus = menus
        .filter(menu => getParentId(menu) === null && menu.status === 1)
        .sort((a, b) => a.order - b.order)

    const toggleMenu = (id: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setExpandedMenus(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    if (!mounted) {
        return (
            <button className="lg:hidden p-2 rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-colors dark:bg-primary/20 dark:text-primary-foreground">
                <MenuIcon className="w-6 h-6" strokeWidth={2.5} />
            </button>
        )
    }

    return (
        <Sheet open={open} onOpenChange={setOpen} >
            {/* Trigger */}
            <SheetTrigger asChild>
                <button className="lg:hidden p-2 rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-colors dark:bg-primary/20 dark:text-primary-foreground">
                    <MenuIcon className="w-6 h-6" strokeWidth={2.5} />
                </button>
            </SheetTrigger>

            {/* Content */}
            <SheetContent side="right" className="w-[300px] sm:w-[380px] z-[999] px-0 dark:bg-slate-900 overflow-y-auto">
                {/* Header */}
                <SheetHeader className="px-6 pb-6 border-b dark:border-slate-700">
                    <SheetTitle>
                        <Link
                            href="/"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3"
                        >
                            <div className="bg-primary/5 p-2 rounded-xl ring-1 ring-primary/10 dark:bg-primary/20">
                                <Image
                                    src="/puskesmasLogo.png"
                                    alt="Logo Puskesmas"
                                    width={32}
                                    height={32}
                                />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-lg leading-none text-primary dark:text-primary-foreground">
                                    PUSKESMAS
                                </p>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground dark:text-slate-400 mt-1">
                                    Kecamatan Sehat
                                </p>
                            </div>
                        </Link>
                    </SheetTitle>
                </SheetHeader>

                {/* Menu */}
                <div className="flex flex-col gap-1 px-4 py-6">
                    <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 rounded-xl text-base font-medium transition-all hover:bg-primary/10 dark:hover:bg-primary/20 text-foreground dark:text-slate-200"
                    >
                        Beranda
                    </Link>

                    {mainMenus.map((menu) => {
                        const subMenus = (menu.children && menu.children.length > 0)
                            ? menu.children.filter(sub => sub.status === 1).sort((a, b) => a.order - b.order)
                            : menus
                                .filter(sub => getParentId(sub) === menu.id && sub.status === 1)
                                .sort((a, b) => a.order - b.order)

                        const hasSubMenus = subMenus.length > 0
                        const isExpanded = expandedMenus[menu.id]

                        if (hasSubMenus) {
                            return (
                                <div key={menu.id} className="flex flex-col">
                                    {/* ✅ FIX: Ganti jadi <button> utuh biar seluruh area baris bisa diklik buat buka/tutup */}
                                    <button
                                        onClick={(e) => toggleMenu(menu.id, e)}
                                        className="flex items-center justify-between w-full px-4 py-2 rounded-xl transition-all hover:bg-primary/10 dark:hover:bg-primary/20 text-foreground dark:text-slate-200 text-left"
                                    >
                                        <span className="py-1 text-base font-medium">
                                            {menu.title}
                                        </span>
                                        <div className="p-2 -mr-2 rounded-lg text-muted-foreground transition-colors">
                                            <ChevronRight className={cn(
                                                "w-5 h-5 transition-transform duration-300",
                                                isExpanded && "rotate-90"
                                            )} />
                                        </div>
                                    </button>

                                    {/* Submenu dengan animasi Collapsible */}
                                    <div
                                        className={cn(
                                            "grid transition-all duration-300 ease-in-out",
                                            isExpanded ? "grid-rows-[1fr] opacity-100 mt-1 mb-2" : "grid-rows-[0fr] opacity-0"
                                        )}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="ml-4 border-l-2 border-primary/20 dark:border-primary/40 pl-4 py-1 space-y-1">
                                                {subMenus.map((subMenu) => (
                                                    <Link
                                                        key={subMenu.id}
                                                        href={`/${subMenu.slug}`}
                                                        onClick={() => setOpen(false)}
                                                        className="block px-4 py-2 rounded-lg text-sm text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-slate-200 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                                                    >
                                                        {subMenu.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        return (
                            <Link
                                key={menu.id}
                                href={`/${menu.slug}`}
                                onClick={() => setOpen(false)}
                                className="px-4 py-3 rounded-xl text-base font-medium transition-all hover:bg-primary/10 dark:hover:bg-primary/20 text-foreground dark:text-slate-200"
                            >
                                {menu.title}
                            </Link>
                        )
                    })}
                </div>

                <div className="mx-6 border-t dark:border-slate-700" />

                {/* CTA WhatsApp */}
                <div className="px-6 pt-6">
                    <Link
                        href="https://wa.me/628xxxxxxxxx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Konsultasi WhatsApp
                    </Link>
                </div>

                {/* Emergency Contact */}
                <div className="px-6 pt-6 pb-8">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-border/50 dark:bg-slate-800 dark:border-slate-700">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider dark:text-slate-400">
                            Kontak Darurat
                        </p>
                        <a
                            href="tel:02511234567"
                            className="text-lg font-bold text-primary dark:text-primary-foreground"
                        >
                            (0251) 1234567
                        </a>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}