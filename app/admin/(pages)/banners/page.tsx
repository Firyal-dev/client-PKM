import { PageHeader } from "@/components/admin/page-header"
import { getAdminBannerList } from "@/services/banner/banner-service"
import { BannerList } from "./banner-list"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Image as ImageIcon, GalleryHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function BannerPage() {
    const banners = await getAdminBannerList(1, 10)
    const hasData = banners.data.length > 0

    return (
        <div className="px-5 pb-10">
            <PageHeader
                title="Banner Utama"
                description="Kelola gambar slide di halaman depan website."
                linkHref="/admin/banners/create-banner"
                linkLabel="Tambah Banner"
            />

            {hasData && (
                <div className="flex items-center gap-2 mt-5 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 border border-border/60 rounded-full px-3 py-1.5">
                        <GalleryHorizontal className="h-3.5 w-3.5" />
                        <span className="font-medium">{banners.data.length} Banner</span>
                    </div>
                </div>
            )}

            <div className={cn(
                "rounded-2xl bg-muted/30 border border-border/60 p-5 min-h-[500px] flex flex-col",
                !hasData && "justify-center items-center"
            )}>
                {!hasData ? (
                    <Empty className="flex flex-col items-center text-center max-w-xs mx-auto">
                        <EmptyHeader className="flex flex-col items-center gap-3">
                            <EmptyMedia variant="icon" className="mb-2 bg-background border border-border/60 p-5 rounded-2xl shadow-sm">
                                <ImageIcon className="w-10 h-10 text-primary/30" />
                            </EmptyMedia>
                            <EmptyTitle className="text-lg font-bold">
                                Belum ada banner
                            </EmptyTitle>
                            <EmptyDescription className="text-sm text-muted-foreground leading-relaxed">
                                Tambahkan banner untuk mempercantik halaman depan website kamu.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <BannerList banners={banners.data} />
                )}
            </div>
        </div>
    )
}