"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu as MenuIcon, ChevronDown, Phone, X, Home, Image as ImageIcon, Calendar, FileText, Layers } from "lucide-react"
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
    webInfo?: {
        logo?: string | null
        web_title?: string | null
        contact?: string | null
    }
}

export default function MobileNavbar({ menus = [], webInfo }: MobileNavbarProps) {
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({})

    useEffect(() => { setMounted(true) }, [])

    const getParentId = (menu: MenuType): string | null =>
        menu.parent_id ?? menu.parent?.id ?? null

    const mainMenus = menus
        .filter(menu => getParentId(menu) === null && menu.status === 1)
        .sort((a, b) => a.order - b.order)

    const toggleMenu = (id: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const emergencyContact = webInfo?.contact || '0251 1234567'

    const triggerBtn = (
        <button className={cn(
            "lg:hidden relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
            "bg-white/12 border border-white/20 text-white hover:bg-white/20",
            "[header[data-scroll=up]_&]:bg-slate-100 [header[data-scroll=up]_&]:border-slate-200",
            "[header[data-scroll=up]_&]:text-slate-600 [header[data-scroll=up]_&]:hover:bg-slate-200",
        )}>
            <MenuIcon className="w-5 h-5" strokeWidth={2.2} />
        </button>
    )

    if (!mounted) return triggerBtn

    const staticMenus = [
        { href: "/", label: "Beranda", icon: Home },
        { href: "/galeri", label: "Galeri", icon: ImageIcon },
        { href: "/agenda", label: "Agenda", icon: Calendar },
    ]

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{triggerBtn}</SheetTrigger>

            <SheetContent
                side="left"
                className="w-[280px] sm:w-[320px] p-0 border-l border-slate-100 flex flex-col bg-white"
            >
                {/* ── Header ── */}
                <SheetHeader className="relative shrink-0 px-5 py-4 border-b border-slate-100">
                    <SheetTitle className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                        Navigasi
                    </SheetTitle>
                </SheetHeader>

                {/* ── Menu list ── */}
                <div className="flex-1 overflow-y-auto px-2 py-3">

                    {staticMenus.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-3 py-3 rounded-xl text-[13.5px] font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-all group"
                        >
                            <Icon className="w-[17px] h-[17px] text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" strokeWidth={1.8} />
                            {label}
                        </Link>
                    ))}

                    {mainMenus.length > 0 && (
                        <div className="mx-3 my-2 h-px bg-slate-100" />
                    )}

                    {mainMenus.map((menu) => {
                        const subMenus = (menu.children && menu.children.length > 0)
                            ? menu.children.filter(s => s.status === 1).sort((a, b) => a.order - b.order)
                            : menus.filter(s => getParentId(s) === menu.id && s.status === 1).sort((a, b) => a.order - b.order)

                        const hasSubMenus = subMenus.length > 0
                        const isExpanded = expandedMenus[menu.id]

                        if (hasSubMenus) {
                            return (
                                <div key={menu.id}>
                                    <button
                                        onClick={(e) => toggleMenu(menu.id, e)}
                                        className={cn(
                                            "flex items-center gap-3 w-full px-3 py-3 rounded-xl text-[13.5px] font-medium transition-all text-left group",
                                            isExpanded
                                                ? "text-blue-700 bg-blue-50"
                                                : "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                                        )}
                                    >
                                        <Layers className={cn(
                                            "w-[17px] h-[17px] shrink-0 transition-colors",
                                            isExpanded ? "text-blue-500" : "text-slate-400 group-hover:text-blue-500"
                                        )} strokeWidth={1.8} />
                                        <span className="flex-1">{menu.title}</span>
                                        <ChevronDown className={cn(
                                            "w-3.5 h-3.5 text-slate-400 transition-transform duration-300 shrink-0",
                                            isExpanded && "rotate-180 text-blue-400"
                                        )} />
                                    </button>

                                    <div className={cn(
                                        "grid transition-all duration-300 ease-in-out",
                                        isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                    )}>
                                        <div className="overflow-hidden">
                                            <div className="ml-[42px] border-l-2 border-slate-100 pl-3 py-1 space-y-0.5">
                                                {subMenus.map((sub) => (
                                                    <Link
                                                        key={sub.id}
                                                        href={`/${sub.slug}`}
                                                        onClick={() => setOpen(false)}
                                                        className="block px-3 py-2.5 rounded-lg text-[13px] text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-all"
                                                    >
                                                        {sub.title}
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
                                className="flex items-center gap-3 px-3 py-3 rounded-xl text-[13.5px] font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-all group"
                            >
                                <FileText className="w-[17px] h-[17px] text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" strokeWidth={1.8} />
                                {menu.title}
                            </Link>
                        )
                    })}
                </div>

                {/* ── Footer — satu tombol ── */}
                <div className="shrink-0 p-4 border-t border-slate-100">
                    <a
                        href={`tel:${emergencyContact.replace(/\D/g, '')}`}
                        className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors"
                    >
                        <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                            <Phone className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold text-blue-200 uppercase tracking-widest leading-none">Hubungi Kami</p>
                            <p className="text-[14px] font-bold text-white leading-tight mt-0.5">{emergencyContact}</p>
                        </div>
                    </a>
                </div>
            </SheetContent>
        </Sheet>
    )
}