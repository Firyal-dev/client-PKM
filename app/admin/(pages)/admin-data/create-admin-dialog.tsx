'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import {
  createAdmin,
  getAllActivePuskes
} from "@/services/admin/admin-data-service"

import { Admin } from "@/types/admin"



/* =========================
   CREATE ADMIN
========================= */

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

  const [formName, setFormName] = useState("")
  const [formPassword, setFormPassword] = useState("")
  const [formRole, setFormRole] = useState<"OPERATOR" | "SUPER_ADMIN">("OPERATOR")
  const [formPuskesmasId, setFormPuskesmasId] = useState<string | undefined>(undefined)


  useEffect(() => {
    if (open && formRole === "OPERATOR") {
      getAllActivePuskes()
        .then(setPuskesList)
        .catch(() => setPuskesList([]))
    }
  }, [open, formRole])


  const validateName = (name: string) => {
    const regex = /^[a-zA-Z0-9]+$/

    if (!regex.test(name)) {
      setNameError("Nama hanya boleh huruf dan angka tanpa spasi")
      return false
    }

    setNameError("")
    return true
  }


  const validatePassword = (password: string) => {

    if (password.length < 8) {
      setPasswordError("Password minimal 8 karakter")
      return false
    }

    setPasswordError("")
    return true
  }


  const handleSubmit = async () => {

    if (!formName || !formPassword) return

    if (!validateName(formName)) return
    if (!validatePassword(formPassword)) return

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
    setFormPuskesmasId(undefined)

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
      setFormPuskesmasId(undefined)
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
            Tambahkan admin baru dengan mengisi form di bawah
          </DialogDescription>
        </DialogHeader>


        <div className="grid gap-4 py-4">

          <div className="grid gap-2">

            <Label>Nama</Label>

            <Input
              value={formName}
              onChange={(e) => {
                setFormName(e.target.value)
                validateName(e.target.value)
              }}
            />

            {nameError && (
              <p className="text-xs text-red-500">{nameError}</p>
            )}

          </div>


          <div className="grid gap-2">

            <Label>Password</Label>

            <Input
              type="password"
              value={formPassword}
              onChange={(e) => {
                setFormPassword(e.target.value)
                validatePassword(e.target.value)
              }}
            />

            {passwordError && (
              <p className="text-xs text-red-500">{passwordError}</p>
            )}

          </div>


          <div className="grid gap-2">

            <Label>Role</Label>

            <Select
              value={formRole}
              onValueChange={handleRoleChange}
            >

              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="OPERATOR">Operator</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              </SelectContent>

            </Select>

          </div>


          {formRole === "OPERATOR" && (

            <div className="grid gap-2">

              <Label>Puskesmas</Label>

              <Select
                value={formPuskesmasId || ""}
                onValueChange={setFormPuskesmasId}
              >

                <SelectTrigger>
                  <SelectValue placeholder="Pilih puskesmas" />
                </SelectTrigger>

                <SelectContent>

                  {puskesList.map((p) => (

                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>

                  ))}

                </SelectContent>

              </Select>

            </div>

          )}

        </div>


        <DialogFooter>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  )

}




/* =========================
   EDIT ADMIN
========================= */

interface EditAdminDialogProps {
  admin: Admin
  open: boolean
  onOpenChange: (open: boolean) => void
}


export function EditAdminDialog({
  admin,
  open,
  onOpenChange
}: EditAdminDialogProps) {


  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [puskesList, setPuskesList] = useState<{ id: string; name: string }[]>([])

  const [formName, setFormName] = useState(admin?.name || "")
  const [formRole, setFormRole] = useState<"OPERATOR" | "SUPER_ADMIN">(admin?.role as any)
  const [formPuskesmasId, setFormPuskesmasId] = useState<string | undefined>(admin?.puskesmas_id || undefined)

  const [formPassword, setFormPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")


  useEffect(() => {

    if (open && formRole === "OPERATOR") {

      getAllActivePuskes()
        .then(setPuskesList)
        .catch(() => setPuskesList([]))

    }

  }, [open, formRole])


  useEffect(() => {

    if (!admin) return

    setFormName(admin.name)
    setFormRole(admin.role as any)
    setFormPuskesmasId(admin.puskesmas_id || undefined)

  }, [admin])


  const handleSubmit = async () => {

    if (!admin) return

    if (formPassword) {

      if (!confirmPassword) {
        toast.error("Konfirmasi password wajib diisi")
        return
      }

      if (formPassword !== confirmPassword) {
        toast.error("Password tidak cocok")
        return
      }

    }


    const data: any = {
      name: formName,
      role: formRole
    }


    if (formPassword) {
      data.password = formPassword
      data.password_confirmation = confirmPassword
    }


    if (formRole === "OPERATOR") {

      const puskesId = formPuskesmasId || admin.puskesmas_id

      if (!puskesId) {
        toast.error("Puskesmas tidak valid")
        return
      }

      data.puskesmas_id = puskesId
    }
    console.log(data)
    setIsSubmitting(true)

    try {

      const { updateAdmin } = await import("@/services/admin/admin-data-service")

      const result = await updateAdmin(admin.id, data)

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
            Perbarui informasi admin
          </DialogDescription>
        </DialogHeader>


        <div className="grid gap-4 py-4">

          <div className="grid gap-2">

            <Label>Nama</Label>

            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />

          </div>


          <div className="grid gap-2">

            <Label>Password baru</Label>

            <Input
              type="password"
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
            />

          </div>


          <div className="grid gap-2">

            <Label>Konfirmasi Password</Label>

            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

          </div>


          <div className="grid gap-2">

            <Label>Role</Label>

            <Select
              value={formRole}
              onValueChange={(v) => setFormRole(v as any)}
            >

              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="OPERATOR">Operator</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              </SelectContent>

            </Select>

          </div>


          {formRole === "OPERATOR" && (

            <div className="grid gap-2">

              <Label>Puskesmas</Label>

              <Select
                value={formPuskesmasId || ""}
                onValueChange={setFormPuskesmasId}
              >

                <SelectTrigger>
                  <SelectValue placeholder="Pilih puskesmas" />
                </SelectTrigger>

                <SelectContent>

                  {puskesList.map((p) => (

                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>

                  ))}

                </SelectContent>

              </Select>

            </div>

          )}

        </div>


        <DialogFooter>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Perbarui"}
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  )

}