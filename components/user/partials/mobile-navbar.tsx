"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, MessageSquare } from "lucide-react"

import { menuList } from "@/constants/navbar-data"
import { cn } from "@/lib/utils"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

export default function MobileNavbar() {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {/* Trigger */}
            <SheetTrigger asChild>
                <button className="lg:hidden p-2 rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                    <Menu className="w-6 h-6" strokeWidth={2.5} />
                </button>
            </SheetTrigger>

            {/* Content */}
            <SheetContent side="right" className="w-[300px] sm:w-[380px] px-0">
                {/* Header */}
                <SheetHeader className="px-6 pb-6 border-b">
                    <SheetTitle>
                        <Link
                            href="/"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3"
                        >
                            <div className="bg-primary/5 p-2 rounded-xl ring-1 ring-primary/10">
                                <Image
                                    src="/puskesmasLogo.png"
                                    alt="Logo Puskesmas"
                                    width={32}
                                    height={32}
                                />
                            </div>
                            <div>
                                <p className="font-bold text-lg leading-none text-primary">
                                    PUSKESMAS
                                </p>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                                    Kecamatan Sehat
                                </p>
                            </div>
                        </Link>
                    </SheetTitle>
                </SheetHeader>

                {/* Menu */}
                <div className="flex flex-col gap-1 px-4 py-6">
                    {menuList.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="px-4 py-3 rounded-xl text-base font-medium transition-all"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="mx-6 border-t" />

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
                    <div className="p-4 rounded-2xl bg-slate-50 border border-border/50">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Kontak Darurat
                        </p>
                        <a
                            href="tel:02511234567"
                            className="text-lg font-bold text-primary"
                        >
                            (0251) 1234567
                        </a>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
