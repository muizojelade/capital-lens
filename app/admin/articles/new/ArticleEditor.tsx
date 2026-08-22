
"use client";

import { ARTICLE_CATEGORIES } from "@/lib/categories";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

export default function ArticleEditor() {
  /*
   * =========================
   * ARTICLE INFORMATION
   * =========================
   */

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");

  /*
   * =========================
   * PUBLISHING
   * =========================
   */

  const [editorPick, setEditorPick] = useState(false);
  const [status, setStatus] = useState("draft");

  /*
   * =========================
   * COVER IMAGE
   * =========================
   */

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

  /*
   * =========================
   * ARTICLE CONTENT
   * =========================
   *
   * IMPORTANT:
   * Content is stored in React state so Preview
   * always renders the latest editor content.
   */

  const [content, setContent] = useState("");

  /*
   * =========================
   * PREVIEW
   * =========================
   */

  const [preview, setPreview] = useState(false);

  /*
   * =========================
   * TIPTAP EDITOR
   * =========================
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

    content: "",

    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  /*
   * =========================
   * SLUG
   * =========================
   */

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug) {
      setSlug(generateSlug(value));
    }
  }

  /*
   * =========================
   * COVER IMAGE
   * =========================
   */

  function handleCoverImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setCoverImage(file);

    const previewUrl = URL.createObjectURL(file);

    setCoverPreview(previewUrl);
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

    if (trimmedUrl === "") {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .unsetLink()
        .run();

      return;
    }

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
   * SAVE DRAFT
   * =========================
   */

  async function handleSaveDraft() {
    if (!editor) return;

    if (!title.trim()) {
      alert("Please enter an article title.");
      return;
    }

    if (!slug.trim()) {
      alert("Please enter an article slug.");
      return;
    }

    const articleContent = editor.getHTML();

    if (
      !articleContent ||
      articleContent === "<p></p>"
    ) {
      alert("Please enter some article content.");
      return;
    }

    let coverImageUrl: string | null = null;

    /*
     * Upload cover image
     */

    if (coverImage) {
      const fileExt =
        coverImage.name.split(".").pop() || "jpg";

      const fileName =
        `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } =
        await supabase.storage
          .from("article-images")
          .upload(fileName, coverImage);

      if (uploadError) {
        console.error(
          "Image upload error:",
          uploadError
        );

        alert(
          `Failed to upload cover image: ${uploadError.message}`
        );

        return;
      }

      const { data } = supabase.storage
        .from("article-images")
        .getPublicUrl(fileName);

      coverImageUrl = data.publicUrl;
    }

    const article = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      category: category || null,
      tags: tags.trim() || null,
      content: articleContent,
      cover_image: coverImageUrl,
      editor_pick: editorPick,
      status: "draft",
    };

    const { error } = await supabase
      .from("articles")
      .insert(article);

    if (error) {
      console.error(
        "Supabase error:",
        error
      );

      alert(
        `Failed to save draft: ${error.message}`
      );

      return;
    }

    alert("Draft saved successfully!");
  }

  /*
   * =========================
   * PUBLISH ARTICLE
   * =========================
   */

  async function handlePublish() {
    if (!editor) return;

    if (!title.trim()) {
      alert("Please enter an article title.");
      return;
    }

    if (!slug.trim()) {
      alert("Please enter an article slug.");
      return;
    }

    const articleContent = editor.getHTML();

    if (
      !articleContent ||
      articleContent === "<p></p>"
    ) {
      alert("Please enter some article content.");
      return;
    }

    let coverImageUrl: string | null = null;

    /*
     * Upload cover image
     */

    if (coverImage) {
      const fileExt =
        coverImage.name.split(".").pop() || "jpg";

      const fileName =
        `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } =
        await supabase.storage
          .from("article-images")
          .upload(fileName, coverImage);

      if (uploadError) {
        console.error(
          "Image upload error:",
          uploadError
        );

        alert(
          `Failed to upload cover image: ${uploadError.message}`
        );

        return;
      }

      const { data } = supabase.storage
        .from("article-images")
        .getPublicUrl(fileName);

      coverImageUrl = data.publicUrl;
    }

    const article = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      category: category || null,
      tags: tags.trim() || null,
      content: articleContent,
      cover_image: coverImageUrl,
      editor_pick: editorPick,
      status: "published",
    };

    const { error } = await supabase
      .from("articles")
      .insert(article);

    if (error) {
      console.error(
        "Supabase publish error:",
        error
      );

      alert(
        `Failed to publish article: ${error.message}`
      );

      return;
    }

    alert("Article published successfully!");
  }

  /*
   * =========================
   * PREVIEW
   * =========================
   */

  function handlePreview() {
    if (!editor) return;

    const html = editor.getHTML();

    setContent(html);
    setPreview(true);
  }

  /*
   * =========================
   * EDITOR NOT READY
   * =========================
   */

  if (!editor) {
    return null;
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
      {/* ARTICLE INFORMATION */}

      <section className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Article Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add the basic information about your article.
          </p>
        </div>

        <div className="space-y-6">
          {/* TITLE */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Article Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                handleTitleChange(e.target.value)
              }
              placeholder="Enter article title..."
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-[#c58a2a]"
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
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-[#c58a2a]"
            />

            <p className="mt-2 text-xs text-gray-500">
              This will be used in the article URL.
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
              placeholder="Write a short description of the article..."
              rows={4}
              className="w-full resize-none rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-[#c58a2a]"
            />
          </div>
        </div>
      </section>

      {/* CLASSIFICATION */}

      <section className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Classification
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Organize your article so readers can find it easily.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* CATEGORY */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#c58a2a]"
            >
              <option value="">
                Select category
              </option>

              {ARTICLE_CATEGORIES.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
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
              placeholder="gold, stocks, inflation"
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#c58a2a]"
            />

            <p className="mt-2 text-xs text-gray-500">
              Separate multiple tags with commas.
            </p>
          </div>
        </div>
      </section>

      {/* COVER IMAGE */}

      <section className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Cover Image
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add the main image that will represent this article.
          </p>
        </div>

        {coverPreview ? (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-black/10">
              <img
                src={coverPreview}
                alt="Cover preview"
                className="h-auto max-h-[420px] w-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {coverImage?.name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Cover image selected
                </p>
              </div>

              <label className="cursor-pointer rounded-xl border border-black/10 px-4 py-2 text-center text-sm font-medium transition hover:bg-gray-50">
                Change Image

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleCoverImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <label className="flex min-h-[220px] cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-black/10 bg-[#fafafa] transition hover:border-[#c58a2a] hover:bg-[#c58a2a]/5">
            <div className="text-center">
              <div className="text-4xl">
                🖼️
              </div>

              <p className="mt-4 text-sm font-medium">
                Upload Cover Image
              </p>

              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG or WEBP
              </p>

              <span className="mt-4 inline-block rounded-xl bg-[#c58a2a] px-4 py-2 text-sm font-medium text-white">
                Choose Image
              </span>
            </div>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleCoverImage}
              className="hidden"
            />
          </label>
        )}
      </section>

      {/* ARTICLE CONTENT */}

      <section className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Article Content
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Write and format your article.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-black/10">
          {/* TOOLBAR */}

          <div className="flex flex-wrap gap-2 border-b border-black/10 bg-[#fafafa] p-3">
            {/* BOLD */}

            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleBold()
                  .run()
              }
              className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                editor.isActive("bold")
                  ? "bg-[#c58a2a] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              B
            </button>

            {/* ITALIC */}

            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleItalic()
                  .run()
              }
              className={`rounded-lg px-3 py-2 text-sm italic transition ${
                editor.isActive("italic")
                  ? "bg-[#c58a2a] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              I
            </button>

            {/* UNDERLINE */}

            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleUnderline()
                  .run()
              }
              className={`rounded-lg px-3 py-2 text-sm underline transition ${
                editor.isActive("underline")
                  ? "bg-[#c58a2a] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              U
            </button>

            <div className="mx-1 h-8 w-px bg-black/10" />

            {/* H1 */}

            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({
                    level: 1,
                  })
                  .run()
              }
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                editor.isActive(
                  "heading",
                  { level: 1 }
                )
                  ? "bg-[#c58a2a] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              H1
            </button>

            {/* H2 */}

            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({
                    level: 2,
                  })
                  .run()
              }
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                editor.isActive(
                  "heading",
                  { level: 2 }
                )
                  ? "bg-[#c58a2a] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              H2
            </button>

            {/* H3 */}

            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({
                    level: 3,
                  })
                  .run()
              }
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                editor.isActive(
                  "heading",
                  { level: 3 }
                )
                  ? "bg-[#c58a2a] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              H3
            </button>

            <div className="mx-1 h-8 w-px bg-black/10" />

            {/* BULLET LIST */}

            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleBulletList()
                  .run()
              }
              className={`rounded-lg px-3 py-2 text-sm transition ${
                editor.isActive("bulletList")
                  ? "bg-[#c58a2a] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              • List
            </button>

            {/* ORDERED LIST */}

            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleOrderedList()
                  .run()
              }
              className={`rounded-lg px-3 py-2 text-sm transition ${
                editor.isActive("orderedList")
                  ? "bg-[#c58a2a] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              1. List
            </button>

            {/* BLOCKQUOTE */}

            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleBlockquote()
                  .run()
              }
              className={`rounded-lg px-3 py-2 text-sm transition ${
                editor.isActive("blockquote")
                  ? "bg-[#c58a2a] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Quote
            </button>

            {/* LINK */}

            <button
              type="button"
              onClick={addLink}
              className={`rounded-lg px-3 py-2 text-sm transition ${
                editor.isActive("link")
                  ? "bg-[#c58a2a] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Link
            </button>

            <div className="mx-1 h-8 w-px bg-black/10" />

            {/* ALIGN LEFT */}

            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setTextAlign("left")
                  .run()
              }
              className={`rounded-lg px-3 py-2 text-sm transition ${
                editor.isActive({
                  textAlign: "left",
                })
                  ? "bg-[#c58a2a] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Left
            </button>

            {/* ALIGN CENTER */}

            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setTextAlign("center")
                  .run()
              }
              className={`rounded-lg px-3 py-2 text-sm transition ${
                editor.isActive({
                  textAlign: "center",
                })
                  ? "bg-[#c58a2a] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Center
            </button>

            {/* ALIGN RIGHT */}

            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setTextAlign("right")
                  .run()
              }
              className={`rounded-lg px-3 py-2 text-sm transition ${
                editor.isActive({
                  textAlign: "right",
                })
                  ? "bg-[#c58a2a] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Right
            </button>

            <div className="mx-1 h-8 w-px bg-black/10" />

            {/* DIVIDER */}

            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setHorizontalRule()
                  .run()
              }
              className="rounded-lg bg-white px-3 py-2 text-sm transition hover:bg-gray-100"
            >
              Divider
            </button>

            {/* UNDO */}

            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .undo()
                  .run()
              }
              disabled={!editor.can().undo()}
              className="rounded-lg bg-white px-3 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ↶
            </button>

            {/* REDO */}

            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .redo()
                  .run()
              }
              disabled={!editor.can().redo()}
              className="rounded-lg bg-white px-3 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ↷
            </button>

            {/* CLEAR */}

            <button
              type="button"
              onClick={() => {
                editor
                  .chain()
                  .focus()
                  .clearContent()
                  .run();

                setContent("");
              }}
              className="rounded-lg bg-white px-3 py-2 text-sm transition hover:bg-gray-100"
            >
              Clear
            </button>
          </div>

          {/* EDITOR */}

          <EditorContent
            editor={editor}
            className="
              article-editor
              min-h-[500px]
              px-5
              py-6
              md:px-8

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

      {/* PUBLISHING SETTINGS */}

      <section className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Publishing Settings
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Control how this article appears on Capital Lens.
          </p>
        </div>

        <div className="space-y-5">
          {/* EDITOR PICK */}

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={editorPick}
              onChange={(e) =>
                setEditorPick(e.target.checked)
              }
              className="h-4 w-4 accent-[#c58a2a]"
            />

            <div>
              <p className="text-sm font-medium">
                Editor&apos;s Pick
              </p>

              <p className="text-xs text-gray-500">
                Feature this article in the Editor&apos;s Picks section.
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
              className="w-full max-w-md rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#c58a2a]"
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

      {/* ACTIONS */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {/* PREVIEW */}

        <button
          type="button"
          onClick={handlePreview}
          className="rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-medium transition hover:bg-gray-50"
        >
          Preview
        </button>

        {/* SAVE DRAFT */}

        <button
          type="button"
          onClick={handleSaveDraft}
          className="rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-medium transition hover:bg-gray-50"
        >
          Save Draft
        </button>

        {/* PUBLISH */}

        <button
          type="button"
          onClick={handlePublish}
          className="rounded-xl bg-[#c58a2a] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#ad751e]"
        >
          Publish Article
        </button>
      </div>
    </div>
  );
}

