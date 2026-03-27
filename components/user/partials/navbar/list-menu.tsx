'use client'

import Link from 'next/link'
import { TenantLink } from '@/components/user/partials/tenant-link'
import { usePathname } from 'next/navigation'
import { Menu } from '@/services/menu/menu-service'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ListMenuProps {
    menus: Menu[]
}

function useScrollState() {
    const [state, setState] = useState('top')
    useEffect(() => {
        const header = document.querySelector('header[data-scroll]')
        if (!header) return
        const update = () => setState(header.getAttribute('data-scroll') ?? 'top')
        const obs = new MutationObserver(update)
        obs.observe(header, { attributes: true, attributeFilter: ['data-scroll'] })
        update()
        return () => obs.disconnect()
    }, [])
    return state
}

const getParentId = (menu: Menu): string | null => menu.parent_id ?? menu.parent?.id ?? null

const getChildren = (menu: Menu, allMenus: Menu[]) =>
    (menu.children && menu.children.length > 0)
        ? menu.children.filter(s => s.status === 1).sort((a, b) => a.order - b.order)
        : allMenus.filter(s => getParentId(s) === menu.id && s.status === 1).sort((a, b) => a.order - b.order)

/* ─── NavLink ─── */
function NavLink({ href, children, active, isWhite }: {
    href: string; children: React.ReactNode; active?: boolean; isWhite?: boolean
}) {
    return (
        <TenantLink
            href={href}
            className={cn(
                'relative px-3.5 py-2 rounded-xl text-[13.5px] font-semibold tracking-[-0.01em] transition-all duration-200 block',
                isWhite
                    ? active
                        ? 'text-blue-700 bg-blue-50'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    : active
                        ? 'text-white bg-white/15'
                        : 'text-white/80 hover:text-white hover:bg-white/12'
            )}
        >
            {children}
            {active && (
                <span className={cn(
                    'absolute bottom-1.5 left-1/2 -translate-x-1/2 h-[2px] w-4 rounded-full',
                    isWhite ? 'bg-blue-600' : 'bg-white'
                )} />
            )}
        </TenantLink>
    )
}

/* ─── MenuItem ─── */
function MenuItem({ menu, allMenus, level = 0, pathname, isWhite }: {
    menu: Menu; allMenus: Menu[]; level?: number; pathname: string; isWhite: boolean
}) {
    const children = getChildren(menu, allMenus)
    const hasChildren = children.length > 0
    const menuHref = `/${menu.slug}`
    
    // Check if isActive considerando o tenant-prefix
    // Pathname di Client-Side (Next.js 15 App dir) akan berisi [tenantSlug]
    // Kita perlu berhati-hati dengan perbandingannya.
    const isActive = pathname.endsWith(menuHref) || pathname.includes(`${menuHref}/`)
    const [isOpen, setIsOpen] = useState(false)
    const [nearRight, setNearRight] = useState(false)
    const liRef = useRef<HTMLLIElement>(null)

    const onEnter = () => {
        if (liRef.current) {
            const rect = liRef.current.getBoundingClientRect()
            setNearRight(
                level === 0
                    ? rect.left + 220 > window.innerWidth
                    : rect.right + 220 > window.innerWidth
            )
        }
        setIsOpen(true)
    }

    if (!hasChildren) {
        if (level === 0) return <li><NavLink href={menuHref} active={isActive} isWhite={isWhite}>{menu.title}</NavLink></li>
        return (
            <li>
                <TenantLink href={menuHref} className={cn(
                    'block px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150',
                    isActive ? 'text-blue-700 bg-blue-50 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}>{menu.title}</TenantLink>
            </li>
        )
    }

    /* dropdown positioning */
    const dropBase = cn(
        'absolute z-50 w-52 bg-white rounded-2xl list-none m-0 py-1.5',
        'border border-slate-100',
        'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_16px_40px_-8px_rgba(0,60,150,0.12)]',
        'transition-all duration-200',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    )
    const dropPos = level === 0
        ? cn('top-full pt-3', isOpen ? 'translate-y-0' : 'translate-y-1.5', nearRight ? 'right-0' : 'left-1/2 -translate-x-1/2')
        : cn('top-0', nearRight ? 'right-full pr-2' : 'left-full pl-2', isOpen ? 'translate-x-0' : nearRight ? 'translate-x-1' : '-translate-x-1')

    return (
        <li
            ref={liRef}
            onMouseEnter={onEnter}
            onMouseLeave={() => setIsOpen(false)}
            className={cn('relative', level === 0 ? 'py-1.5' : 'w-full')}
        >
            <button className={cn(
                'flex items-center gap-1 text-[13.5px] font-semibold tracking-[-0.01em] transition-all duration-200 cursor-default',
                level === 0
                    ? isWhite
                        ? isActive ? 'text-blue-700' : 'text-slate-500 hover:text-slate-800'
                        : isActive ? 'text-white' : 'text-white/80 hover:text-white'
                    : cn('w-full justify-between px-3.5 py-2.5 rounded-xl',
                        isActive ? 'text-blue-700 bg-blue-50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )
            )}>
                <span>{menu.title}</span>
                {level === 0
                    ? <ChevronDown className={cn('w-3 h-3 opacity-60 transition-transform duration-200', isOpen && 'rotate-180')} strokeWidth={2.5} />
                    : <ChevronRight className={cn('w-3 h-3 opacity-60', nearRight && 'rotate-180')} strokeWidth={2.5} />
                }
            </button>

            <ul className={cn(dropBase, dropPos)}>
                {children.map(child => (
                    <MenuItem key={child.id} menu={child} allMenus={allMenus} level={level + 1} pathname={pathname} isWhite={true} />
                ))}
            </ul>
        </li>
    )
}

/* ─── ListMenu ─── */
export default function ListMenu({ menus }: ListMenuProps) {
    const pathname = usePathname()
    const scroll = useScrollState()
    const isWhite = scroll === 'up'

    const mainMenus = menus
        .filter(m => getParentId(m) === null && m.status === 1)
        .sort((a, b) => a.order - b.order)

    return (
        <ul className="flex items-center gap-0.5 list-none m-0 p-0">
            <li><NavLink href="/" active={pathname === '/'} isWhite={isWhite}>Beranda</NavLink></li>
            <li><NavLink href="/galeri" active={pathname === '/galeri'} isWhite={isWhite}>Galeri</NavLink></li>
            <li><NavLink href="/agenda" active={pathname === '/agenda'} isWhite={isWhite}>Agenda</NavLink></li>
            {mainMenus.map(menu => (
                <MenuItem key={menu.id} menu={menu} allMenus={menus} level={0} pathname={pathname} isWhite={isWhite} />
            ))}
        </ul>
    )
}