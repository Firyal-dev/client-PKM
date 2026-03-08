'use client'

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
    Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3,
    Undo, Redo, Quote, Image as ImageIcon, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useSyncExternalStore, useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import ImageExtension from '@tiptap/extension-image'
import { useTheme } from 'next-themes'
import { toast } from "sonner"
import { uploadImageAction } from '@/services/upload-action'

interface RichEditorProps {
    id?: string
    name?: string
    defaultValue?: string
    placeholder?: string
    className?: string
}

function useIsMounted() {
    return useSyncExternalStore(() => () => { }, () => true, () => false)
}

// ── Toolbar ──────────────────────────────────────────────────────────────────

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)

    // FIX #2: Subscribe ke transaction agar active state update realtime
    // setiap kali editor state berubah (selection, marks, nodes), counter naik
    // → React re-render MenuBar → isActive() dipanggil ulang dengan state terbaru
    const [, forceUpdate] = useState(0)

    useEffect(() => {
        if (!editor) return
        const handler = () => forceUpdate(n => n + 1)
        editor.on('transaction', handler)
        return () => { editor.off('transaction', handler) }
    }, [editor])

    if (!editor) return null

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await uploadImageAction(formData)
            const uploadData = response.data

            if (uploadData?.success === 1 && uploadData.file?.url) {
                let imageUrl = uploadData.file.url
                if (imageUrl.startsWith('/')) {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'
                    const backendOrigin = apiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '')
                    imageUrl = `${backendOrigin}${imageUrl}`
                }
                editor.chain().focus().setImage({ src: imageUrl }).run()
                toast.success("Gambar berhasil diupload")
            } else {
                toast.error("Gagal mendapatkan URL gambar")
            }
        } catch (error: any) {
            toast.error(error.message || "Terjadi kesalahan saat upload")
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const buttons = [
        { icon: <Bold className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive('bold'), tooltip: 'Bold' },
        { icon: <Italic className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive('italic'), tooltip: 'Italic' },
        { icon: <Heading1 className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: editor.isActive('heading', { level: 1 }), tooltip: 'H1' },
        { icon: <Heading2 className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: editor.isActive('heading', { level: 2 }), tooltip: 'H2' },
        { icon: <Heading3 className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: editor.isActive('heading', { level: 3 }), tooltip: 'H3' },
        { icon: <List className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive('bulletList'), tooltip: 'Bullet List' },
        { icon: <ListOrdered className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive('orderedList'), tooltip: 'Ordered List' },
        { icon: <Quote className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleBlockquote().run(), isActive: editor.isActive('blockquote'), tooltip: 'Blockquote' },
    ]

    return (
        <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b bg-muted/20">
            {buttons.map((btn, i) => (
                <Button
                    key={i}
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={btn.onClick}
                    className={cn(
                        "h-8 w-8 transition-colors",
                        btn.isActive
                            ? "bg-foreground/10 text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                    title={btn.tooltip}
                >
                    {btn.icon}
                </Button>
            ))}

            <div className="w-px h-4 bg-border mx-1" />

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Insert Image"
            >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            </Button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

            <div className="w-px h-4 bg-border mx-1" />

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30"
                title="Undo"
            >
                <Undo className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30"
                title="Redo"
            >
                <Redo className="w-4 h-4" />
            </Button>
        </div>
    )
}

// ── Main component ────────────────────────────────────────────────────────────

export function RichEditor({ id, name, defaultValue, placeholder = "Tulis konten...", className }: RichEditorProps) {
    const { theme } = useTheme()
    const isMounted = useIsMounted()
    const isDark = isMounted && theme === 'dark'
    const [editorContent, setEditorContent] = useState(defaultValue || '')

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                // FIX #1: Tambah HTMLAttributes ke bulletList & orderedList
                // agar Tailwind reset tidak menghapus list styling
                bulletList: {
                    HTMLAttributes: { class: 'list-disc pl-6 mb-4' },
                },
                orderedList: {
                    HTMLAttributes: { class: 'list-decimal pl-6 mb-4' },
                },
                listItem: {
                    HTMLAttributes: { class: 'mb-1' },
                },
            }),
            ImageExtension.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-lg border shadow-sm max-w-full my-4',
                },
            }),
        ],
        content: defaultValue || '',
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[200px] sm:min-h-[300px] p-4'
            }
        },
        onUpdate: ({ editor }) => {
            setEditorContent(editor.getHTML())
        },
    })

    useEffect(() => {
        if (editor && defaultValue) {
            editor.commands.setContent(defaultValue)
            setEditorContent(defaultValue)
        }
    }, [defaultValue, editor])

    if (!isMounted) return (
        <div className={cn("flex flex-col w-full overflow-hidden border rounded-xl bg-background", className)}>
            <div className="flex flex-wrap items-center gap-1 p-2 border-b">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-8 w-8 rounded animate-pulse bg-muted" />
                ))}
            </div>
            <div className="flex-1 p-4 min-h-[200px] bg-muted/20" />
        </div>
    )

    return (
        <div className={cn(
            "group flex flex-col w-full overflow-hidden border border-border rounded-xl bg-background",
            "ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1",
            className
        )}>
            <MenuBar editor={editor} />
            <div className="flex-1 overflow-auto">
                <EditorContent editor={editor} />
            </div>
            <input type="hidden" id={id} name={name} value={editorContent} />

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
        .tiptap blockquote { border-left: 4px solid #3b82f6; padding-left: 1.25rem; font-style: italic; margin-bottom: 1.25rem; }
        .tiptap p { margin-bottom: 1rem; }
        .tiptap img { display: block; height: auto; margin-left: auto; margin-right: auto; }
        .dark .tiptap h1, .dark .tiptap h2, .dark .tiptap h3, .dark .tiptap p { color: #f1f5f9; }
      `}</style>
        </div>
    )
}

export default RichEditor