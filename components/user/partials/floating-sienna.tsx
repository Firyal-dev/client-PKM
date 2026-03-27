"use client"
import { Accessibility } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingSienna() {
    const handleOpen = () => {
        // Trigger default sienna accessibility button
        const siennaButton = document.querySelector('.asw-menu-btn') as HTMLButtonElement | null
        if (siennaButton) {
            siennaButton.click()
        }
    }

    return (
        <div className="fixed bottom-6 left-6 z-50 group flex items-center gap-2">
            <Button
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-600 text-white transition-all hover:scale-105 active:scale-95"
                onClick={handleOpen}
                aria-label="Aksesibilitas"
            >
                <Accessibility className="h-6 w-6" />
            </Button>
            <span className="bg-white/95 backdrop-blur-sm text-slate-800 text-sm font-medium px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity whitespace-nowrap pointer-events-none translate-x-[-10px] group-hover:translate-x-0 group-focus-within:translate-x-0 transition-transform duration-200">
                Aksesibilitas
            </span>
        </div>
    )
}
