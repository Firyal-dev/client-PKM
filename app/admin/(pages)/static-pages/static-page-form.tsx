"use client"

import { useActionState, useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { StaticPage, checkMenuStaticPageLink } from "@/services/static-page/static-page-service"
import { Menu } from "@/services/menu/menu-service"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import dynamic from 'next/dynamic'

const RichEditor = dynamic(() => import('@/components/admin/rich-editor'), { ssr: false })

interface StaticPageFormProps {
    action: (state: any, formData: FormData) => Promise<any>
    initialData?: StaticPage
    menus: Menu[]
}

export function StaticPageForm({ action, initialData, menus }: StaticPageFormProps) {
    const router = useRouter()
    const [state, formAction, isPending] = useActionState(action, null)
    const formRef = useRef<HTMLFormElement>(null)

    // State for menu linkage check
    const [selectedMenuId, setSelectedMenuId] = useState<string>(initialData?.menu_id || "")
    const [existingPage, setExistingPage] = useState<{ id: string; title: string; menu_title: string } | null>(null)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [isChecking, setIsChecking] = useState(false)

    // Handle menu selection change
    const handleMenuChange = async (menuId: string) => {
        setSelectedMenuId(menuId)

        // Skip check if no menu selected or same menu as initial
        if (!menuId || menuId === initialData?.menu_id) {
            setExistingPage(null)
            return
        }

        // Check if menu already has a static page linked
        setIsChecking(true)
        try {
            const result = await checkMenuStaticPageLink(menuId)
            if (result) {
                // Found existing page - show confirmation dialog
                setExistingPage(result)
                setShowConfirmDialog(true)
            } else {
                setExistingPage(null)
            }
        } catch (error) {
            console.error("Error checking menu link:", error)
            setExistingPage(null)
        } finally {
            setIsChecking(false)
        }
    }

    // Handle confirmation to replace existing page link
    const handleConfirmReplace = () => {
        setShowConfirmDialog(false)
        // Set force_replace to true and submit
        const forceReplaceInput = document.getElementById('force_replace_input') as HTMLInputElement
        if (forceReplaceInput) {
            forceReplaceInput.value = "true"
        }
        // Submit the form
        if (formRef.current) {
            formRef.current.requestSubmit()
        }
    }

    // Handle cancel - reset menu selection
    const handleCancelReplace = () => {
        setShowConfirmDialog(false)
        setExistingPage(null)
        // Reset to initial value or empty
        setSelectedMenuId(initialData?.menu_id || "")
    }

    useEffect(() => {
        if (state?.success) {
            toast.success(initialData ? "Halaman statis diperbarui!" : "Halaman statis dibuat!")
            router.push("/admin/static-pages")
            router.refresh()
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state, initialData, router])

    return (
        <>
            <form ref={formRef} action={formAction} className="space-y-4">
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="menu_id">Menu</Label>
                        <Select
                            name="menu_id"
                            value={selectedMenuId}
                            onValueChange={handleMenuChange}
                            disabled={isChecking}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih menu..." />
                            </SelectTrigger>
                            <SelectContent>
                                {menus.map((menu) => (
                                    <SelectItem key={menu.id} value={menu.id}>
                                        {menu.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <input type="hidden" name="menu_id_input" id="menu_id_input" defaultValue={initialData?.menu_id} />
                        {existingPage && (
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                Perhatian: Menu ini sudah terhubung ke halaman: <strong>{existingPage.title}</strong>
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="title">Judul Halaman</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Masukkan judul halaman"
                            defaultValue={initialData?.title}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="static_content">Konten</Label>
                        <RichEditor
                            name="static_content"
                            id="static_content"
                            defaultValue={initialData?.static_content || ""}
                        />
                    </div>
                </div>

                {/* Hidden field for force_replace - will be set when user confirms */}
                <input type="hidden" name="force_replace" id="force_replace_input" value="false" />

                <div className="flex gap-4">
                    <Button type="submit" disabled={isPending || isChecking} className="w-full">
                        {isPending ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Buat Halaman"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Batal
                    </Button>
                </div>
            </form>

            {/* Confirmation Dialog for replacing existing menu link */}
            <ConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                title="Menu Sudah Terhubung"
                description={`Menu "${existingPage?.menu_title}" sudah terhubung ke halaman statis "${existingPage?.title}". 

Apakah Anda ingin mengganti halaman yang terhubung? Halaman sebelumnya akan tetap ada tetapi tautan ke menu ini akan dihapus.`}
                onConfirm={handleConfirmReplace}
                onCancel={handleCancelReplace}
                confirmText="Ya, Ganti"
                cancelText="Batal"
                variant="default"
            />
        </>
    )
}
