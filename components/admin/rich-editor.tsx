'use client'

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3, Undo, Redo, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useSyncExternalStore } from 'react'
import { cn } from '@/lib/utils'
import Image from '@tiptap/extension-image'
import { useTheme } from 'next-themes'

interface RichEditorProps {
    id?: string
    name?: string
    defaultValue?: string
    placeholder?: string
    className?: string
}

// Cek mounting
function useIsMounted() {
    return useSyncExternalStore(() => () => { }, () => true, () => false)
}

// Menu toolbar
const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) return null

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
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} className="h-8 w-8" title="Undo"><Undo className="w-4 h-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} className="h-8 w-8" title="Redo"><Redo className="w-4 h-4" /></Button>
        </div>
    )
}

export function RichEditor({ id, name, defaultValue, placeholder = "Tulis konten...", className }: RichEditorProps) {
    const { theme } = useTheme()
    const isMounted = useIsMounted()
    const isDark = isMounted && theme === 'dark'

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
            Image.configure({ inline: true, resize: { enabled: true, directions: ['top', 'bottom', 'left', 'right'], minWidth: 50, minHeight: 50, alwaysPreserveAspectRatio: true } }),
        ],
        content: defaultValue || '',
        immediatelyRender: false,
        editorProps: { attributes: { class: 'prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[200px] sm:min-h-[300px] p-4' } },
    })

    useEffect(() => {
        if (editor && defaultValue && editor.getHTML() === '<p></p>') editor.commands.setContent(defaultValue)
    }, [defaultValue, editor])

    if (!isMounted) return <div className={cn("flex flex-col w-full overflow-hidden border rounded-xl bg-background", className)}><div className="flex flex-wrap items-center gap-1 p-2 border-b"><div className="h-8 w-8 rounded animate-pulse bg-muted" /><div className="h-8 w-8 rounded animate-pulse bg-muted" /></div><div className="flex-1 p-4 min-h-[200px] bg-muted/20" /></div>

    return (
        <div className={cn("group flex flex-col w-full overflow-hidden border rounded-xl bg-background ring-offset-background focus-within:ring-2 focus-within:ring-primary/20", className)}>
            <MenuBar editor={editor} />
            <div className="flex-1 overflow-auto"><EditorContent editor={editor} /></div>
            <input type="hidden" id={id} name={name} value={editor?.getHTML() || ''} />
            <style dangerouslySetInnerHTML={{ __html: `.tiptap { font-family: inherit; } .tiptap p.is-editor-empty:first-child::before { color: ${isDark ? '#64748b' : '#94a3b8'}; content: "${placeholder}"; float: left; height: 0; pointer-events: none; } .tiptap h1 { font-size: 1.875rem; font-weight: 800; margin: 1.5rem 0 1rem; } .tiptap h2 { font-size: 1.5rem; font-weight: 700; margin: 1.25rem 0 0.75rem; } .tiptap h3 { font-size: 1.25rem; font-weight: 600; margin: 1rem 0 0.5rem; } .tiptap ul, .tiptap ol { padding-left: 1.5rem; margin-bottom: 1.25rem; } .tiptap li { margin-bottom: 0.25rem; } .tiptap blockquote { border-left: 4px solid #3b82f6; padding-left: 1.25rem; font-style: italic; margin-bottom: 1.25rem; } .tiptap p { margin-bottom: 1rem; } .dark .tiptap h1, .dark .tiptap h2, .dark .tiptap h3, .dark .tiptap p { color: #f1f5f9; }` }} />
        </div>
    )
}
