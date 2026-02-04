import Navbar from "@/components/user/partials/navbar"
import Footer from "@/components/user/partials/footer"

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col relative">
            <Navbar />
            <main className="flex-1 bg-slate-50">
                {children}
            </main>
            <Footer />
        </div>
    )
}
