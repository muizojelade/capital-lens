
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

export default function ArticleEditor() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [editorPick, setEditorPick] = useState(false);
  const [status, setStatus] = useState("draft");

  // Cover image
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

  // Preview mode
  const [preview, setPreview] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: "",
    immediatelyRender: false,
  });

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

  function handleCoverImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setCoverImage(file);

    const previewUrl = URL.createObjectURL(file);
    setCoverPreview(previewUrl);
  }

 async function handleSaveDraft() {
  if (!title.trim()) {
    alert("Please enter an article title.");
    return;
  }

  if (!slug.trim()) {
    alert("Please enter an article slug.");
    return;
  }

  let coverImageUrl: string | null = null;

  // Upload cover image if one was selected
  if (coverImage) {
    const fileExt = coverImage.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("article-images")
      .upload(fileName, coverImage);

    if (uploadError) {
      console.error("Image upload error:", uploadError);
      alert(`Failed to upload cover image: ${uploadError.message}`);
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
    content: editor?.getHTML() || "",
    cover_image: coverImageUrl,
    editor_pick: editorPick,
    status: "draft",
  };

  const { error } = await supabase
    .from("articles")
    .insert(article);

  if (error) {
    console.error("Supabase error:", error);
    alert(`Failed to save draft: ${error.message}`);
    return;
  }

  alert("Draft saved successfully!");
}
 async function handlePublish() {
  if (!title.trim()) {
    alert("Please enter an article title.");
    return;
  }

  if (!slug.trim()) {
    alert("Please enter an article slug.");
    return;
  }

  let coverImageUrl: string | null = null;

  // Upload cover image if one was selected
  if (coverImage) {
    const fileExt = coverImage.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("article-images")
      .upload(fileName, coverImage);

    if (uploadError) {
      console.error("Image upload error:", uploadError);
      alert(`Failed to upload cover image: ${uploadError.message}`);
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
    content: editor?.getHTML() || "",
    cover_image: coverImageUrl,
    editor_pick: editorPick,
    status: "published",
  };

  const { error } = await supabase
    .from("articles")
    .insert(article);

  if (error) {
    console.error("Supabase publish error:", error);
    alert(`Failed to publish article: ${error.message}`);
    return;
  }

  alert("Article published successfully!");
}

  function addLink() {
    if (!editor) return;

    const url = window.prompt("Enter the URL:");

    if (!url) return;

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }

  if (!editor) {
    return null;
  }

  /* =========================
     PREVIEW MODE
  ========================= */

  if (preview) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 md:p-10">

        <div className="mb-8 flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#a66f17]">
              Article Preview
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              {title || "Untitled Article"}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setPreview(false)}
            className="rounded-xl border border-black/10 px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
          >
            ← Back to Editor
          </button>

        </div>

        <article className="mx-auto max-w-3xl">

          {/* Cover image */}
          {coverPreview && (
            <div className="mb-8 overflow-hidden rounded-2xl">
              <img
                src={coverPreview}
                alt={title || "Article cover"}
                className="h-auto max-h-[500px] w-full object-cover"
              />
            </div>
          )}

          {/* Category */}
          {category && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#a66f17]">
              {category.replace("-", " ")}
            </p>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            {title || "Untitled Article"}
          </h1>

          {/* Excerpt */}
          {excerpt && (
            <p className="mt-5 text-lg leading-8 text-gray-500 md:text-xl">
              {excerpt}
            </p>
          )}

          {/* Article meta */}
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-b border-black/10 pb-6 text-sm text-gray-500">
            <span>Capital Lens</span>

            {status && (
              <span className="capitalize">
                {status}
              </span>
            )}

            {editorPick && (
              <span className="font-medium text-[#a66f17]">
                Editor&apos;s Pick
              </span>
            )}
          </div>

          {/* Content */}
          <div
            className="article-preview mt-8"
            dangerouslySetInnerHTML={{
              __html:
                editor.getHTML() ||
                "<p>Your article content will appear here.</p>",
            }}
          />

        </article>
      </div>
    );
  }

  /* =========================
     EDITOR
  ========================= */

  return (
    <div className="space-y-8">

      {/* Article Information */}
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

          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Article Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter article title..."
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-[#c58a2a]"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Slug
            </label>

            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="article-url-slug"
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-[#c58a2a]"
            />

            <p className="mt-2 text-xs text-gray-500">
              This will be used in the article URL.
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Excerpt
            </label>

            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write a short description of the article..."
              rows={4}
              className="w-full resize-none rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-[#c58a2a]"
            />
          </div>

        </div>
      </section>

      {/* Classification */}
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

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#c58a2a]"
            >
              <option value="">Select category</option>
              <option value="markets">Markets</option>
              <option value="investing">Investing</option>
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="technology">Technology</option>
              <option value="personal-finance">Personal Finance</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Tags
            </label>

            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="gold, stocks, inflation"
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#c58a2a]"
            />

            <p className="mt-2 text-xs text-gray-500">
              Separate multiple tags with commas.
            </p>
          </div>

        </div>
      </section>

      {/* Cover Image */}
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
                  accept="image/*"
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
              accept="image/*"
              onChange={handleCoverImage}
              className="hidden"
            />

          </label>
        )}

      </section>

      {/* Article Content */}
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

          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 border-b border-black/10 bg-[#fafafa] p-3">

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleBold().run()
              }
              className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                editor.isActive("bold")
                  ? "bg-[#c58a2a] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              B
            </button>

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleItalic().run()
              }
              className={`rounded-lg px-3 py-2 text-sm italic transition ${
                editor.isActive("italic")
                  ? "bg-[#c58a2a] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              I
            </button>

            <div className="mx-1 h-8 w-px bg-black/10" />

            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: 2 })
                  .run()
              }
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                editor.isActive("heading", { level: 2 })
                  ? "bg-[#c58a2a] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              H2
            </button>

            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: 3 })
                  .run()
              }
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                editor.isActive("heading", { level: 3 })
                  ? "bg-[#c58a2a] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              H3
            </button>

            <div className="mx-1 h-8 w-px bg-black/10" />

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleBulletList().run()
              }
              className="rounded-lg bg-white px-3 py-2 text-sm hover:bg-gray-100"
            >
              • List
            </button>

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleOrderedList().run()
              }
              className="rounded-lg bg-white px-3 py-2 text-sm hover:bg-gray-100"
            >
              1. List
            </button>

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleBlockquote().run()
              }
              className={`rounded-lg px-3 py-2 text-sm transition ${
                editor.isActive("blockquote")
                  ? "bg-[#c58a2a] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Quote
            </button>

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

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().setHorizontalRule().run()
              }
              className="rounded-lg bg-white px-3 py-2 text-sm transition hover:bg-gray-100"
            >
              Divider
            </button>

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().undo().run()
              }
              disabled={!editor.can().undo()}
              className="rounded-lg bg-white px-3 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ↶
            </button>

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().redo().run()
              }
              disabled={!editor.can().redo()}
              className="rounded-lg bg-white px-3 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ↷
            </button>

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().clearNodes().unsetAllMarks().run()
              }
              className="rounded-lg bg-white px-3 py-2 text-sm transition hover:bg-gray-100"
            >
              Clear
            </button>

          </div>

          {/* Editor */}
          <EditorContent
            editor={editor}
            className="article-editor min-h-[500px] px-5 py-6 md:px-8"
          />

        </div>

      </section>

      {/* Publishing Settings */}
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

          <label className="flex cursor-pointer items-center gap-3">

            <input
              type="checkbox"
              checked={editorPick}
              onChange={(e) => setEditorPick(e.target.checked)}
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

          <div>
            <label className="mb-2 block text-sm font-medium">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full max-w-md rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#c58a2a]"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

        <button
          type="button"
          onClick={() => setPreview(true)}
          className="rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-medium transition hover:bg-gray-50"
        >
          Preview
        </button>

        <button
          type="button"
          onClick={handleSaveDraft}
          className="rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-medium transition hover:bg-gray-50"
        >
          Save Draft
        </button>

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
