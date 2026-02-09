import Navbar from "@/components/user/partials/navbar"
import Footer from "@/components/user/partials/footer"
import { FloatingMenu } from "@/components/user/partials/floating-menu"
import { FloatingReview } from "@/components/user/partials/floating-review"
import { createReview } from "@/services/review/review-service"

export default function UserLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            {/* Header */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 pb-20">
                {children}
            </main>

            {/* Footer */}
            <Footer />

            <FloatingMenu>
                <FloatingReview onSubmit={createReview}/>
            </FloatingMenu>
        </div>
    )
}
