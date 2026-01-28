// import { PageHeader } from "@/components/page-header"
// import { Empty } from "@/components/ui/empty"
// import { Folder } from "lucide-react"
// import { AlbumList } from "./album-list"
// import { getAlbums } from "@/services/album/album-service"

// export default async function AlbumsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
//     const params = await searchParams
//     const currentPage = Number(params.page) || 1
//     const limit = 9

//     const response = await getAlbums(currentPage, limit)

//     return (
//         <div className="px-5 pb-10">
//             <PageHeader
//                 title="Albums"
//                 description="Kelola daftar album"
//                 linkHref="/admin/albums/create-album"
//                 linkLabel="Buat Album"
//             />
//             <div className="rounded-xl bg-muted/50 border border-border mt-5 p-5 min-h-[500px]">
//                 {response.data.length === 0 ? (
//                     <div className="flex items-center justify-center min-h-[400px]">
//                         <Empty>
//                             <Folder className="w-12 h-12 text-muted-foreground mb-4" />
//                             <h3 className="text-lg font-medium">Belum ada album</h3>
//                             <p className="text-muted-foreground text-sm">Buat album pertama lu untuk merapikan foto.</p>
//                         </Empty>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {response.data.map((album) => (
//                             <AlbumList
//                                 key={album._id}
//                                 id={album._id}
//                                 title={album.album_name}
//                                 count={album.count}
//                             />
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }