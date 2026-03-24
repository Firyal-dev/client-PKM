"use client"
import { Accessibility } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFloatingMenu } from "./floating-menu"

export function FloatingSienna() {
    const { closeMenu } = useFloatingMenu()

    const handleOpen = () => {
        // Trigger default sienna accessibility button
        const siennaButton = document.querySelector('.asw-menu-btn') as HTMLButtonElement | null
        if (siennaButton) {
            siennaButton.click()
        }
        closeMenu()
    }

    return (
        <div className="flex items-center gap-2">
            <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-sm font-medium px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
                Aksesibilitas
            </span>
            <Button
                size="icon"
                className="h-12 w-12 rounded-full shadow-md bg-indigo-500 hover:bg-indigo-600 text-white"
                onClick={handleOpen}
            >
                <Accessibility className="h-5 w-5" />
            </Button>
        </div>
    )
}
