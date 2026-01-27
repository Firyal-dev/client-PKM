import { CustomLink } from "@/components/ui/link"

export default function AlbumsPage() {
    return (
        <div className="px-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Albums</h1>
                    <p className="text-muted-foreground">
                        Kelola daftar album
                    </p>
                </div>
                <CustomLink href="/admin/albums/create">
                    Tambah Album
                </CustomLink>
            </div>
            <div className="rounded-xl bg-muted/50 mt-5 p-5">
                <p>Albums</p>
            </div>
        </div>
    )
}