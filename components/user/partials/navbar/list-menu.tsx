'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu as MenuIcon, X, Phone, Mail } from 'lucide-react'
import { Menu } from '@/services/menu/menu-service'

interface ListMenuProps {
    menus: Menu[]
}

const dummyPhone = '(0251) 1234567'
const dummyEmail = 'puskesmas@kecamatansaht.co.id'

export default function ListMenu({ menus }: ListMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    // Normalisasi relasi parent: API kadang ngirim `parent` object tanpa `parent_id`
    const getParentId = (menu: Menu): string | null => {
        return menu.parent_id ?? menu.parent?.id ?? null
    }

    // Filter menu utama (yang gak punya parent)
    const mainMenus = menus
        .filter(menu => getParentId(menu) === null && menu.status === 1)
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
                    <NavLink href="/" active={pathname === '/'}>
                        Beranda
                    </NavLink>
                </li>

                {mainMenus.map((menu) => {
                    // Ambil submenu dari menu ini
                    const subMenus = (menu.children && menu.children.length > 0)
                        ? menu.children.filter(sub => sub.status === 1).sort((a, b) => a.order - b.order)
                        : menus
                            .filter(sub => getParentId(sub) === menu.id && sub.status === 1)
                            .sort((a, b) => a.order - b.order)

                    const hasSubMenus = subMenus.length > 0
                    const menuHref = `/${menu.slug}`

                    if (hasSubMenus) {
                        return (
                            <li key={menu.id} className="relative group/navitem py-2">
                                <Link
                                    href={menuHref}
                                    className={`
                                        text-sm font-semibold tracking-wide transition-colors
                                        flex items-center gap-1
                                        ${pathname === menuHref || pathname.startsWith(menuHref + '/')
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400'
                                        }
                                    `}
                                >
                                    {menu.title}
                                </Link>
                                {/* Dropdown Submenu */}
                                <div className="absolute top-full left-0 pt-4 w-56 opacity-0 pointer-events-none translate-y-2 group-hover/navitem:opacity-100 group-hover/navitem:pointer-events-auto group-hover/navitem:translate-y-0 transition-all duration-300 z-50">
                                    <ul className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden py-1">
                                        {subMenus.map((subMenu) => {
                                            const subMenuHref = `/${subMenu.slug}`
                                            return (
                                                <li key={subMenu.id} className="w-full">
                                                    <Link
                                                        href={subMenuHref}
                                                        className={`
                                                            block px-5 py-2.5 text-sm transition-colors
                                                            ${pathname === subMenuHref
                                                                ? 'bg-blue-50/50 text-blue-600 dark:bg-slate-700/50 dark:text-blue-400 font-medium'
                                                                : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50/50 hover:text-blue-600 dark:hover:bg-slate-700/50 dark:hover:text-blue-400'
                                                            }
                                                        `}
                                                    >
                                                        {subMenu.title}
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </li>
                        )
                    }

                    return (
                        <li key={menu.id}>
                            <NavLink href={menuHref} active={pathname === menuHref}>
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
                    <MobileLink href="/" onClick={() => setIsOpen(false)} active={pathname === '/'}>
                        Beranda
                    </MobileLink>

                    {mainMenus.map((menu) => {
                        const subMenus = (menu.children && menu.children.length > 0)
                            ? menu.children.filter(sub => sub.status === 1).sort((a, b) => a.order - b.order)
                            : menus
                                .filter(sub => getParentId(sub) === menu.id && sub.status === 1)
                                .sort((a, b) => a.order - b.order)

                        const hasSubMenus = subMenus.length > 0
                        const menuHref = `/${menu.slug}`

                        if (hasSubMenus) {
                            return (
                                <li key={menu.id}>
                                    <div className="px-4 py-2 rounded-lg font-medium text-primary dark:text-primary-foreground">
                                        {menu.title}
                                    </div>
                                    <ul className="ml-4 border-l-2 border-primary/20 pl-4 space-y-1">
                                        {subMenus.map((subMenu) => {
                                            const subMenuHref = `/${subMenu.slug}`
                                            return (
                                                <MobileLink
                                                    key={subMenu.id}
                                                    href={subMenuHref}
                                                    onClick={() => setIsOpen(false)}
                                                    active={pathname === subMenuHref}
                                                >
                                                    {subMenu.title}
                                                </MobileLink>
                                            )
                                        })}
                                    </ul>
                                </li>
                            )
                        }

                        return (
                            <MobileLink
                                key={menu.id}
                                href={menuHref}
                                onClick={() => setIsOpen(false)}
                                active={pathname === menuHref}
                            >
                                {menu.title}
                            </MobileLink>
                        )
                    })}

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
        </nav >
    )
}

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
