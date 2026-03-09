'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from '@/services/menu/menu-service'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ListMenuProps {
    menus: Menu[]
}

const getParentId = (menu: Menu): string | null => menu.parent_id ?? menu.parent?.id ?? null

const getChildren = (menu: Menu, allMenus: Menu[]) => {
    return (menu.children && menu.children.length > 0)
        ? menu.children.filter(sub => sub.status === 1).sort((a, b) => a.order - b.order)
        : allMenus
            .filter(sub => getParentId(sub) === menu.id && sub.status === 1)
            .sort((a, b) => a.order - b.order)
}

const MenuItem = ({ menu, allMenus, level = 0, pathname }: {
    menu: Menu
    allMenus: Menu[]
    level?: number
    pathname: string
}) => {
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
            const dropdownWidth = 220
            setIsNearRightEdge(
                level === 0
                    ? rect.left + dropdownWidth > window.innerWidth
                    : rect.right + dropdownWidth > window.innerWidth
            )
        }
        setIsOpen(true)
    }

    // Leaf node
    if (!hasChildren) {
        if (level === 0) {
            return (
                <li>
                    <NavLink href={menuHref} active={isActive}>
                        {menu.title}
                    </NavLink>
                </li>
            )
        }
        return (
            <li>
                <Link
                    href={menuHref}
                    className={cn(
                        "block px-4 py-2.5 text-sm transition-colors rounded-lg mx-1",
                        isActive
                            ? "bg-primary/8 text-primary font-medium"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                >
                    {menu.title}
                </Link>
            </li>
        )
    }

    // Dropdown
    const dropdownBase = cn(
        "absolute z-50 w-52 bg-white rounded-xl shadow-lg shadow-slate-200/80",
        "border border-slate-100 py-1.5 list-none m-0",
        "transition-all duration-200",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    )

    const dropdownPosition = level === 0
        ? cn(
            "top-full pt-3",
            isOpen ? "translate-y-0" : "translate-y-1",
            isNearRightEdge ? "right-0" : "left-0"
        )
        : cn(
            "top-0",
            isOpen
                ? "translate-x-0"
                : isNearRightEdge ? "translate-x-1" : "-translate-x-1",
            isNearRightEdge ? "right-full pr-2" : "left-full pl-2"
        )

    return (
        <li
            ref={liRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsOpen(false)}
            className={cn("relative", level === 0 ? "py-2" : "w-full")}
        >
            {/* Trigger */}
            <button
                className={cn(
                    "flex items-center gap-1 text-sm font-semibold transition-colors cursor-default",
                    level === 0
                        ? isActive
                            ? "text-primary"
                            : "text-slate-700 hover:text-primary"
                        : cn(
                            "w-full justify-between px-4 py-2.5 rounded-lg mx-1",
                            isActive
                                ? "bg-primary/8 text-primary"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )
                )}
            >
                {menu.title}
                {level === 0
                    ? <ChevronDown className={cn("w-3.5 h-3.5 opacity-60 transition-transform duration-200", isOpen && "rotate-180")} strokeWidth={2.5} />
                    : isNearRightEdge
                        ? <ChevronRight className="w-3.5 h-3.5 opacity-60 rotate-180" strokeWidth={2.5} />
                        : <ChevronRight className="w-3.5 h-3.5 opacity-60" strokeWidth={2.5} />
                }
            </button>

            {/* Dropdown list */}
            <ul className={cn(dropdownBase, dropdownPosition)}>
                {children.map((child) => (
                    <MenuItem
                        key={child.id}
                        menu={child}
                        allMenus={allMenus}
                        level={level + 1}
                        pathname={pathname}
                    />
                ))}
            </ul>
        </li>
    )
}

export default function ListMenu({ menus }: ListMenuProps) {
    const pathname = usePathname()

    const mainMenus = menus
        .filter(menu => getParentId(menu) === null && menu.status === 1)
        .sort((a, b) => a.order - b.order)

    return (
        <ul className="flex items-center gap-1 list-none m-0 p-0">
            <li>
                <NavLink href="/" active={pathname === '/'}>Beranda</NavLink>
            </li>
            <li>
                <NavLink href="/galeri" active={pathname === '/galeri'}>Galeri</NavLink>
            </li>
            <li>
                <NavLink href="/agenda" active={pathname === '/agenda'}>Agenda</NavLink>
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

function NavLink({ href, children, active }: {
    href: string
    children: React.ReactNode
    active?: boolean
}) {
    return (
        <Link
            href={href}
            className={cn(
                "relative px-3 py-2 text-sm font-semibold transition-colors rounded-lg block",
                "after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:rounded-full",
                "after:origin-left after:transition-transform after:duration-200",
                active
                    ? "text-primary after:bg-primary after:scale-x-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 after:bg-primary after:scale-x-0 hover:after:scale-x-100"
            )}
        >
            {children}
        </Link>
    )
}