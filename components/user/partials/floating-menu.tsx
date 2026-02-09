"use client"

import { useState, useContext, createContext, useEffect  } from "react"
import { Plus, Headset } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type FloatingMenuContextType = {
    isOpen: boolean
    closeMenu: () => void
}

const FloatingMenuContext = createContext<FloatingMenuContextType | null>(null)

export function useFloatingMenu() {
    const context = useContext(FloatingMenuContext)
    if (!context) {
        throw new Error("useFloatingMenu must be used within a FloatingMenu")
    }
    return context
}

interface FloatingMenuProps {
    children: React.ReactNode
}

export function FloatingMenu({ children }: FloatingMenuProps) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => setIsOpen(!isOpen)
    const closeMenu = () => setIsOpen(false)

    // Close menu when clicking outside (optional, but good UX)
    useEffect(() => {
        const handleclick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (isOpen && !target.closest("#floating-menu-container")) {
                setIsOpen(false)
            }
        }
        document.addEventListener("click", handleclick)
        return () => document.removeEventListener("click", handleclick)
    }, [isOpen])

    return (
        <FloatingMenuContext.Provider value={{ isOpen, closeMenu }}>
            <div id="floating-menu-container" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

                {/* Children Container */}
                <div
                    className={cn(
                        "flex flex-col items-end gap-3 transition-all duration-300 ease-in-out",
                        isOpen
                            ? "translate-y-0 opacity-100 visible"
                            : "translate-y-10 opacity-0 invisible pointer-events-none"
                    )}
                >
                    {children}
                </div>

                {/* Main Toggle Button */}
                <Button
                    size="icon"
                    className={cn(
                        "h-14 w-14 rounded-full shadow-lg transition-transform duration-300 z-50",
                        isOpen ? "bg-slate-800 hover:bg-slate-900" : "bg-blue-600 hover:bg-blue-700"
                    )}
                    onClick={toggleMenu}
                    aria-label="Menu Bantuan"
                >
                    {isOpen ? <Plus className="h-6 w-6 text-white rotate-45" /> : <Headset className="h-6 w-6 text-white" />}
                </Button>
            </div>
        </FloatingMenuContext.Provider>
    )
}
