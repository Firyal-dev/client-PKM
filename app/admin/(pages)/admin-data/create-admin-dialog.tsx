'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserPlus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createAdmin } from "@/services/admin/admin-data-service"
import { Admin } from "@/types/admin"

interface CreateAdminDialogProps {
    children?: React.ReactNode
}

export function CreateAdminDialog({ children }: CreateAdminDialogProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [nameError, setNameError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    // Form state
    const [formName, setFormName] = useState("")
    const [formPassword, setFormPassword] = useState("")
    const [formLevel, setFormLevel] = useState<"operator" | "super_admin">("operator")

    const validateName = (name: string): boolean => {
        const nameRegex = /^[a-zA-Z0-9]+$/
        if (!nameRegex.test(name)) {
            setNameError("Nama hanya boleh huruf dan angka, tanpa spasi atau karakter khusus")
            return false
        }
        setNameError("")
        return true
    }

    const validatePassword = (password: string): boolean => {
        if (password.length < 8) {
            setPasswordError("Password minimal 8 karakter")
            return false
        }
        setPasswordError("")
        return true
    }

    const handleNameChange = (value: string) => {
        setFormName(value)
        if (value) validateName(value)
        else setNameError("")
    }

    const handlePasswordChange = (value: string) => {
        setFormPassword(value)
        if (value) validatePassword(value)
        else setPasswordError("")
    }

    const handleSubmit = async () => {
        if (!formName || !formPassword) return

        const isNameValid = validateName(formName)
        const isPasswordValid = validatePassword(formPassword)

        if (!isNameValid || !isPasswordValid) return

        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append("name", formName)
            formData.append("password", formPassword)
            formData.append("level", formLevel)

            const result = await createAdmin(formData)
            if (result.success) {
                toast.success("Admin berhasil dibuat")
                setOpen(false)
                resetForm()
                router.refresh()
            } else {
                toast.error(result.error || "Gagal membuat admin")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setFormName("")
        setFormPassword("")
        setFormLevel("operator")
        setNameError("")
        setPasswordError("")
    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
        if (!isOpen) resetForm()
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children || (
                    <Button>
                        Tambah Admin
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tambah Admin Baru</DialogTitle>
                    <DialogDescription>
                        Tambahkan admin baru dengan mengisi form di bawah.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input
                            id="name"
                            value={formName}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="Masukkan nama admin"
                        />
                        {nameError && <p className="text-xs text-red-500">{nameError}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formPassword}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            placeholder="Masukkan password"
                        />
                        {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="level">Level</Label>
                        <Select
                            value={formLevel}
                            onValueChange={(value) => setFormLevel(value as "operator" | "super_admin")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="operator">Operator</SelectItem>
                                <SelectItem value="super_admin">Super Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !formName || !formPassword}
                    >
                        {isSubmitting ? "Menyimpan..." : "Simpan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// Edit Admin Dialog
interface EditAdminDialogProps {
    admin: Admin
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditAdminDialog({ admin, open, onOpenChange }: EditAdminDialogProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [nameError, setNameError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    const [formName, setFormName] = useState(admin?.name || "")
    const [formPassword, setFormPassword] = useState("")
    const [formLevel, setFormLevel] = useState<"operator" | "super_admin">(admin?.level as "operator" | "super_admin" || "operator")

    const validateName = (name: string): boolean => {
        const nameRegex = /^[a-zA-Z0-9]+$/
        if (!nameRegex.test(name)) {
            setNameError("Nama hanya boleh huruf dan angka, tanpa spasi atau karakter khusus")
            return false
        }
        setNameError("")
        return true
    }

    const validatePassword = (password: string): boolean => {
        if (password && password.length < 8) {
            setPasswordError("Password minimal 8 karakter")
            return false
        }
        setPasswordError("")
        return true
    }

    const handleNameChange = (value: string) => {
        setFormName(value)
        if (value) validateName(value)
        else setNameError("")
    }

    const handlePasswordChange = (value: string) => {
        setFormPassword(value)
        if (value) validatePassword(value)
        else setPasswordError("")
    }

    const handleSubmit = async () => {
        if (!formName || !admin) return

        const isNameValid = validateName(formName)
        const isPasswordValid = validatePassword(formPassword)

        if (!isNameValid || !isPasswordValid) return

        setIsSubmitting(true)
        try {
            const data: { name: string; level: "operator" | "super_admin"; password?: string } = {
                name: formName,
                level: formLevel
            }
            if (formPassword) {
                data.password = formPassword
            }

            const { updateAdmin } = await import("@/services/admin/admin-data-service")
            const result = await updateAdmin(admin?.id, data)
            if (result.success) {
                toast.success("Admin berhasil diperbarui")
                onOpenChange(false)
                router.refresh()
            } else {
                toast.error(result.error || "Gagal memperbarui admin")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Admin</DialogTitle>
                    <DialogDescription>
                        Perbarui informasi admin di bawah ini.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-name">Nama</Label>
                        <Input
                            id="edit-name"
                            value={formName}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="Masukkan nama admin"
                        />
                        {nameError && <p className="text-xs text-red-500">{nameError}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-password">
                            Password (kosongkan jika tidak ingin mengubah)
                        </Label>
                        <Input
                            id="edit-password"
                            type="password"
                            value={formPassword}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            placeholder="••••••••"
                        />
                        {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-level">Level</Label>
                        <Select
                            value={formLevel}
                            onValueChange={(value) => setFormLevel(value as "operator" | "super_admin")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="operator">Operator</SelectItem>
                                <SelectItem value="super_admin">Super Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !formName}
                    >
                        {isSubmitting ? "Menyimpan..." : "Perbarui"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
