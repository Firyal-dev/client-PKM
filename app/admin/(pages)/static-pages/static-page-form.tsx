"use client"

import { useActionState, useEffect, useState, useRef, useMemo } from "react"
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
import { AlertTriangle } from "lucide-react"
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

    const [selectedMenuId, setSelectedMenuId] = useState<string>(initialData?.menu_id || "")
    const [existingPage, setExistingPage] = useState<{ id: string; title: string; menu_title: string } | null>(null)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [isChecking, setIsChecking] = useState(false)

    // Flatten menus to include both parent and child menus, filter by static type
    const allMenus = useMemo(() => {
        const result: Menu[] = [...menus]
        menus.forEach(menu => {
            if (menu.children && menu.children.length > 0) {
                result.push(...menu.children)
            }
        })
        // Filter to only show static type menus
        return result.filter(menu => menu.type === 'static')
    }, [menus])

    const handleMenuChange = async (menuId: string) => {
        setSelectedMenuId(menuId)
        if (!menuId || menuId === initialData?.menu_id) {
            setExistingPage(null)
            return
        }
        setIsChecking(true)
        try {
            const result = await checkMenuStaticPageLink(menuId)
            if (result) {
                setExistingPage(result)
                setShowConfirmDialog(true)
            } else {
                setExistingPage(null)
            }
        } catch {
            setExistingPage(null)
        } finally {
            setIsChecking(false)
        }
    }

    const handleConfirmReplace = () => {
        setShowConfirmDialog(false)
        const el = document.getElementById('force_replace_input') as HTMLInputElement
        if (el) el.value = "true"
        formRef.current?.requestSubmit()
    }

    const handleCancelReplace = () => {
        setShowConfirmDialog(false)
        setExistingPage(null)
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
            <form ref={formRef} action={formAction} className="space-y-5">

                {/* ── Menu ── */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Menu</Label>
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
                            {allMenus.map((menu) => (
                                <SelectItem key={menu.id} value={menu.id}>
                                    {menu.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <input type="hidden" name="menu_id_input" id="menu_id_input" defaultValue={initialData?.menu_id} />

                    {existingPage && (
                        <p className="text-xs text-amber-500 flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            Menu ini sudah terhubung ke: <strong>{existingPage.title}</strong>
                        </p>
                    )}
                </div>

                {/* ── Judul ── */}
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">Judul Halaman</Label>
                    <Input
                        id="title"
                        name="title"
                        placeholder="Masukkan judul halaman"
                        defaultValue={initialData?.title}
                        required
                    />
                </div>

                {/* ── Konten ── */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Konten</Label>
                    <RichEditor
                        name="static_content"
                        id="static_content"
                        defaultValue={initialData?.static_content || ""}
                    />
                </div>

                <input type="hidden" name="force_replace" id="force_replace_input" value="false" />

                {/* ── Actions ── */}
                <div className="flex gap-3 pt-2 border-t border-border">
                    <Button
                        type="submit"
                        disabled={isPending || isChecking}
                        className="flex-1 h-10 font-medium"
                    >
                        {isPending ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Buat Halaman"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="h-10 px-5"
                    >
                        Batal
                    </Button>
                </div>
            </form>

            <ConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                title="Menu Sudah Terhubung"
                description={`Menu "${existingPage?.menu_title}" sudah terhubung ke halaman "${existingPage?.title}". Ingin mengganti? Halaman sebelumnya tetap ada tapi tautannya akan dihapus.`}
                onConfirm={handleConfirmReplace}
                onCancel={handleCancelReplace}
                confirmText="Ya, Ganti"
                cancelText="Batal"
                variant="default"
            />
        </>
    )
}