import { PageHeader } from "@/components/admin/page-header"
import { MenuList } from "./menu-list"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAdminMenus } from "@/services/menu/menu-service"

export default async function MenusPage() {
    const data = await getAdminMenus()

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Menu"
                description="Kelola menu navigasi website"
                linkHref="/admin/menus/create-menu"
                linkLabel="Tambah Menu"
            />

            <div className={cn(
                "rounded-xl bg-muted/50 border border-border mt-6 p-5 min-h-[500px] flex flex-col",
                data.length === 0 && "justify-center"
            )}>
                {data.length === 0 ? (
                    <Empty className="flex flex-col items-center text-center">
                        <EmptyHeader className="flex flex-col items-center">
                            <EmptyMedia variant="icon" className="mb-4 bg-background p-4 rounded-full shadow-sm">
                                <Menu className="w-10 h-10 text-primary/40" />
                            </EmptyMedia>
                            <EmptyTitle className="text-xl font-bold">
                                Tidak ada menu
                            </EmptyTitle>
                            <EmptyDescription className="max-w-[300px] mx-auto text-muted-foreground">
                                Belum ada menu yang dibuat.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <MenuList menus={data} />
                )}
            </div>
        </div>
    )
}
