"use client"
import { useActionState, useState, useRef } from "react"
import { MessageSquareWarning } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { useFloatingMenu } from "./floating-menu"
import { Reviews } from "@/types/review-prop"

enum ReviewCategory {
    PELAYANAN = 'Pelayanan',
    FASILITAS = 'Fasilitas',
    TENAGA_MEDIS = 'Tenaga Medis',
    LAINNYA = 'Lainnya',
}

export function FloatingReview({ onSubmit }: { onSubmit: (data: Reviews) => Promise<any> }) {
    const { closeMenu } = useFloatingMenu()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [category, setCategory] = useState<ReviewCategory>(ReviewCategory.PELAYANAN)
    const recaptchaRef = useRef<ReCAPTCHA>(null)
    const [captchaValue, setCaptchaValue] = useState<string | null>(null)

    // Action function untuk handle submit
    async function submitReview(prevState: any, formData: FormData) {
        if (!captchaValue) {
            toast.error("Mohon centang reCAPTCHA untuk membuktikan Anda bukan robot.")
            return { error: "reCAPTCHA belum dicentang" }
        }

        const username = formData.get("username") as string || "Anonim"
        const message = formData.get("message") as string
        const categoryValue = formData.get("category") as string

        if (!message?.trim()) {
            toast.error("Mohon isi pesan kritik dan saran Anda.")
            return { error: "Pesan kosong" }
        }

        try {
            // Construct payload
            const payload = {
                username,
                category: categoryValue,
                message,
                is_publish: false,
                // Kita sertakan token captcha di sini jika backend membutuhkannya
                recaptchaToken: captchaValue
            } as any // Cast to any to bypass strict Reviews type requirement for _id

            const response = await onSubmit(payload)

            if (response && response.error) {
                throw new Error(response.error)
            }

            toast.success("Terima kasih atas masukan Anda!")
            setIsDialogOpen(false)
            setCategory(ReviewCategory.PELAYANAN) // Reset category
            setCaptchaValue(null)
            recaptchaRef.current?.reset()
            return { success: true }
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Gagal mengirim masukan.")
            return { error: error.message || "Gagal submit" }
        }
    }

    // Hook useActionState (React 19)
    const [state, formAction, isPending] = useActionState(submitReview, null)

    const handleOpen = () => {
        setIsDialogOpen(true)
        closeMenu()
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-sm font-medium px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
                    Kritik & Saran
                </span>
                <Button
                    size="icon"
                    className="h-12 w-12 rounded-full shadow-md bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={handleOpen}
                >
                    <MessageSquareWarning className="h-5 w-5" />
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Kritik & Saran</DialogTitle>
                        <DialogDescription>
                            Bantu kami meningkatkan kualitas pelayanan.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Gunakan action di sini */}
                    <form action={formAction} className="grid gap-6 py-4">
                        <input type="hidden" name="category" value={category} />

                        <div className="grid gap-2">
                            <Label htmlFor="username">Nama (Opsional)</Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="Nama Anda (kosongkan jika ingin anonim)"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Kategori</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.values(ReviewCategory).map((cat) => (
                                    <div
                                        key={cat}
                                        className={cn(
                                            "cursor-pointer rounded-md border p-3 text-sm font-medium flex items-center justify-center text-center transition-all",
                                            category === cat
                                                ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                                                : "border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-600"
                                        )}
                                        onClick={() => setCategory(cat)}
                                    >
                                        {cat}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="message">Pesan <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="Tuliskan kritik dan saran Anda secara detail..."
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
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {isPending ? "Mengirim..." : "Kirim Masukan"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}