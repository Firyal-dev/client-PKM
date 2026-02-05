import { PageHeader } from "@/components/admin/page-header"
import { getBanners } from "@/services/banner/banner-service"
import { BannerList } from "./banner-list"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function BannerPage() {
    const banners = await getBanners()
    const hasData = banners.length > 0

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Banner Utama"
                description="Kelola gambar slide di halaman depan website."
                linkHref="/admin/banners/create-banner"
                linkLabel="Tambah Banner"
            />

            <div className={cn(
                "rounded-2xl bg-muted/50 border border-border mt-6 p-6 min-h-[500px] flex flex-col",
                !hasData && "justify-center"
            )}>
                {!hasData ? (
                    <Empty className="flex flex-col items-center text-center">
                        <EmptyHeader className="flex flex-col items-center">
                            <EmptyMedia variant="icon" className="mb-4 bg-background p-4 rounded-full shadow-sm">
                                <ImageIcon className="w-10 h-10 text-primary/40" />
                            </EmptyMedia>
                            <EmptyTitle className="text-xl font-bold">
                                Belum ada banner
                            </EmptyTitle>
                            <EmptyDescription className="max-w-[300px] mx-auto text-muted-foreground">
                                Silakan tambahkan banner utama untuk mempercantik halaman depan website.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <BannerList banners={banners} />
                )}
            </div>
        </div>
    )
}



