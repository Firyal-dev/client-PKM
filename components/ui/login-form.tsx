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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <img src="/puskesmasLogo.png" alt="Logo Puskesmas" className="w-22 h-23 cursor-pointer" />
                <h1 className="text-2xl font-bold">Selamat datang Admin!</h1>
                <p className="text-muted-foreground text-balance">
                  Masukkan email dan password untuk masuk ke akun admin
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                  aria-invalid
                />
                <FieldError>
                  Email is required
                </FieldError>
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" type="password" placeholder="********" required aria-invalid />
                <FieldError>
                  Password is required
                </FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="captcha">Captcha</FieldLabel>
                <Input
                  id="captcha"
                  type="number"
                  placeholder="captcha"
                  required
                  aria-invalid
                />
                <FieldError>
                  Captcha is required
                </FieldError>
              </Field>
              <Field>
                <Button type="submit">Login</Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/authBg.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
