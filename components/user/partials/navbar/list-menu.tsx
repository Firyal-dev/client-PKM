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

// ── KOMPONEN RECURSIVE (Rahasia Nested Menu) ──
const MenuItem = ({ menu, allMenus, level = 0, pathname }: { menu: Menu, allMenus: Menu[], level?: number, pathname: string }) => {
    const children = getChildren(menu, allMenus)
    const hasChildren = children.length > 0
    const menuHref = `/${menu.slug}`
    const isActive = pathname === menuHref || pathname.startsWith(`${menuHref}/`)

    // ── SMART EDGE DETECTION (Biar gak tumpah ke luar layar) ──
    const [isNearRightEdge, setIsNearRightEdge] = useState(false)
    const liRef = useRef<HTMLLIElement>(null)

    const handleMouseEnter = () => {
        if (!liRef.current) return
        
        const rect = liRef.current.getBoundingClientRect()
        const dropdownWidth = 250 // Estimasi w-56 (224px) + margin aman
        
        if (level === 0) {
            // Level 0: Turun ke bawah. Cek apakah titik kirinya + lebar dropdown melebihi layar
            setIsNearRightEdge(rect.left + dropdownWidth > window.innerWidth)
        } else {
            // Level 1+: Buka ke samping. Cek apakah titik kanannya + lebar dropdown melebihi layar
            setIsNearRightEdge(rect.right + dropdownWidth > window.innerWidth)
        }
    }

    // Bikin nama group Tailwind unik
    const groupName = level === 0 ? 'group/main' :
                      level === 1 ? 'group/sub1' :
                      level === 2 ? 'group/sub2' :
                      level === 3 ? 'group/sub3' : 'group/sub4'

    const hoverTarget = groupName.split('/')[1] // ngambil 'main', 'sub1', dll

    // Dinamis: Class dasar dropdown
    const baseDropdown = `absolute opacity-0 pointer-events-none transition-all duration-300 z-50 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col py-1`
    
    // Dinamis: Arah buka dropdown berdasarkan deteksi tepi layar
    let positionClasses = ""
    if (level === 0) {
        positionClasses = `top-full pt-4 translate-y-2 group-hover/${hoverTarget}:opacity-100 group-hover/${hoverTarget}:pointer-events-auto group-hover/${hoverTarget}:translate-y-0 ` +
            (isNearRightEdge ? "right-0" : "left-0")
    } else {
        positionClasses = `top-0 group-hover/${hoverTarget}:opacity-100 group-hover/${hoverTarget}:pointer-events-auto group-hover/${hoverTarget}:translate-x-0 ` +
            (isNearRightEdge 
                ? "right-full pr-2 translate-x-2" // Kalau mepet kanan, buka ke KIRI
                : "left-full pl-2 -translate-x-2") // Normal, buka ke KANAN
    }


    // LEVEL 0: Menu Utama di Navbar
    if (level === 0) {
        if (hasChildren) {
            return (
                <li ref={liRef} onMouseEnter={handleMouseEnter} className={`relative ${groupName} py-2`}>
                    <button
                        className={`
                            text-sm font-semibold tracking-wide transition-colors
                            flex items-center gap-1 cursor-default
                            ${isActive
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-slate-700 dark:text-slate-200 group-hover/main:text-blue-600 dark:group-hover/main:text-blue-400'
                            }
                        `}
                    >
                        {menu.title}
                        <ChevronDown className="w-3.5 h-3.5 opacity-70" strokeWidth={3} />
                    </button>
                    
                    <div className={`${baseDropdown} ${positionClasses}`}>
                        {children.map((child) => (
                            <MenuItem key={child.id} menu={child} allMenus={allMenus} level={1} pathname={pathname} />
                        ))}
                    </div>
                </li>
            )
        }

        return (
            <li>
                <NavLink href={menuHref} active={pathname === menuHref}>
                    {menu.title}
                </NavLink>
            </li>
        )
    }

    // LEVEL 1 & SETERUSNYA: Submenu di dalam Dropdown
    if (hasChildren) {
        return (
            <li ref={liRef} onMouseEnter={handleMouseEnter} className={`relative ${groupName} w-full`}>
                <button
                    className={`
                        w-full flex items-center justify-between px-5 py-2.5 text-sm transition-colors cursor-default text-left
                        ${isActive
                            ? 'bg-blue-50/50 text-blue-600 dark:bg-slate-700/50 dark:text-blue-400 font-medium'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400'
                        }
                    `}
                >
                    {menu.title}
                    {/* Icon Chevron dinamis: kalau buka kiri, panah nunjuk kiri */}
                    {isNearRightEdge ? (
                        <ChevronDown className="w-3.5 h-3.5 opacity-70 rotate-90" strokeWidth={3} /> 
                    ) : (
                        <ChevronRight className="w-3.5 h-3.5 opacity-70" strokeWidth={3} />
                    )}
                </button>
                
                <div className={`${baseDropdown} ${positionClasses}`}>
                    {children.map((child) => (
                        <MenuItem key={child.id} menu={child} allMenus={allMenus} level={level + 1} pathname={pathname} />
                    ))}
                </div>
            </li>
        )
    }

    // Anak terakhir yang nggak punya anak lagi
    return (
        <li className="w-full">
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

// ── KOMPONEN UTAMA ──
export default function ListMenu({ menus }: ListMenuProps) {
    const pathname = usePathname()

    const mainMenus = menus
        .filter(menu => getParentId(menu) === null && menu.status === 1)
        .sort((a, b) => a.order - b.order)

    return (
        <ul className="flex items-center gap-6">
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