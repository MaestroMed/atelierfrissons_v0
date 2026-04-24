'use client';

import { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Link as LinkIcon,
  Undo,
  Redo,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  /** HTML initial (ex: article.descriptionEditorial existant). */
  value: string;
  /** Appelé au changement avec le HTML mis à jour. */
  onChange: (html: string) => void;
  /** Placeholder affiché si vide (non bloquant — juste visuel). */
  placeholder?: string;
  /** ID pour lier un label externe. */
  id?: string;
  /** `aria-describedby` pour hint ou erreur. */
  describedBy?: string;
  className?: string;
}

/**
 * Éditeur rich text basé sur TipTap — pour les champs d'édition éditoriale
 * (descriptionEditorial produit, corps d'article MDX, etc.).
 *
 * Volontairement minimaliste : on supporte B, I, H2, H3, listes, blockquote,
 * liens — rien d'autre. Pas d'embed média, pas de tables, pas de code.
 * L'objectif est d'avoir un output HTML propre lisible dans la section
 * `prose-article` du site.
 *
 * Output : HTML sérializé (valid pour `dangerouslySetInnerHTML` dans les
 * composants qui consomment déjà cette forme — cf. rituels/[slug]).
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Écrivez ici — B, I, H2/H3, listes, citations, liens…',
  id,
  describedBy,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        bulletList: {},
        orderedList: {},
      }),
    ],
    content: value,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: {
      attributes: {
        class: cn(
          'prose-article text-encre min-h-[220px] px-4 py-4 focus:outline-none',
          // Layout de zone d'édition
          'max-h-[520px] overflow-y-auto',
        ),
        ...(id ? { id } : {}),
        ...(describedBy ? { 'aria-describedby': describedBy } : {}),
      },
    },
    immediatelyRender: false,
  });

  const addLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL du lien', previousUrl ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div
        className={cn(
          'border-encre/20 bg-ivoire/60 min-h-[220px] animate-pulse border p-4',
          className,
        )}
      />
    );
  }

  return (
    <div className={cn('border-encre/20 bg-ivoire flex flex-col border', className)}>
      {/* Toolbar */}
      <div
        role="toolbar"
        aria-label="Formatage"
        className="border-encre/10 bg-ivoire-light/60 flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5"
      >
        <ToolbarButton
          label="Gras (⌘B)"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <Bold className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
        </ToolbarButton>
        <ToolbarButton
          label="Italique (⌘I)"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <Italic className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          label="Titre H2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
        </ToolbarButton>
        <ToolbarButton
          label="Titre H3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
        >
          <Heading3 className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          label="Liste à puces"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <List className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
        </ToolbarButton>
        <ToolbarButton
          label="Liste numérotée"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          <ListOrdered className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          label="Citation"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
        >
          <Quote className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
        </ToolbarButton>
        <ToolbarButton label="Ajouter un lien" onClick={addLink} active={editor.isActive('link')}>
          <LinkIcon className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          label="Annuler (⌘Z)"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
        </ToolbarButton>
        <ToolbarButton
          label="Rétablir (⌘⇧Z)"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
        </ToolbarButton>
      </div>

      {/* Zone d'édition */}
      <div className="relative">
        {editor.isEmpty ? (
          <span
            aria-hidden="true"
            className="font-italic-editorial text-encre/40 pointer-events-none absolute top-4 left-4 text-sm"
          >
            {placeholder}
          </span>
        ) : null}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        'inline-flex size-7 items-center justify-center transition-colors',
        active ? 'bg-noir text-ivoire' : 'text-encre/65 hover:bg-encre/8 hover:text-noir',
        disabled && 'cursor-not-allowed opacity-40 hover:bg-transparent',
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span aria-hidden="true" className="bg-encre/15 mx-1 h-4 w-px" />;
}
