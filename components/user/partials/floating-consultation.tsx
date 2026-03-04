"use client"
import { useActionState, useState, useRef } from "react"
import { MessageCircleQuestion } from "lucide-react"
import { toast } from "sonner"
import ReCAPTCHA from "react-google-recaptcha"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFloatingMenu } from "./floating-menu"
import { Consultation } from "@/services/consultation/consultation-service"

export function FloatingConsultation({ onSubmit }: { onSubmit: (data: Omit<Consultation, 'id' | 'is_answer' | 'is_publish' | 'created_at' | 'updated_at' | 'answer'>) => Promise<any> }) {
    const { closeMenu } = useFloatingMenu()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const recaptchaRef = useRef<ReCAPTCHA>(null)
    const [captchaValue, setCaptchaValue] = useState<string | null>(null)

    // Action function untuk handle submit
    async function submitConsultation(prevState: any, formData: FormData) {
        if (!captchaValue) {
            toast.error("Mohon centang reCAPTCHA untuk membuktikan Anda bukan robot.")
            return { error: "reCAPTCHA belum dicentang" }
        }

        const username = formData.get("username") as string
        const email = formData.get("email") as string
        const subject = formData.get("subject") as string
        const message = formData.get("message") as string

        if (!username?.trim()) {
            toast.error("Mohon isi nama Anda.")
            return { error: "Nama kosong" }
        }

        if (!email?.trim()) {
            toast.error("Mohon isi alamat email Anda.")
            return { error: "Email kosong" }
        }

        // Validasi format email sederhana
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast.error("Format email tidak valid.")
            return { error: "Format email salah" }
        }

        if (!subject?.trim()) {
            toast.error("Mohon isi subjek konsultasi.")
            return { error: "Subjek kosong" }
        }

        if (!message?.trim()) {
            toast.error("Mohon isi pesan konsultasi Anda.")
            return { error: "Pesan kosong" }
        }

        try {
            const payload = {
                username,
                email,
                subject,
                message,
                // Kita sertakan token captcha di sini jika backend membutuhkannya
                recaptchaToken: captchaValue
            } as any

            const response = await onSubmit(payload)

            if (response && response.error) {
                throw new Error(response.error)
            }

            toast.success("Konsultasi Anda telah terkirim! Tim kami akan segera merespons melalui email Anda.")
            setIsDialogOpen(false)
            setCaptchaValue(null)
            recaptchaRef.current?.reset()
            return { success: true }
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Gagal mengirim konsultasi.")
            return { error: error.message || "Gagal submit" }
        }
    }

    // Hook useActionState (React 19)
    const [state, formAction, isPending] = useActionState(submitConsultation, null)

    const handleOpen = () => {
        setIsDialogOpen(true)
        closeMenu()
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-sm font-medium px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
                    Konsultasi
                </span>
                <Button
                    size="icon"
                    className="h-12 w-12 rounded-full shadow-md bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={handleOpen}
                >
                    <MessageCircleQuestion className="h-5 w-5" />
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Konsultasi</DialogTitle>
                        <DialogDescription>
                            Ajukan pertanyaan atau konsultasi kesehatan kepada tim Puskesmas. Balasan akan dikirim ke email Anda.
                        </DialogDescription>
                    </DialogHeader>

                    <form action={formAction} className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Nama <span className="text-red-500">*</span></Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="Nama lengkap Anda"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                            <Input
                                id="email"
                                name="email"
                                placeholder="Contoh: nama@email.com"
                                type="email"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="subject">Subjek <span className="text-red-500">*</span></Label>
                            <Input
                                id="subject"
                                name="subject"
                                placeholder="Topik pertanyaan Anda"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="message">Pesan <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="Tuliskan pertanyaan atau konsultasi Anda secara detail..."
                                className="resize-none min-h-[120px]"
                                required
                            />
                        </div>

                        <div className="flex justify-center">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                                onChange={(value) => setCaptchaValue(value)}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={isPending}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                {isPending ? "Mengirim..." : "Kirim Konsultasi"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
