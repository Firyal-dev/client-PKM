'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { loginService } from "@/services/auth/login-service"
import Image from 'next/image'
import { useActionState } from 'react'



export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, action, pending] = useActionState(loginService, null);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">

          {/* form login */}
          <form action={action} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <Image src="/puskesmasLogo.png" alt="Logo Puskesmas" width={100} height={100} className="cursor-pointer" />
                <h1 className="text-2xl font-bold">Selamat datang Admin!</h1>
                <p className="text-muted-foreground text-balance">
                  Masukkan email dan password untuk masuk ke akun admin
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="name">Username</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="username"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  minLength={8}
                  required
                />
              </Field>
              <Field>
                {state?.error && (
                  <p className="text-sm font-medium text-destructive text-center mb-2">{state.error}</p>
                )}
                <Button type="submit" disabled={pending} className="cursor-pointer">
                  {pending ? "Memuat..." : "Masuk"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              width={1920}
              height={1080}
              loading="eager"
              src="/authBg.jpg"
              alt="Foto Profil"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4] w-auto h-auto"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
