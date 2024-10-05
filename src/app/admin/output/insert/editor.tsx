"use client"
import { useCallback, useState } from 'react'
import '../style.css'
import {
    BubbleMenu, EditorContent, useEditor,
} from '@tiptap/react'
import { Link } from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'
import OutputChecker from './outputChecker'
import { set } from 'zod'
import { postOutput } from '~/server/actions'
import { useRouter } from 'next/navigation'


interface Category {
    id: number;
    nome: string;
    options: string[];
}

interface FormData {
    title: string;
    content: string;
    categories: {
        id: number;
        options: {
            name: string;
            value: boolean;
        }[]
    }[]
}

export default function EditorNostro({
    formattedCategorie
}: {
    formattedCategorie: Category[]
}) {

    const router = useRouter()

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        categories: formattedCategorie.map(c => ({
            id: c.id,
            options: c.options.map(option => ({ name: option, value: false }))
        }))
    })

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
            })
        ],
        onUpdate: ({ editor }) => {
            console.log(editor.getHTML())
            setFormData(prev => ({
                ...prev,
                content: editor.getHTML()
            }))
        },
        immediatelyRender: false,
        content: `
      <p>
        Hey, try to select some text here. There will popup a menu for selecting some inline styles. Remember: you have full control about content and styling of this menu.
      </p>
    `,
    })





    const setLink = useCallback(() => {
        if (!editor) return null
        const previousUrl: string | undefined = editor.getAttributes('link').href
        const url: string | undefined = window.prompt('URL', previousUrl)?? undefined

        // cancelled
        if (url === null || url === undefined) {
            return
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink()
                .run()

            return
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url })
            .run()
    }, [editor])

    const handleSubmit = async() => {
        if (!editor) return null
        console.log(formData)
        const result = await postOutput(formData)
        if(result.success) {
            alert('Saved')
            router.push('/admin/output')
        }else{
            alert('Error')
        }
    }


    return (
        <>

            {editor && (
                <div className="control-group mb-7">
                    <div className="button-group">
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={`me-2 rounded-xl px-2 bg-slate-300 hover:bg-slate-400 ${editor.isActive('heading', { level: 1 }) ? 'bg-purple-500' : ''}`}
                        >
                            H1
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={`me-2 rounded-xl px-2 bg-slate-300 hover:bg-slate-400 ${editor.isActive('heading', { level: 2 }) ? 'bg-purple-500' : ''}`}
                        >
                            H2
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            className={`me-2 rounded-xl px-2 bg-slate-300 hover:bg-slate-400 ${editor.isActive('heading', { level: 3 }) ? 'bg-purple-500' : ''}`}
                        >
                            H3
                        </button>
                        <div className='my-2'></div>
                        <button
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={`me-2 rounded-xl px-2 bg-slate-300 hover:bg-slate-400 ${editor.isActive('bulletList') ? 'bg-purple-500' : ''}`}
                        >
                            List
                        </button>
                        <button
                            onClick={setLink}
                            className={`me-2 rounded-xl px-2 bg-slate-300 hover:bg-slate-400 ${editor.isActive('Link') ? 'bg-purple-500' : ''}`}
                        >
                            Set Link
                        </button>
                        <button
                            onClick={() => editor.chain().focus().unsetLink().run()}
                            disabled={!editor.isActive('link')}
                            className={`me-2 rounded-xl px-2 bg-slate-300 hover:bg-slate-400`}
                        >
                            Unset Link
                        </button>
                    </div>
                </div>

            )}
            <input 
            type="text" placeholder='title...'
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className='rounded-lg p-2 w-full bg-slate-300 border border-slate-400 mb-4 outline-none'
            />
            {editor &&
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                    <div className="bubble-menu">
                        <button
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={editor.isActive('bold') ? 'is-active' : ''}
                        >
                            Bold
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={editor.isActive('italic') ? 'is-active' : ''}
                        >
                            Italic
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            className={editor.isActive('strike') ? 'is-active' : ''}
                        >
                            Strike
                        </button>
                    </div>
                </BubbleMenu>}
            <EditorContent editor={editor}
                className='bg-slate-300 rounded-xl border border-slate-400 p-4 min-h-96'
            />
            <OutputChecker
                categories={formattedCategorie}
                formData={formData}
                setFormData={setFormData}
            />
            <div className='my-4'>
                <button
                    onClick={handleSubmit}
                    className='rounded-lg p-2 w-full bg-green-600 hover:bg-green-700 text-white'
                >
                    Save
                </button>
            </div>
        </>
    )
}