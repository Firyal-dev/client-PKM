"use client"

import { menuList } from "@/constants/navbar-data"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function MobileNavbar() {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="lg:hidden p-2 rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                    <Menu className="w-6 h-6" strokeWidth={2.5} />
                </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="text-left border-b pb-6">
                    <SheetTitle>
                        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                            <div className="bg-primary/5 p-1.5 rounded-xl ring-1 ring-primary/10 shadow-sm">
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
                    </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-2 mt-8">
                    {menuList.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-muted-foreground transition-all"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="absolute bottom-8 left-6 right-6">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border/50">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Kontak Darurat</p>
                        <p className="text-lg font-bold text-primary">(0251) 1234567</p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
