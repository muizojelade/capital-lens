"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

type ArticleEditorProps = {
  articleId?: string;

  initialArticle?: {
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    tags: string;
    content: string;
    cover_image?: string | null;
    editor_pick: boolean;
    status: string;
  };
};

export default function ArticleEditor({
  articleId,
  initialArticle,
}: ArticleEditorProps) {
  /*
   * =========================
   * ARTICLE INFORMATION
   * =========================
   */

  const [title, setTitle] = useState(initialArticle?.title || "");

  const [slug, setSlug] = useState(initialArticle?.slug || "");

  const [excerpt, setExcerpt] = useState(
    initialArticle?.excerpt || ""
  );

  const [category, setCategory] = useState(
    initialArticle?.category || ""
  );

  const [tags, setTags] = useState(initialArticle?.tags || "");

  /*
   * =========================
   * COVER IMAGE
   * =========================
   */

  const [coverImage, setCoverImage] = useState(
    initialArticle?.cover_image || ""
  );

  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [coverPreview, setCoverPreview] = useState(
    initialArticle?.cover_image || ""
  );

  /*
   * =========================
   * PUBLISHING
   * =========================
   */

  const [editorPick, setEditorPick] = useState(
    initialArticle?.editor_pick || false
  );

  const [status, setStatus] = useState(
    initialArticle?.status || "draft"
  );

  /*
   * =========================
   * UI STATE
   * =========================
   */

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [preview, setPreview] = useState(false);

  const [content, setContent] = useState(
    initialArticle?.content || ""
  );

  const [canUndo, setCanUndo] = useState(false);

  const [canRedo, setCanRedo] = useState(false);

  /*
   * =========================
   * TIPTAP EDITOR
   * =========================
   *
   * We explicitly disable Link and Underline
   * inside StarterKit and register them ourselves.
   *
   * This prevents duplicate extension warnings
   * and guarantees that their commands exist.
   */

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },

        link: false,

        underline: false,
      }),

      Link.configure({
        openOnClick: false,

        autolink: true,

        linkOnPaste: true,
      }),

      Underline,

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    content: initialArticle?.content || "",

    onCreate({ editor }) {
      setCanUndo(editor.can().undo());
      setCanRedo(editor.can().redo());
    },

    onUpdate({ editor }) {
      setContent(editor.getHTML());

      setCanUndo(editor.can().undo());
      setCanRedo(editor.can().redo());
    },

    onTransaction({ editor }) {
      setCanUndo(editor.can().undo());
      setCanRedo(editor.can().redo());
    },
  });

  /*
   * =========================
   * UNDO
   * =========================
   */

  function handleUndo() {
    if (!editor) return;

    editor.chain().focus().undo().run();

    setCanUndo(editor.can().undo());
    setCanRedo(editor.can().redo());
  }

  /*
   * =========================
   * REDO
   * =========================
   */

  function handleRedo() {
    if (!editor) return;

    editor.chain().focus().redo().run();

    setCanUndo(editor.can().undo());
    setCanRedo(editor.can().redo());
  }

  /*
   * =========================
   * CLEAR EDITOR
   * =========================
   */

  function handleClear() {
    if (!editor) return;

    const confirmed = window.confirm(
      "Clear all article content?"
    );

    if (!confirmed) return;

    editor.chain().focus().clearContent().run();

    setContent("");

    setCanUndo(editor.can().undo());
    setCanRedo(editor.can().redo());

    setMessage("");
  }

  /*
   * =========================
   * COVER IMAGE
   * =========================
   */

  function handleCoverImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setCoverFile(file);

    const previewUrl = URL.createObjectURL(file);

    setCoverPreview(previewUrl);
  }

  /*
   * =========================
   * REMOVE COVER IMAGE
   * =========================
   */

  function handleRemoveCoverImage() {
    setCoverFile(null);

    setCoverPreview("");

    setCoverImage("");
  }

  /*
   * =========================
   * LINK
   * =========================
   */

  function addLink() {
    if (!editor) return;

    const previousUrl =
      editor.getAttributes("link").href || "";

    const url = window.prompt(
      "Enter URL",
      previousUrl || "https://"
    );

    if (url === null) return;

    const trimmedUrl = url.trim();

    /*
     * Remove link
     */

    if (trimmedUrl === "") {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .unsetLink()
        .run();

      return;
    }

    /*
     * Add link
     */

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: trimmedUrl,
      })
      .run();
  }

  /*
   * =========================
   * SAVE ARTICLE
   * =========================
   */

  async function handleSave() {
    if (!editor) return;

    /*
     * VALIDATION
     */

    if (!title.trim()) {
      setMessage("Please enter an article title.");
      return;
    }

    if (!slug.trim()) {
      setMessage("Please enter an article slug.");
      return;
    }

    const articleContent = editor.getHTML();

    if (!articleContent || articleContent === "<p></p>") {
      setMessage("Please enter some article content.");
      return;
    }

    setSaving(true);

    setMessage("");

    try {
      /*
       * =========================
       * COVER IMAGE UPLOAD
       * =========================
       */

      let coverImageUrl = coverImage || null;

      if (coverFile) {
        const fileExt =
          coverFile.name.split(".").pop() || "jpg";

        const fileName =
          `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } =
          await supabase.storage
            .from("article-images")
            .upload(fileName, coverFile);

        if (uploadError) {
          console.error(
            "Image upload error:",
            uploadError
          );

          setMessage(
            `Failed to upload cover image: ${uploadError.message}`
          );

          return;
        }

        const { data } = supabase.storage
          .from("article-images")
          .getPublicUrl(fileName);

        coverImageUrl = data.publicUrl;
      }

      /*
       * =========================
       * ARTICLE DATA
       * =========================
       */

      const articleData = {
        title: title.trim(),

        slug: slug.trim(),

        excerpt: excerpt.trim(),

        category: category.trim(),

        tags: tags.trim(),

        content: articleContent,

        cover_image: coverImageUrl,

        editor_pick: editorPick,

        status,
      };

      /*
       * =========================
       * CREATE ARTICLE
       * =========================
       */

      if (!articleId) {
        const { error } = await supabase
          .from("articles")
          .insert(articleData);

        if (error) {
          console.error(
            "Create article error:",
            error
          );

          setMessage(
            `Failed to create article: ${error.message}`
          );

          return;
        }

        setCoverImage(coverImageUrl || "");

        setCoverFile(null);

        setMessage(
          "Article created successfully."
        );

        return;
      }

      /*
       * =========================
       * UPDATE ARTICLE
       * =========================
       */

      const { data, error } = await supabase
        .from("articles")
        .update(articleData)
        .eq("id", articleId)
        .select()
        .maybeSingle();

      if (error) {
        console.error(
          "Update article error:",
          error
        );

        setMessage(
          `Failed to update article: ${error.message}`
        );

        return;
      }

      if (!data) {
        setMessage(
          "No article was updated. The article ID could not be matched."
        );

        return;
      }

      setCoverImage(coverImageUrl || "");

      setCoverFile(null);

      setMessage(
        "Article updated successfully."
      );
    } catch (error) {
      console.error(
        "Unexpected save error:",
        error
      );

      setMessage(
        "Something went wrong while saving the article."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * =========================
   * PREVIEW
   * =========================
   */

function handlePreview() {
  if (!editor) return;

  const html = editor.getHTML();

  console.log("EDITOR CONTENT:", html);

  setContent(html);
  setMessage("");
  setPreview(true);
}

  /*
   * =========================
   * PREVIEW MODE
   * =========================
   */

  if (preview) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white">
        {/* PREVIEW HEADER */}

        <div className="border-b border-black/10 px-6 py-5 md:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c58a2a]">
                Article Preview
              </p>

              <p className="mt-1 text-sm text-gray-500">
                This is how your article currently looks.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPreview(false)}
              className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50"
            >
              ← Back to Editor
            </button>
          </div>
        </div>

        {/* ARTICLE */}

        <article className="mx-auto max-w-4xl px-6 py-10 md:px-10 md:py-14">
          {/* CATEGORY */}

          {category && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#a66f17]">
              {category.replace("-", " ")}
            </p>
          )}

          {/* TITLE */}

          <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            {title || "Untitled Article"}
          </h1>

          {/* EXCERPT */}

          {excerpt && (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-500 md:text-xl">
              {excerpt}
            </p>
          )}

          {/* META */}

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-black/10 pb-6 text-sm text-gray-500">
            <span>Capital Lens</span>

            <span className="text-black/20">
              •
            </span>

            <span className="capitalize">
              {status}
            </span>

            {editorPick && (
              <>
                <span className="text-black/20">
                  •
                </span>

                <span className="font-medium text-[#a66f17]">
                  Editor&apos;s Pick
                </span>
              </>
            )}
          </div>

          {/* COVER */}

          {coverPreview && (
            <div className="mt-8 overflow-hidden rounded-2xl">
              <img
                src={coverPreview}
                alt={
                  title ||
                  "Article cover"
                }
                className="h-auto max-h-[600px] w-full object-cover"
              />
            </div>
          )}

          {/* ARTICLE CONTENT */}

          <div
            className="
              article-preview
              prose
              prose-lg
              mt-10
              max-w-none
              text-gray-700

              prose-headings:font-semibold
              prose-headings:text-gray-900

              prose-h1:text-4xl

              prose-h2:mt-10
              prose-h2:text-3xl

              prose-h3:mt-8
              prose-h3:text-2xl

              prose-p:leading-8
              prose-p:text-gray-700

              prose-strong:text-gray-900

              prose-a:text-yellow-600
              prose-a:no-underline
              hover:prose-a:underline

              prose-blockquote:border-yellow-600
              prose-blockquote:text-gray-600

              prose-ul:my-6
              prose-ol:my-6

              prose-li:my-1

              prose-img:rounded-xl
              prose-img:w-full
            "
            dangerouslySetInnerHTML={{
              __html:
                content ||
                "<p>Your article content will appear here.</p>",
            }}
          />

          {/* TAGS */}

          {tags.trim() && (
            <div className="mt-12 border-t border-black/10 pt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                Tags
              </p>

              <div className="flex flex-wrap gap-2">
                {tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
                  .map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-black/10 bg-gray-50 px-3 py-1.5 text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </article>
      </div>
    );
  }

  /*
   * =========================
   * EDITOR MODE
   * =========================
   */

  return (
    <div className="space-y-8">
      {/* =========================
          ARTICLE INFORMATION
          ========================= */}

      <section className="space-y-5">
        {/* TITLE */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Enter article title"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-lg outline-none transition focus:border-black/30"
          />
        </div>

        {/* SLUG */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Slug
          </label>

          <input
            type="text"
            value={slug}
            onChange={(e) =>
              setSlug(e.target.value)
            }
            placeholder="article-url-slug"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-black/30"
          />

          <p className="mt-1 text-xs text-gray-400">
            This is used for the article URL.
          </p>
        </div>

        {/* EXCERPT */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Excerpt
          </label>

          <textarea
            value={excerpt}
            onChange={(e) =>
              setExcerpt(e.target.value)
            }
            placeholder="Short description of the article"
            rows={3}
            className="w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-black/30"
          />
        </div>

        {/* CATEGORY + TAGS */}

        <div className="grid gap-5 md:grid-cols-2">
          {/* CATEGORY */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Category
            </label>

            <input
              type="text"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              placeholder="e.g. Markets"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-black/30"
            />
          </div>

          {/* TAGS */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Tags
            </label>

            <input
              type="text"
              value={tags}
              onChange={(e) =>
                setTags(e.target.value)
              }
              placeholder="gold, markets, investing"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-black/30"
            />

            <p className="mt-1 text-xs text-gray-400">
              Separate tags with commas.
            </p>
          </div>
        </div>

        {/* COVER IMAGE */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Cover Image
          </label>

          {coverPreview ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-black/10">
                <img
                  src={coverPreview}
                  alt={
                    title ||
                    "Article cover"
                  }
                  className="h-auto max-h-[400px] w-full object-cover"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <label className="inline-flex cursor-pointer rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-50">
                  Change Image

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={
                      handleCoverImageChange
                    }
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={
                    handleRemoveCoverImage
                  }
                  className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  Remove Image
                </button>
              </div>
            </div>
          ) : (
            <label className="flex min-h-[180px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-black/10 bg-gray-50 transition hover:border-[#c58a2a] hover:bg-[#c58a2a]/5">
              <div className="text-center">
                <p className="text-3xl">
                  🖼️
                </p>

                <p className="mt-3 text-sm font-medium">
                  Upload Cover Image
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG or WEBP
                </p>
              </div>

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={
                  handleCoverImageChange
                }
                className="hidden"
              />
            </label>
          )}
        </div>
      </section>

      {/* =========================
          ARTICLE CONTENT EDITOR
          ========================= */}

      <section>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium">
            Article Content
          </label>

          <span className="text-xs text-gray-400">
            Rich text editor
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-black/10 bg-white">
          {/* =========================
              TOOLBAR
              ========================= */}

          {editor && (
            <div className="flex flex-wrap items-center gap-1.5 border-b border-black/10 bg-gray-50 p-3">
              {/* UNDO */}

              <button
                type="button"
                onMouseDown={(e) =>
                  e.preventDefault()
                }
                onClick={handleUndo}
                disabled={!canUndo}
                title="Undo"
                className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
              >
                ↶ Undo
              </button>

              {/* REDO */}

              <button
                type="button"
                onMouseDown={(e) =>
                  e.preventDefault()
                }
                onClick={handleRedo}
                disabled={!canRedo}
                title="Redo"
                className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
              >
                ↷ Redo
              </button>

              {/* CLEAR */}

              <button
                type="button"
                onMouseDown={(e) =>
                  e.preventDefault()
                }
                onClick={handleClear}
                title="Clear article content"
                className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
              >
                Clear
              </button>

              <div className="mx-1 h-6 w-px bg-black/10" />

              {/* H1 */}

              <button
                type="button"
                onMouseDown={(e) =>
                  e.preventDefault()
                }
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({
                      level: 1,
                    })
                    .run()
                }
                title="Heading 1"
                className={`rounded-md px-3 py-1.5 text-sm font-semibold transition hover:bg-black/5 ${
                  editor.isActive(
                    "heading",
                    { level: 1 }
                  )
                    ? "bg-black/10"
                    : ""
                }`}
              >
                H1
              </button>

              {/* H2 */}

              <button
                type="button"
                onMouseDown={(e) =>
                  e.preventDefault()
                }
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({
                      level: 2,
                    })
                    .run()
                }
                title="Heading 2"
                className={`rounded-md px-3 py-1.5 text-sm font-semibold transition hover:bg-black/5 ${
                  editor.isActive(
                    "heading",
                    { level: 2 }
                  )
                    ? "bg-black/10"
                    : ""
                }`}
              >
                H2
              </button>

              {/* H3 */}

              <button
                type="button"
                onMouseDown={(e) =>
                  e.preventDefault()
                }
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({
                      level: 3,
                    })
                    .run()
                }
                title="Heading 3"
                className={`rounded-md px-3 py-1.5 text-sm font-semibold transition hover:bg-black/5 ${
                  editor.isActive(
                    "heading",
                    { level: 3 }
                  )
                    ? "bg-black/10"
                    : ""
                }`}
              >
                H3
              </button>

              <div className="mx-1 h-6 w-px bg-black/10" />

              {/* BOLD */}

              <button
                type="button"
                onMouseDown={(e) =>
                  e.preventDefault()
                }
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleBold()
                    .run()
                }
                title="Bold"
                className={`rounded-md px-3 py-1.5 text-sm font-bold transition hover:bg-black/5 ${
                  editor.isActive("bold")
                    ? "bg-black/10"
                    : ""
                }`}
              >
                B
              </button>

              {/* ITALIC */}

              <button
                type="button"
                onMouseDown={(e) =>
                  e.preventDefault()
                }
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleItalic()
                    .run()
                }
                title="Italic"
                className={`rounded-md px-3 py-1.5 text-sm italic transition hover:bg-black/5 ${
                  editor.isActive("italic")
                    ? "bg-black/10"
                    : ""
                }`}
              >
                I
              </button>

              {/* UNDERLINE */}

              <button
                type="button"
                onMouseDown={(e) =>
                  e.preventDefault()
                }
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleUnderline()
                    .run()
                }
                title="Underline"
                className={`rounded-md px-3 py-1.5 text-sm underline transition hover:bg-black/5 ${
                  editor.isActive("underline")
                    ? "bg-black/10"
                    : ""
                }`}
              >
                U
              </button>

              <div className="mx-1 h-6 w-px bg-black/10" />

              {/* BULLET LIST */}

              <button
                type="button"
                onMouseDown={(e) =>
                  e.preventDefault()
                }
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleBulletList()
                    .run()
                }
                title="Bullet list"
                className={`rounded-md px-3 py-1.5 text-sm transition hover:bg-black/5 ${
                  editor.isActive(
                    "bulletList"
                  )
                    ? "bg-black/10"
                    : ""
                }`}
              >
                • List
              </button>

              {/* ORDERED LIST */}

              <button
                type="button"
                onMouseDown={(e) =>
                  e.preventDefault()
                }
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleOrderedList()
                    .run()
                }
                title="Numbered list"
                className={`rounded-md px-3 py-1.5 text-sm transition hover:bg-black/5 ${
                  editor.isActive(
                    "orderedList"
                  )
                    ? "bg-black/10"
                    : ""
                }`}
              >
                1. List
              </button>

              {/* BLOCKQUOTE */}

              <button
                type="button"
                onMouseDown={(e) =>
                  e.preventDefault()
                }
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleBlockquote()
                    .run()
                }
                title="Blockquote"
                className={`rounded-md px-3 py-1.5 text-sm transition hover:bg-black/5 ${
                  editor.isActive(
                    "blockquote"
                  )
                    ? "bg-black/10"
                    : ""
                }`}
              >
                Quote
              </button>

              {/* LINK */}

              <button
                type="button"
                onMouseDown={(e) =>
                  e.preventDefault()
                }
                onClick={addLink}
                title="Add or edit link"
                className={`rounded-md px-3 py-1.5 text-sm transition hover:bg-black/5 ${
                  editor.isActive("link")
                    ? "bg-black/10"
                    : ""
                }`}
              >
                Link
              </button>

              <div className="mx-1 h-6 w-px bg-black/10" />

              {/* ALIGN LEFT */}

              <button
                type="button"
                onMouseDown={(e) =>
                  e.preventDefault()
                }
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setTextAlign("left")
                    .run()
                }
                title="Align left"
                className={`rounded-md px-3 py-1.5 text-sm transition hover:bg-black/5 ${
                  editor.isActive({
                    textAlign: "left",
                  })
                    ? "bg-black/10"
                    : ""
                }`}
              >
                Left
              </button>

              {/* ALIGN CENTER */}

              <button
                type="button"
                onMouseDown={(e) =>
                  e.preventDefault()
                }
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setTextAlign("center")
                    .run()
                }
                title="Align center"
                className={`rounded-md px-3 py-1.5 text-sm transition hover:bg-black/5 ${
                  editor.isActive({
                    textAlign: "center",
                  })
                    ? "bg-black/10"
                    : ""
                }`}
              >
                Center
              </button>

              {/* ALIGN RIGHT */}

              <button
                type="button"
                onMouseDown={(e) =>
                  e.preventDefault()
                }
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setTextAlign("right")
                    .run()
                }
                title="Align right"
                className={`rounded-md px-3 py-1.5 text-sm transition hover:bg-black/5 ${
                  editor.isActive({
                    textAlign: "right",
                  })
                    ? "bg-black/10"
                    : ""
                }`}
              >
                Right
              </button>
            </div>
          )}

          {/* =========================
              EDITOR AREA
              ========================= */}

          <EditorContent
            editor={editor}
            className="
              article-editor
              min-h-[500px]
              bg-white
              p-6
              outline-none

              [&_.tiptap]:min-h-[450px]
              [&_.tiptap]:outline-none

              [&_.tiptap]:prose
              [&_.tiptap]:prose-lg
              [&_.tiptap]:max-w-none

              [&_.tiptap]:prose-headings:font-semibold
              [&_.tiptap]:prose-headings:text-gray-900

              [&_.tiptap]:prose-p:text-gray-700
              [&_.tiptap]:prose-p:leading-8

              [&_.tiptap]:prose-strong:text-gray-900

              [&_.tiptap]:prose-a:text-yellow-600

              [&_.tiptap]:prose-blockquote:border-yellow-600
              [&_.tiptap]:prose-blockquote:text-gray-600

              [&_.tiptap]:prose-ul:my-6
              [&_.tiptap]:prose-ol:my-6
              [&_.tiptap]:prose-li:my-1
            "
          />
        </div>

        <p className="mt-2 text-xs text-gray-400">
          You can type, paste formatted content,
          select text and apply formatting, or use
          keyboard shortcuts like Ctrl/Cmd + Z.
        </p>
      </section>

      {/* =========================
          PUBLISHING SETTINGS
          ========================= */}

      <section className="rounded-xl border border-black/10 bg-white p-6">
        <div>
          <h2 className="text-lg font-semibold">
            Publishing Settings
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Control how this article appears on
            Capital Lens.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          {/* EDITOR PICK */}

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={editorPick}
              onChange={(e) =>
                setEditorPick(
                  e.target.checked
                )
              }
              className="mt-1 h-4 w-4 accent-[#c58a2a]"
            />

            <div>
              <p className="text-sm font-medium">
                Editor&apos;s Pick
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Feature this article in the
                Editor&apos;s Picks section.
              </p>
            </div>
          </label>

          {/* STATUS */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full max-w-md rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-black/30"
            >
              <option value="draft">
                Draft
              </option>

              <option value="published">
                Published
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* =========================
          ACTIONS
          ========================= */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          {message}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* PREVIEW */}

          <button
            type="button"
            onClick={handlePreview}
            className="rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-medium transition hover:bg-gray-50"
          >
            Preview
          </button>

          {/* SAVE */}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : articleId
                ? "Update Article"
                : "Save Article"}
          </button>
        </div>
      </div>
    </div>
  );
}