import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const customLinkVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-95",
    {
        variants: {
            variant: {
                primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
                outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
            },
            size: {
                default: "px-4 py-2",
                sm: "px-3 py-1.5 text-xs",
                lg: "px-6 py-3 text-base",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        },
    }
)

interface CustomLinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof customLinkVariants> {
    href: string
}

export function CustomLink({ className, variant, size, href, ...props }: CustomLinkProps) {
    return (
        <Link
            href={href}
            className={cn(customLinkVariants({ variant, size, className }))}
            {...props}
        />
    )
}