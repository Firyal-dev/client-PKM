'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { loginAction } from "@/services/auth/login-service"
import Image from 'next/image'
// Perubahan 1: Pastikan ChangeEvent diimport jika belum (biasanya otomatis di TS)
import { useActionState, useState, ChangeEvent, useEffect } from 'react'
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import { clearAuthToken } from "@/services/auth-token"
import { toast } from "sonner"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [state, action, pending] = useActionState(loginAction, null);
  const [username, setUsername] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    clearAuthToken();
  }, []);

  const handleAction = async (formData: FormData) => {
    if (!executeRecaptcha) {
      toast.error("Sistem reCAPTCHA masih memuat. Silakan coba lagi.");
      return;
    }
    const token = await executeRecaptcha("login_submit");
    if (token) {
      formData.set("recaptchaToken", token);
    }
    action(formData);
  };

  // Perubahan 3: Fungsi untuk menangani perubahan input username
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Regex ini berarti: "Ganti semua karakter yang BUKAN (^) huruf kecil (a-z),
    // huruf besar (A-Z), atau angka (0-9) dengan string kosong."
    // Ini efektif menghapus spasi dan simbol aneh secara real-time.
    const cleanedValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');

    setUsername(cleanedValue);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form action={handleAction} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <Image src="/puskesmasLogo.png" alt="Logo" width={100} height={100} />
                <h1 className="text-2xl font-bold">Selamat datang Admin!</h1>
                <p className="text-muted-foreground text-balance">Masukkan username dan password</p>
              </div>
              <Field>
                <FieldLabel htmlFor="name">Username</FieldLabel>
                {/* Perubahan 4: Tambahkan value dan onChange */}
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="username"
                  required
                  value={username} // Nilai input dikunci ke state
                  onChange={handleUsernameChange} // Panggil fungsi pembersih saat mengetik
                />
                {/* Opsional: Tambahkan hint kecil */}
                <p className="text-xs text-muted-foreground mt-1">Hanya huruf dan angka, tanpa spasi.</p>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" name="password" type="password" placeholder="********" minLength={8} required />
              </Field>


              <Field>
                {state?.error && <p className="text-sm font-medium text-destructive text-center mb-2">{state.error}</p>}
                <Button type="submit" disabled={pending} className="w-full cursor-pointer">
                  {pending ? "Memuat..." : "Masuk"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image width={1920} height={1080} loading="eager" src="/authBg.jpg" alt="Background" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4)]" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}