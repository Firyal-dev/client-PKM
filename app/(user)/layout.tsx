import Navbar from "@/components/user/partials/navbar"
import Footer from "@/components/user/partials/footer"

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col relative">
            {/* <div className="fixed inset-0 -z-10 pointer-events-none opacity-[0.08] dark:opacity-[0.05]"
                style={{
                    backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            /> */}

            <Navbar />
            <main className="flex-1 bg-slate-50">
                {children}
            </main>
            <Footer />
        </div>
    )
}
