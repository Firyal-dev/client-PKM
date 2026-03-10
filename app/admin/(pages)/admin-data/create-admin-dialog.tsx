'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserPlus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createAdmin } from "@/services/admin/admin-data-service"
import { getAllActivePuskes } from "@/services/admin/admin-data-service"
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
    const [puskesList, setPuskesList] = useState<{ id: string; name: string }[]>([])

    // Form state
    const [formName, setFormName] = useState("")
    const [formPassword, setFormPassword] = useState("")
    const [formRole, setFormRole] = useState<"OPERATOR" | "SUPER_ADMIN">("OPERATOR")
    const [formPuskesmasId, setFormPuskesmasId] = useState<string>("")

    // Load puskes list when dialog opens
    useEffect(() => {
        if (open && formRole === "OPERATOR") {
            getAllActivePuskes().then(setPuskesList).catch(() => setPuskesList([]))
        }
    }, [open, formRole])

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

        // Validasi: Operator wajib pilih puskes
        if (formRole === "OPERATOR" && !formPuskesmasId) {
            toast.error("Pilih puskesmas untuk operator")
            return
        }

        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append("name", formName)
            formData.append("password", formPassword)
            formData.append("role", formRole)
            if (formRole === "OPERATOR" && formPuskesmasId) {
                formData.append("puskesmas_id", formPuskesmasId)
            }

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
        setFormRole("OPERATOR")
        setFormPuskesmasId("")
        setNameError("")
        setPasswordError("")
    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
        if (!isOpen) resetForm()
    }

    const handleRoleChange = (value: string) => {
        setFormRole(value as "OPERATOR" | "SUPER_ADMIN")
        if (value === "SUPER_ADMIN") {
            setFormPuskesmasId("")
        }
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
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={formRole}
                            onValueChange={handleRoleChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="OPERATOR">Operator</SelectItem>
                                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {formRole === "OPERATOR" && (
                        <div className="grid gap-2">
                            <Label htmlFor="puskes">Puskesmas</Label>
                            <Select
                                value={formPuskesmasId}
                                onValueChange={setFormPuskesmasId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih puskesmas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {puskesList.map((puskes) => (
                                        <SelectItem key={puskes.id} value={puskes.id}>
                                            {puskes.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Maksimum 2 operator per puskesmas
                            </p>
                        </div>
                    )}
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
    const [puskesList, setPuskesList] = useState<{ id: string; name: string }[]>([])
    const [confirmPassword, setConfirmPassword] = useState("")

    const [formName, setFormName] = useState(admin?.name || "")
    const [formPassword, setFormPassword] = useState("")
    const [formRole, setFormRole] = useState<"OPERATOR" | "SUPER_ADMIN">(admin?.role as "OPERATOR" | "SUPER_ADMIN" || "OPERATOR")
    const [formPuskesmasId, setFormPuskesmasId] = useState(admin?.puskesmas_id || "")

    // Load puskes list when dialog opens
    useEffect(() => {
        if (open && formRole === "OPERATOR") {
            getAllActivePuskes().then(setPuskesList).catch(() => setPuskesList([]))
        }
    }, [open, formRole])

    // Reset form when admin changes
    useEffect(() => {
        if (admin) {
            setFormName(admin.name || "")
            setFormRole(admin.role as "OPERATOR" | "SUPER_ADMIN" || "OPERATOR")
            setFormPuskesmasId(admin.puskesmas_id || "")
            setFormPassword("")
            setConfirmPassword("")
        }
    }, [admin])

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

        // Validasi konfirmasi password
        if (formPassword) {
            if (!confirmPassword) {
                toast.error("Konfirmasi password wajib diisi")
                return
            }
            if (formPassword !== confirmPassword) {
                toast.error("Password dan konfirmasi password tidak cocok")
                return
            }
        }

        // Validasi: Operator wajib pilih puskes
        if (formRole === "OPERATOR" && !formPuskesmasId) {
            toast.error("Pilih puskesmas untuk operator")
            return
        }

        setIsSubmitting(true)
        try {
            const data: { name: string; role: "OPERATOR" | "SUPER_ADMIN"; password?: string; puskesmas_id?: string; password_confirmation?: string } = {
                name: formName,
                role: formRole
            }
            if (formPassword) {
                data.password = formPassword
                data.password_confirmation = confirmPassword
            }
            if (formRole === "OPERATOR" && formPuskesmasId) {
                data.puskesmas_id = formPuskesmasId
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

    const handleRoleChange = (value: string) => {
        setFormRole(value as "OPERATOR" | "SUPER_ADMIN")
        if (value === "SUPER_ADMIN") {
            setFormPuskesmasId("")
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
                        <Label htmlFor="edit-confirm-password">
                            Konfirmasi Password
                        </Label>
                        <Input
                            id="edit-confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                        <p className="text-xs text-muted-foreground">
                            Wajib diisi jika ingin mengubah password
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-role">Role</Label>
                        <Select
                            value={formRole}
                            onValueChange={handleRoleChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="OPERATOR">Operator</SelectItem>
                                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {formRole === "OPERATOR" && (
                        <div className="grid gap-2">
                            <Label htmlFor="edit-puskes">Puskesmas</Label>
                            <Select
                                value={formPuskesmasId}
                                onValueChange={setFormPuskesmasId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih puskesmas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {puskesList.map((puskes) => (
                                        <SelectItem key={puskes.id} value={puskes.id}>
                                            {puskes.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Maksimum 2 operator per puskesmas
                            </p>
                        </div>
                    )}
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
