'use client'

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
    Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3,
    Undo, Redo, Quote, Image as ImageIcon, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useSyncExternalStore, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import ImageExtension from '@tiptap/extension-image'
import { useTheme } from 'next-themes'
import { toast } from "sonner"

// --- IMPORT SERVER ACTION ---
// Pastikan path ini sesuai dengan struktur folder kamu
import { uploadImageAction } from '@/services/upload-action'

interface RichEditorProps {
    id?: string
    name?: string
    defaultValue?: string
    placeholder?: string
    className?: string
}

// Hook untuk mencegah Hydration Error (SSR vs Client)
function useIsMounted() {
    return useSyncExternalStore(() => () => { }, () => true, () => false)
}

// --- KOMPONEN TOOLBAR ---
const MenuBar = ({ editor }: { editor: Editor | null }) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)

    if (!editor) return null

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            // 1. Panggil Server Action
            const response = await uploadImageAction(formData)

            // 2. Validasi Response dari NestJS
            // tryAction returns: { success: true, data: { success: 1, file: { url: "..." } } }
            // jadi kita perlu akses response.data
            const uploadData = response.data

            if (uploadData && uploadData.success === 1 && uploadData.file?.url) {

                let imageUrl = uploadData.file.url

                // 3. LOGIC FIX URL GAMBAR (CRITICAL)
                // Backend return path relatif: /uploads/document/xyz.jpg
                // Browser butuh full URL: http://localhost:3002/uploads/document/xyz.jpg

                if (imageUrl.startsWith('/')) {
                    // Ambil base URL dari env (http://localhost:3002/api)
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'

                    // Bersihkan suffix '/api' atau '/v1' agar dapat domain murni (http://localhost:3002)
                    const backendOrigin = apiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '')

                    imageUrl = `${backendOrigin}${imageUrl}`
                }

                // Masukkan gambar ke editor
                editor.chain().focus().setImage({ src: imageUrl }).run()
                toast.success("Gambar berhasil diupload")
            } else {
                console.error("Format response salah:", response)
                toast.error("Gagal mendapatkan URL gambar")
            }

        } catch (error: any) {
            console.error('Upload Error:', error)
            toast.error(error.message || "Terjadi kesalahan saat upload")
        } finally {
            setIsUploading(false)
            // Reset input agar bisa upload file yang sama jika user mau
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    // Definisi tombol toolbar
    const buttons = [
        { icon: <Bold className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive('bold'), tooltip: 'Bold' },
        { icon: <Italic className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive('italic'), tooltip: 'Italic' },
        { icon: <Heading1 className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: editor.isActive('heading', { level: 1 }), tooltip: 'H1' },
        { icon: <Heading2 className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: editor.isActive('heading', { level: 2 }), tooltip: 'H2' },
        { icon: <Heading3 className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: editor.isActive('heading', { level: 3 }), tooltip: 'H3' },
        { icon: <List className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive('bulletList'), tooltip: 'List' },
        { icon: <ListOrdered className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive('orderedList'), tooltip: 'Ordered List' },
        { icon: <Quote className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleBlockquote().run(), isActive: editor.isActive('blockquote'), tooltip: 'Quote' },
    ]

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">
            {buttons.map((btn, i) => (
                <Button key={i} type="button" variant="ghost" size="icon" onClick={btn.onClick} className={cn("h-8 w-8", btn.isActive && "bg-primary/10 text-primary")} title={btn.tooltip}>{btn.icon}</Button>
            ))}

            <div className="w-px h-4 bg-slate-200 mx-1 hidden sm:block" />

            {/* Tombol Upload Gambar */}
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="h-8 w-8"
                title="Insert Image"
            >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            </Button>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />

            <div className="w-px h-4 bg-slate-200 mx-1 hidden sm:block" />

            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} className="h-8 w-8" title="Undo"><Undo className="w-4 h-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} className="h-8 w-8" title="Redo"><Redo className="w-4 h-4" /></Button>
        </div>
    )
}

// --- KOMPONEN UTAMA ---
export function RichEditor({ id, name, defaultValue, placeholder = "Tulis konten...", className }: RichEditorProps) {
    const { theme } = useTheme()
    const isMounted = useIsMounted()
    const isDark = isMounted && theme === 'dark'
    const [editorContent, setEditorContent] = useState(defaultValue || '')

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
            ImageExtension.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-lg border shadow-sm max-w-full my-4',
                },
            }),
        ],
        content: defaultValue || '',
        immediatelyRender: false, // Fix hydration mismatch warning
        editorProps: {
            attributes: {
                class: 'prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[200px] sm:min-h-[300px] p-4'
            }
        },
        onUpdate: ({ editor }) => {
            // Update state saat content berubah
            setEditorContent(editor.getHTML())
        },
    })

    // Sync content saat defaultValue berubah (misal saat edit data)
    useEffect(() => {
        if (editor && defaultValue) {
            editor.commands.setContent(defaultValue)
            setEditorContent(defaultValue)
        }
    }, [defaultValue, editor])

    // Render Skeleton Loading saat belum mounted (untuk menghindari layout shift)
    if (!isMounted) return (
        <div className={cn("flex flex-col w-full overflow-hidden border rounded-xl bg-background", className)}>
            <div className="flex flex-wrap items-center gap-1 p-2 border-b">
                <div className="h-8 w-8 rounded animate-pulse bg-muted" />
                <div className="h-8 w-8 rounded animate-pulse bg-muted" />
            </div>
            <div className="flex-1 p-4 min-h-[200px] bg-muted/20" />
        </div>
    )

    return (
        <div className={cn("group flex flex-col w-full overflow-hidden border rounded-xl bg-background ring-offset-background focus-within:ring-2 focus-within:ring-primary/20", className)}>
            <MenuBar editor={editor} />

            <div className="flex-1 overflow-aauto">
                <EditorContent editor={editor} />
            </div>

            {/* INPUT HIDDEN: Ini yang akan dikirim saat Form disubmit */}
            <input type="hidden" id={id} name={name} value={editorContent} />

            {/* CSS INJECTION: Untuk styling placeholder dan elemen Tiptap */}
            <style jsx global>{`
                .tiptap { font-family: inherit; } 
                .tiptap p.is-editor-empty:first-child::before { 
                    color: ${isDark ? '#64748b' : '#94a3b8'}; 
                    content: "${placeholder}"; 
                    float: left; 
                    height: 0; 
                    pointer-events: none; 
                } 
                .tiptap h1 { font-size: 1.875rem; font-weight: 800; margin: 1.5rem 0 1rem; } 
                .tiptap h2 { font-size: 1.5rem; font-weight: 700; margin: 1.25rem 0 0.75rem; } 
                .tiptap h3 { font-size: 1.25rem; font-weight: 600; margin: 1rem 0 0.5rem; } 
                .tiptap ul, .tiptap ol { padding-left: 1.5rem; margin-bottom: 1.25rem; } 
                .tiptap li { margin-bottom: 0.25rem; } 
                .tiptap blockquote { border-left: 4px solid #3b82f6; padding-left: 1.25rem; font-style: italic; margin-bottom: 1.25rem; } 
                .tiptap p { margin-bottom: 1rem; } 
                .tiptap img { display: block; height: auto; margin-left: auto; margin-right: auto; } 
                .dark .tiptap h1, .dark .tiptap h2, .dark .tiptap h3, .dark .tiptap p { color: #f1f5f9; }
            `}</style>
        </div>
    )
}

export default RichEditor