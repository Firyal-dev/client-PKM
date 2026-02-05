import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function SearchBar() {
    return (
        <div className="absolute left-1/2 -translate-x-1/2 w-full -bottom-8 lg:bottom-17 px-4 z-20">
            <div className="max-w-4xl mx-auto bg-white p-2 rounded-2xl shadow-2xl border border-slate-100">
                <div className="flex flex-col md:flex-row items-center gap-2">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Cari layanan, poli, atau info kesehatan..."
                            className="w-full h-12 md:h-14 pl-12 border-none bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <Button
                        size="lg"
                        className="w-full md:w-auto h-12 md:h-14 px-10 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
                    >
                        Cari
                    </Button>
                </div>
            </div>
        </div>
    )
}