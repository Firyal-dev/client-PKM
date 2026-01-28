// 'use client'

// import { useState, useRef, useEffect } from "react"
// import { Folder, MoreVertical, Image as ImageIcon, Pencil, Trash2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import Link from "next/link"
// import {
//     Tooltip,
//     TooltipContent,
//     TooltipTrigger,
// } from "@/components/ui/tooltip"
// import { updateAlbumName, deleteAlbum } from "@/services/album/album-service"
// import { toast } from "sonner"

// export function AlbumList({ id, title, count }: { id: string, title: string, count: number }) {
//     const [isEditing, setIsEditing] = useState(false)
//     const [albumName, setAlbumName] = useState(title)
//     const inputRef = useRef<HTMLInputElement>(null)

//     useEffect(() => {
//         if (isEditing) {
//             inputRef.current?.focus()
//             inputRef.current?.select()
//         }
//     }, [isEditing])

//     const handleRename = async () => {
//         if (albumName.trim() === "" || albumName === title) {
//             setAlbumName(title)
//             setIsEditing(false)
//             return
//         }
//         try {
//             await updateAlbumName(id, albumName)
//             toast.success("Nama album berhasil diperbarui")
//             setIsEditing(false)
//         } catch (error) {
//             toast.error("Gagal ganti nama")
//             setAlbumName(title)
//             setIsEditing(false)
//         }
//     }

//     const handleKeyDown = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter') handleRename()
//         if (e.key === 'Escape') {
//             setAlbumName(title)
//             setIsEditing(false)
//         }
//     }

//     return (
//         <div className="group relative rounded-xl border bg-card p-2 shadow-sm transition-all hover:shadow-md">
//             <Link
//                 href={`/admin/albums/${id}`}
//                 className={isEditing ? "pointer-events-none opacity-50" : "block"}
//             >
//                 <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
//                     <div className="flex h-full items-center justify-center">
//                         <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
//                     </div>
//                     <div className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-[10px] text-white backdrop-blur-md font-bold">
//                         {count} FOTO
//                     </div>
//                 </div>
//             </Link>

//             <div className="flex items-center justify-between p-3 gap-2">
//                 <div className="flex items-center gap-3 min-w-0 flex-1">
//                     <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
//                         <Folder className="h-4 w-4" />
//                     </div>

//                     <Tooltip delayDuration={300}>
//                         <TooltipTrigger asChild>
//                             <div className="min-w-0 flex-1">
//                                 {isEditing ? (
//                                     <input
//                                         ref={inputRef}
//                                         value={albumName}
//                                         onChange={(e) => setAlbumName(e.target.value)}
//                                         onBlur={handleRename}
//                                         onKeyDown={handleKeyDown}
//                                         onClick={(e) => {
//                                             e.preventDefault()
//                                             e.stopPropagation()
//                                         }}
//                                         className="w-full bg-background border-b-2 border-primary outline-none text-sm font-semibold h-5 px-0 py-3"
//                                     />
//                                 ) : (
//                                     <h3
//                                         onDoubleClick={(e) => {
//                                             e.preventDefault()
//                                             e.stopPropagation()
//                                             setIsEditing(true)
//                                         }}
//                                         className="text-sm font-semibold leading-tight truncate cursor-text select-none"
//                                     >
//                                         {albumName}
//                                     </h3>
//                                 )}
//                                 <p className="text-xs text-muted-foreground mt-1">Update 2 hari lalu</p>
//                             </div>
//                         </TooltipTrigger>
//                         {!isEditing && (
//                             <TooltipContent>
//                                 <p>Klik 2x untuk ubah nama</p>
//                             </TooltipContent>
//                         )}
//                     </Tooltip>
//                 </div>

//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8 cursor-pointer shrink-0"
//                             onClick={(e) => {
//                                 e.preventDefault()
//                                 e.stopPropagation()
//                             }}
//                         >
//                             <MoreVertical className="h-4 w-4" />
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent
//                         align="end"
//                         className="w-56"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <DropdownMenuItem
//                             variant="destructive"
//                             className="cursor-pointer"
//                             onSelect={(e) => {
//                                 e.preventDefault()
//                                 deleteAlbum(id)
//                             }}
//                         >
//                             <Trash2 className="mr-2 h-4 w-4" />
//                             <span>Hapus Album</span>
//                         </DropdownMenuItem>
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             </div>
//         </div>
//     )
// }