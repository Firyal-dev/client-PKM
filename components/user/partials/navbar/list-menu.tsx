'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from '@/services/menu/menu-service'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState, useRef } from 'react'

interface ListMenuProps {
    menus: Menu[]
}

// ── Helper buat ngecek id parent ──
const getParentId = (menu: Menu): string | null => {
    return menu.parent_id ?? menu.parent?.id ?? null
}

// ── Helper buat nyari anak-anak dari sebuah menu ──
const getChildren = (menu: Menu, allMenus: Menu[]) => {
    return (menu.children && menu.children.length > 0)
        ? menu.children.filter(sub => sub.status === 1).sort((a, b) => a.order - b.order)
        : allMenus
            .filter(sub => getParentId(sub) === menu.id && sub.status === 1)
            .sort((a, b) => a.order - b.order)
}

// ── KOMPONEN RECURSIVE ──
const MenuItem = ({ menu, allMenus, level = 0, pathname }: { menu: Menu, allMenus: Menu[], level?: number, pathname: string }) => {
    const children = getChildren(menu, allMenus)
    const hasChildren = children.length > 0
    const menuHref = `/${menu.slug}`
    const isActive = pathname === menuHref || pathname.startsWith(`${menuHref}/`)

    const [isOpen, setIsOpen] = useState(false)
    const [isNearRightEdge, setIsNearRightEdge] = useState(false)
    const liRef = useRef<HTMLLIElement>(null)

    const handleMouseEnter = () => {
        if (liRef.current) {
            const rect = liRef.current.getBoundingClientRect()
            const dropdownWidth = 250
            if (level === 0) {
                setIsNearRightEdge(rect.left + dropdownWidth > window.innerWidth)
            } else {
                setIsNearRightEdge(rect.right + dropdownWidth > window.innerWidth)
            }
        }
        setIsOpen(true)
    }

    const handleMouseLeave = () => {
        setIsOpen(false)
    }

    // Base dropdown styles
    const baseDropdown = `absolute transition-all duration-300 z-50 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col py-1 list-none m-0`

    // Visibility
    const visibilityClasses = isOpen
        ? 'opacity-100 pointer-events-auto'
        : 'opacity-0 pointer-events-none'

    // Direction + animation
    let positionClasses = ''
    if (level === 0) {
        const slideClass = isOpen ? 'translate-y-0' : 'translate-y-2'
        positionClasses = `top-full pt-4 ${slideClass} ${isNearRightEdge ? 'right-0' : 'left-0'}`
    } else {
        const slideClass = isOpen
            ? 'translate-x-0'
            : isNearRightEdge ? 'translate-x-2' : '-translate-x-2'
        positionClasses = `top-0 ${slideClass} ${isNearRightEdge ? 'right-full pr-2' : 'left-full pl-2'}`
    }

    // Kalau TIDAK punya anak (Leaf Node)
    if (!hasChildren) {
        if (level === 0) {
            return (
                <li>
                    <NavLink href={menuHref} active={pathname === menuHref}>
                        {menu.title}
                    </NavLink>
                </li>
            )
        }
        return (
            <li className="w-full relative">
                <Link
                    href={menuHref}
                    className={`
                        block px-5 py-2.5 text-sm transition-colors text-left
                        ${pathname === menuHref
                            ? 'bg-blue-50/50 text-blue-600 dark:bg-slate-700/50 dark:text-blue-400 font-medium'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400'
                        }
                    `}
                >
                    {menu.title}
                </Link>
            </li>
        )
    }

    // Kalau PUNYA anak (Dropdown)
    return (
        <li
            ref={liRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative ${level === 0 ? 'py-2' : 'w-full'}`}
        >
            <button
                className={
                    level === 0
                        ? `text-sm font-semibold tracking-wide transition-colors flex items-center gap-1 cursor-default ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400'}`
                        : `w-full flex items-center justify-between px-5 py-2.5 text-sm transition-colors cursor-default text-left ${isActive ? 'bg-blue-50/50 text-blue-600 dark:bg-slate-700/50 dark:text-blue-400 font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400'}`
                }
            >
                {menu.title}
                {level === 0 ? (
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" strokeWidth={3} />
                ) : (
                    isNearRightEdge ? (
                        <ChevronDown className="w-3.5 h-3.5 opacity-70 rotate-90" strokeWidth={3} />
                    ) : (
                        <ChevronRight className="w-3.5 h-3.5 opacity-70" strokeWidth={3} />
                    )
                )}
            </button>

            <ul className={`${baseDropdown} ${positionClasses} ${visibilityClasses}`}>
                {children.map((child) => (
                    <MenuItem key={child.id} menu={child} allMenus={allMenus} level={level + 1} pathname={pathname} />
                ))}
            </ul>
        </li>
    )
}
// ── KOMPONEN UTAMA ──
export default function ListMenu({ menus }: ListMenuProps) {
    const pathname = usePathname()

    const mainMenus = menus
        .filter(menu => getParentId(menu) === null && menu.status === 1)
        .sort((a, b) => a.order - b.order)

    return (
        <ul className="flex items-center gap-6 list-none m-0 p-0">
            <li>
                <NavLink href="/" active={pathname === '/'}>
                    Beranda
                </NavLink>
            </li>

            {mainMenus.map((menu) => (
                <MenuItem
                    key={menu.id}
                    menu={menu}
                    allMenus={menus}
                    level={0}
                    pathname={pathname}
                />
            ))}
        </ul>
    )
}

function NavLink({ href, children, active, className = '' }: { href: string, children: React.ReactNode, active?: boolean, className?: string }) {
    return (
        <Link href={href} className={`relative text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-blue-600 dark:after:bg-blue-400 after:transition-transform hover:after:scale-x-100 ${active ? 'text-blue-600 dark:text-blue-400 after:scale-x-100' : ''} ${className}`}>
            {children}
        </Link>
    )
}