'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu as MenuIcon, X, Phone, Mail } from 'lucide-react'
import { Menu } from '@/services/menu/menu-service'
import SocialIcon from './social-icon'

interface ListMenuProps {
    menus: Menu[]
}

// Dummy contact info - bisa diganti dari database
const dummyPhone = '(0251) 1234567'
const dummyEmail = 'puskesmas@kecamatansaht.co.id'

export default function ListMenu({ menus }: ListMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    // Filter menu utama dan urutkan
    const mainMenus = menus
        .filter(menu => menu.parent_id === null && menu.status === 1)
        .sort((a, b) => a.order - b.order)

    return (
        <nav className="flex items-center">
            {/* Toggle Button Mobile */}
            <button
                className="md:hidden p-2 text-primary dark:text-primary-foreground z-50"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                {isOpen ? <X size={28} /> : <MenuIcon size={28} />}
            </button>

            {/* Menu Desktop */}
            <ul className="hidden md:flex items-center gap-6">
                <li>
                    {/* Menu Beranda selalu ada */}
                    <NavLink href="/" active={pathname === '/'}>
                        Beranda
                    </NavLink>
                </li>

                {/* Tampilkan menu dinamis dari database */}
                {mainMenus.map((menu) => {
                    // Cari anak menu (submenu)
                    const subMenus = menus
                        .filter(sub => sub.parent_id === menu.id && sub.status === 1)
                        .sort((a, b) => a.order - b.order)

                    const hasSubMenus = subMenus.length > 0

                    if (hasSubMenus) {
                        return (
                            <li key={menu.id} className="relative group">
                                <NavLink href={`/${menu.slug}`} active={pathname === `/${menu.slug}`}>
                                    {menu.title}
                                </NavLink>
                                {/* Dropdown Submenu */}
                                <ul className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                    {subMenus.map((subMenu) => (
                                        <li key={subMenu.id}>
                                            <NavLink
                                                href={`/${subMenu.slug}`}
                                                active={pathname === `/${subMenu.slug}`}
                                                className="block px-4 py-2 text-sm hover:bg-primary/5 dark:hover:bg-primary/20"
                                            >
                                                {subMenu.title}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        )
                    }

                    return (
                        <li key={menu.id}>
                            <NavLink href={`/${menu.slug}`} active={pathname === `/${menu.slug}`}>
                                {menu.title}
                            </NavLink>
                        </li>
                    )
                })}
            </ul>

            {/* Mobile Menu */}
            <div
                className={`
          md:hidden fixed inset-x-0 top-[120px] mx-4 p-6 rounded-2xl
          bg-white dark:bg-slate-800 shadow-2xl border dark:border-slate-700
          transition-all duration-300 transform z-40
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}
        `}
            >
                <ul className="flex flex-col gap-2">
                    {/* Menu Beranda Mobile */}
                    <MobileLink href="/" onClick={() => setIsOpen(false)} active={pathname === '/'}>
                        Beranda
                    </MobileLink>

                    {/* Loop Menu Dinamis Mobile */}
                    {mainMenus.map((menu) => {
                        const subMenus = menus
                            .filter(sub => sub.parent_id === menu.id && sub.status === 1)
                            .sort((a, b) => a.order - b.order)

                        const hasSubMenus = subMenus.length > 0

                        if (hasSubMenus) {
                            return (
                                <li key={menu.id}>
                                    <div className="px-4 py-2 rounded-lg font-medium text-primary dark:text-primary-foreground">
                                        {menu.title}
                                    </div>
                                    <ul className="ml-4 border-l-2 border-primary/20 pl-4 space-y-1">
                                        {subMenus.map((subMenu) => (
                                            <MobileLink
                                                key={subMenu.id}
                                                href={`/${subMenu.slug}`}
                                                onClick={() => setIsOpen(false)}
                                                active={pathname === `/${subMenu.slug}`}
                                            >
                                                {subMenu.title}
                                            </MobileLink>
                                        ))}
                                    </ul>
                                </li>
                            )
                        }

                        return (
                            <MobileLink
                                key={menu.id}
                                href={`/${menu.slug}`}
                                onClick={() => setIsOpen(false)}
                                active={pathname === `/${menu.slug}`}
                            >
                                {menu.title}
                            </MobileLink>
                        )
                    })}

                    {/* Contact Info di Mobile */}
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
                        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                            <Phone size={16} className="text-blue-500" />
                            <span>{dummyPhone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                            <Mail size={16} className="text-blue-500" />
                            <span className="truncate">{dummyEmail}</span>
                        </div>
                    </div>
                </ul>
            </div>
        </nav>
    )
}

// Desktop NavLink Component
function NavLink({
    href,
    children,
    active,
    className = '',
}: {
    href: string
    children: React.ReactNode
    active?: boolean
    className?: string
}) {
    return (
        <Link
            href={href}
            className={`
        relative text-sm font-semibold tracking-wide
        text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400
        transition-all
        after:absolute after:-bottom-1 after:left-0
        after:h-[2px] after:w-full after:origin-left
        after:scale-x-0 after:bg-blue-600 dark:after:bg-blue-400 after:transition-transform
        hover:after:scale-x-100
        ${active ? 'text-blue-600 dark:text-blue-400 after:scale-x-100' : ''}
        ${className}
      `}
        >
            {children}
        </Link>
    )
}

// Mobile Link Component
function MobileLink({
    href,
    children,
    onClick,
    active,
}: {
    href: string
    children: React.ReactNode
    onClick: () => void
    active?: boolean
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`
        px-4 py-2 rounded-lg text-sm font-medium 
        transition
        ${active
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
                }
      `}
        >
            {children}
        </Link>
    )
}
