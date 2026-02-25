"use client"

import { useActionState, useEffect } from "react"
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
import { StaticPage } from "@/services/static-page/static-page-service"
import { Menu } from "@/services/menu/menu-service"
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
        <form action={formAction} className="space-y-4">
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="menu_id">Menu</Label>
                    <Select name="menu_id" defaultValue={initialData?.menu_id || undefined}>
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

            <div className="flex gap-4">
                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Buat Halaman"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Batal
                </Button>
            </div>
        </form>
    )
}
