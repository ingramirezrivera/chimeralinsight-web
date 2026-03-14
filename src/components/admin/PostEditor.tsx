"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { books, getBookById } from "@/data/books";
import BlogContentRenderer from "@/components/blog/BlogContentRenderer";
import type { BlogBlock, BlogContent } from "@/lib/blog/types";
import { formatDate, makeSlug } from "@/lib/utils";
import { withBasePath } from "@/lib/paths";

type EditorPost = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  featuredImageAlt: string;
  featuredImageSize: "small" | "medium" | "large" | "xlarge";
  relatedBookId: string;
  seoTitle: string;
  seoDescription: string;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string;
  content: BlogContent;
};

function createBlock(type: BlogBlock["type"]): BlogBlock {
  const id = crypto.randomUUID();

  switch (type) {
    case "heading":
      return { id, type, level: 2, text: "" };
    case "quote":
      return { id, type, text: "", citation: "" };
    case "list":
      return { id, type, style: "unordered", items: [""] };
    case "image":
      return { id, type, src: "", alt: "", caption: "", size: "small" };
    default:
      return { id, type: "paragraph", text: "" };
  }
}

async function uploadImage(file: File, alt = "") {
  const body = new FormData();
  body.append("file", file);
  body.append("alt", alt);

  const response = await fetch("/api/admin/media/upload", {
    method: "POST",
    body,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return response.json() as Promise<{ url: string; alt: string }>;
}

function BlockEditor({
  block,
  onChange,
  onRemove,
  onMove,
  onInsertAfter,
}: {
  block: BlogBlock;
  onChange: (next: BlogBlock) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
  onInsertAfter: (type: BlogBlock["type"]) => void;
}) {
  const [uploading, startUpload] = useTransition();
  const [collapsed, setCollapsed] = useState(false);

  function getBlockSummary(currentBlock: BlogBlock) {
    if (currentBlock.type === "paragraph") {
      return currentBlock.text.trim() || "Empty paragraph";
    }

    if (currentBlock.type === "heading") {
      return currentBlock.text.trim() || "Empty heading";
    }

    if (currentBlock.type === "quote") {
      return currentBlock.text.trim() || "Empty quote";
    }

    if (currentBlock.type === "list") {
      return currentBlock.items.filter(Boolean).join(" / ") || "Empty list";
    }

    return currentBlock.caption?.trim() || currentBlock.alt.trim() || currentBlock.src || "Image block";
  }

  return (
    <div className="rounded-[24px] border border-[rgba(47,129,133,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(241,247,245,0.92))] p-5 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.18)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--brand)]">
            {block.type}
          </p>
          {collapsed ? (
            <p className="mt-2 line-clamp-2 max-w-3xl text-sm text-slate-600">
              {getBlockSummary(block)}
            </p>
          ) : null}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => onMove(-1)} className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
            Up
          </button>
          <button type="button" onClick={() => onMove(1)} className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
            Down
          </button>
          <button type="button" onClick={onRemove} className="rounded-full bg-red-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-red-700 ring-1 ring-red-200">
            Remove
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((current) => !current)}
            aria-label={collapsed ? "Expand block" : "Collapse block"}
            title={collapsed ? "Expand block" : "Collapse block"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700 ring-1 ring-amber-200 transition hover:bg-amber-200"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className={`h-4 w-4 transition-transform duration-200 ${collapsed ? "rotate-180" : "rotate-0"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      {collapsed ? (
        <div className="mt-5 border-t border-[rgba(47,129,133,0.12)] pt-4">
          <div className="flex flex-wrap gap-2">
            {(["paragraph", "heading", "quote", "list", "image"] as BlogBlock["type"][]).map(
              (type) => (
                <button
                  key={`${block.id}-${type}`}
                  type="button"
                  onClick={() => onInsertAfter(type)}
                  className="rounded-full bg-[rgba(47,129,133,0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand)] transition hover:bg-[rgba(47,129,133,0.14)]"
                >
                  Add {type}
                </button>
              )
            )}
          </div>
        </div>
      ) : null}

      {!collapsed && block.type === "paragraph" ? (
        <textarea
          value={block.text}
          onChange={(event) => onChange({ ...block, text: event.target.value })}
          className="input min-h-32"
          placeholder="Paragraph text. Supports **bold**, *italic*, and [links](https://example.com)."
        />
      ) : null}

      {!collapsed && block.type === "heading" ? (
        <div className="space-y-3">
          <select
            value={block.level}
            onChange={(event) =>
              onChange({ ...block, level: Number(event.target.value) as 2 | 3 })
            }
            className="input h-12"
          >
            <option value={2}>Heading 2</option>
            <option value={3}>Heading 3</option>
          </select>
          <input
            value={block.text}
            onChange={(event) => onChange({ ...block, text: event.target.value })}
            className="input h-12"
            placeholder="Section heading"
          />
        </div>
      ) : null}

      {!collapsed && block.type === "quote" ? (
        <div className="space-y-3">
          <textarea
            value={block.text}
            onChange={(event) => onChange({ ...block, text: event.target.value })}
            className="input min-h-28"
            placeholder="Quote text"
          />
          <input
            value={block.citation || ""}
            onChange={(event) => onChange({ ...block, citation: event.target.value })}
            className="input h-12"
            placeholder="Citation or source"
          />
        </div>
      ) : null}

      {!collapsed && block.type === "list" ? (
        <div className="space-y-3">
          {block.items.map((item, index) => (
            <div key={`${block.id}-${index}`} className="flex gap-2">
              <input
                value={item}
                onChange={(event) =>
                  onChange({
                    ...block,
                    items: block.items.map((currentItem, currentIndex) =>
                      currentIndex === index ? event.target.value : currentItem
                    ),
                  })
                }
                className="input h-12"
                placeholder={`List item ${index + 1}`}
              />
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...block,
                    items: block.items.filter((_, currentIndex) => currentIndex !== index),
                  })
                }
                className="rounded-full bg-slate-100 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...block, items: [...block.items, ""] })}
            className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white"
          >
            Add item
          </button>
        </div>
      ) : null}

      {!collapsed && block.type === "image" ? (
        <div className="space-y-3">
          <div className="rounded-2xl border border-dashed border-[rgba(47,129,133,0.2)] bg-[rgba(47,129,133,0.04)] p-4">
            <label className="inline-flex cursor-pointer rounded-full bg-[var(--brand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
              {uploading ? "Uploading..." : "Upload image"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;

                  startUpload(async () => {
                    const uploaded = await uploadImage(file, block.alt);
                    onChange({ ...block, src: uploaded.url });
                  });
                }}
              />
            </label>
            {block.src ? (
              <div className="mt-4 space-y-3">
                <div className="relative h-40 w-28 overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
                  <Image
                    src={block.src}
                    alt={block.alt || "Uploaded content image preview"}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-slate-600">{block.src}</p>
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Image size</label>
            <select
              value={block.size ?? "small"}
              onChange={(event) =>
                onChange({
                  ...block,
                  size: event.target.value as "small" | "medium" | "large" | "xlarge",
                })
              }
              className="input h-12"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="xlarge">Extra large</option>
            </select>
          </div>
          <input
            value={block.alt}
            onChange={(event) => onChange({ ...block, alt: event.target.value })}
            className="input h-12"
            placeholder="Alt text"
          />
          <input
            value={block.caption || ""}
            onChange={(event) => onChange({ ...block, caption: event.target.value })}
            className="input h-12"
            placeholder="Caption"
          />
        </div>
      ) : null}

      {!collapsed ? (
        <div className="mt-5 border-t border-[rgba(47,129,133,0.12)] pt-4">
          <div className="flex flex-wrap gap-2">
            {(["paragraph", "heading", "quote", "list", "image"] as BlogBlock["type"][]).map(
              (type) => (
                <button
                  key={`${block.id}-${type}`}
                  type="button"
                  onClick={() => onInsertAfter(type)}
                  className="rounded-full bg-[rgba(47,129,133,0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand)] transition hover:bg-[rgba(47,129,133,0.14)]"
                >
                  Add {type}
                </button>
              )
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function PostEditor({
  post,
  action,
}: {
  post: EditorPost;
  action: (formData: FormData) => void;
}) {
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [featuredImage, setFeaturedImage] = useState(post.featuredImage);
  const [featuredImageAlt, setFeaturedImageAlt] = useState(post.featuredImageAlt);
  const [featuredImageSize, setFeaturedImageSize] = useState(post.featuredImageSize);
  const [content, setContent] = useState<BlogContent>(post.content);
  const [isUploadingFeatured, startFeaturedUpload] = useTransition();
  const previewTitle = title || "Untitled post";
  const previewExcerpt = excerpt || "Your excerpt will appear here once you fill it in.";
  const previewDate = formatDate(
    post.publishedAt ? new Date(post.publishedAt) : new Date()
  );
  const relatedBook = getBookById(content.relatedBookId);
  const previewFeaturedImageWidthClass =
    featuredImageSize === "small"
      ? "max-w-[26rem]"
      : featuredImageSize === "medium"
        ? "max-w-[32rem]"
      : featuredImageSize === "xlarge"
        ? "max-w-7xl"
      : featuredImageSize === "large"
        ? "max-w-6xl"
        : "max-w-5xl";

  function insertBlockAfter(targetId: string, type: BlogBlock["type"]) {
    setContent((current) => {
      const nextBlocks = [...current.blocks];
      const targetIndex = nextBlocks.findIndex((block) => block.id === targetId);
      if (targetIndex === -1) {
        return {
          ...current,
          blocks: [...current.blocks, createBlock(type)],
        };
      }

      nextBlocks.splice(targetIndex + 1, 0, createBlock(type));
      return { ...current, blocks: nextBlocks };
    });
  }

  function appendBlock(type: BlogBlock["type"]) {
    setContent((current) => ({
      ...current,
      blocks: [...current.blocks, createBlock(type)],
    }));
  }

  return (
    <form action={action} className="space-y-8">
      <button
        type="submit"
        className="fixed bottom-6 right-6 z-40 inline-flex h-14 items-center justify-center rounded-full bg-[var(--brand)] px-6 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_20px_50px_-20px_rgba(47,129,133,0.9)] transition hover:bg-[#276d71]"
      >
        Save post
      </button>

      <input type="hidden" name="postId" value={post.id || ""} />
      <input type="hidden" name="content" value={JSON.stringify(content)} />
      <input type="hidden" name="featuredImage" value={featuredImage} />
      <input type="hidden" name="featuredImageAlt" value={featuredImageAlt} />
      <input type="hidden" name="featuredImageSize" value={featuredImageSize} />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.3fr)_380px]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-[rgba(47,129,133,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(241,247,245,0.94))] p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)]">
            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-slate-700">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  value={title}
                  onChange={(event) => {
                    const nextTitle = event.target.value;
                    setTitle(nextTitle);
                    setSlug((currentSlug) =>
                      currentSlug === "" || currentSlug === makeSlug(title)
                        ? makeSlug(nextTitle)
                        : currentSlug
                    );
                  }}
                  className="input h-14 text-lg text-slate-900"
                  placeholder="A refined editorial title"
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-[1fr_220px]">
                <div className="space-y-2">
                  <label htmlFor="slug" className="text-sm font-medium text-slate-700">
                    Slug
                  </label>
                  <input
                    id="slug"
                    name="slug"
                    value={slug}
                    onChange={(event) => setSlug(makeSlug(event.target.value))}
                    className="input h-12 text-slate-900"
                    placeholder="editorial-slug"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium text-slate-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={post.status}
                    className="input h-12 text-slate-900"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="relatedBookId" className="text-sm font-medium text-slate-700">
                  Related book
                </label>
                <select
                  id="relatedBookId"
                  value={content.relatedBookId || ""}
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      relatedBookId: event.target.value,
                    }))
                  }
                  className="input h-12 text-slate-900"
                >
                  <option value="">No related book</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="excerpt" className="text-sm font-medium text-slate-700">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={excerpt}
                  onChange={(event) => setExcerpt(event.target.value)}
                  className="input min-h-28 text-slate-900"
                  placeholder="Short editorial summary for listing cards and metadata."
                />
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[rgba(47,129,133,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(241,247,245,0.94))] p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--brand)]">
                  Content builder
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                  Article blocks
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["paragraph", "heading", "quote", "list", "image"] as BlogBlock["type"][]).map(
                  (type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => appendBlock(type)}
                      className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white"
                    >
                      Add {type}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="mt-6 space-y-4">
            {content.blocks.map((block, index) => (
              <BlockEditor
                key={block.id}
                  block={block}
                  onChange={(nextBlock) =>
                    setContent((current) => ({
                      ...current,
                      blocks: current.blocks.map((currentBlock) =>
                        currentBlock.id === nextBlock.id ? nextBlock : currentBlock
                      ),
                    }))
                  }
                  onRemove={() =>
                    setContent((current) => ({
                      ...current,
                      blocks:
                        current.blocks.length === 1
                          ? [createBlock("paragraph")]
                          : current.blocks.filter((currentBlock) => currentBlock.id !== block.id),
                    }))
                  }
                  onMove={(direction) =>
                    setContent((current) => {
                      const nextBlocks = [...current.blocks];
                      const nextIndex = index + direction;
                      if (nextIndex < 0 || nextIndex >= nextBlocks.length) return current;
                      [nextBlocks[index], nextBlocks[nextIndex]] = [
                        nextBlocks[nextIndex],
                        nextBlocks[index],
                      ];
                      return { ...current, blocks: nextBlocks };
                    })
                  }
                  onInsertAfter={(type) => insertBlockAfter(block.id, type)}
                />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[28px] border border-[rgba(47,129,133,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(241,247,245,0.94))] p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)]">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--brand)]">Featured image</p>
            <div className="mt-4 rounded-[24px] border border-dashed border-[rgba(47,129,133,0.2)] bg-[rgba(47,129,133,0.04)] p-5">
            <label className="inline-flex cursor-pointer rounded-full bg-[var(--brand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
              {isUploadingFeatured ? "Uploading..." : "Upload cover"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;

                    startFeaturedUpload(async () => {
                      const uploaded = await uploadImage(file, featuredImageAlt);
                      setFeaturedImage(uploaded.url);
                    });
                }}
              />
            </label>
            {featuredImage ? (
              <div className="mt-4 space-y-3">
                <div className="relative h-48 w-32 overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
                  <Image
                    src={featuredImage}
                    alt={featuredImageAlt || "Uploaded featured image preview"}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="break-all text-sm text-slate-600">{featuredImage}</p>
              </div>
            ) : null}
          </div>
            <div className="mt-4 space-y-2">
              <label htmlFor="featuredImageAlt" className="text-sm font-medium text-slate-700">
                Featured image alt text
              </label>
              <input
                id="featuredImageAlt"
                value={featuredImageAlt}
                onChange={(event) => setFeaturedImageAlt(event.target.value)}
                className="input h-12 text-slate-900"
                placeholder="Describe the cover image"
              />
            </div>
            <div className="mt-4 space-y-2">
              <label htmlFor="featuredImageSize" className="text-sm font-medium text-slate-700">
                Featured image size
              </label>
              <select
                id="featuredImageSize"
                value={featuredImageSize}
                onChange={(event) =>
                  setFeaturedImageSize(
                    event.target.value as "small" | "medium" | "large" | "xlarge"
                  )
                }
                className="input h-12 text-slate-900"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xlarge">Extra large</option>
              </select>
            </div>
          </section>

          <section className="rounded-[28px] border border-[rgba(47,129,133,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(241,247,245,0.94))] p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)]">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--brand)]">SEO</p>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="seoTitle" className="text-sm font-medium text-slate-700">
                  SEO title
                </label>
                <input
                  id="seoTitle"
                  name="seoTitle"
                  defaultValue={post.seoTitle}
                  className="input h-12 text-slate-900"
                  placeholder="Custom search title"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="seoDescription" className="text-sm font-medium text-slate-700">
                  SEO description
                </label>
                <textarea
                  id="seoDescription"
                  name="seoDescription"
                  defaultValue={post.seoDescription}
                  className="input min-h-24 text-slate-900"
                  placeholder="Search and social description"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="publishedAt" className="text-sm font-medium text-slate-700">
                  Publish date
                </label>
                <input
                  id="publishedAt"
                  name="publishedAt"
                  type="datetime-local"
                  defaultValue={post.publishedAt}
                  className="input h-12 text-slate-900"
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[var(--brand)] px-5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#276d71]"
          >
            Save post
          </button>
        </aside>
      </div>

      <section className="rounded-[28px] border border-[rgba(47,129,133,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(241,247,245,0.94))] p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--brand)]">Live preview</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Full-width article preview
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            This preview updates as you edit the title, excerpt, and content blocks so you can
            review the reading flow before publishing.
          </p>
        </div>

        <div className="mt-6 rounded-[28px] border border-[rgba(47,129,133,0.1)] bg-[#e9e3d8] px-6 py-8 text-slate-900 sm:px-10 sm:py-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <header className="mx-auto max-w-4xl space-y-6">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                {previewDate}
              </p>
              {relatedBook ? (
                <div className="flex items-center gap-4 rounded-[24px] border border-[rgba(47,129,133,0.12)] bg-white/75 px-4 py-4">
                  <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg border border-black/5 bg-white">
                    <Image
                      src={withBasePath(relatedBook.coverSrc)}
                      alt={`${relatedBook.title} cover`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--brand)]">
                      Related book
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-950">
                      {relatedBook.title}
                    </p>
                    {relatedBook.subtitle ? (
                      <p className="text-sm text-slate-600">{relatedBook.subtitle}</p>
                    ) : null}
                  </div>
                </div>
              ) : null}
              <h3 className="text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                {previewTitle}
              </h3>
              <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-xl sm:leading-9">
                {previewExcerpt}
              </p>
            </header>

            {featuredImage ? (
              <div
                className={`mx-auto mt-10 overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-[0_25px_90px_-60px_rgba(15,23,42,0.4)] ${previewFeaturedImageWidthClass}`}
              >
                <Image
                  src={featuredImage}
                  alt={featuredImageAlt || previewTitle}
                  width={1600}
                  height={900}
                  className="h-auto w-full object-cover"
                />
              </div>
            ) : null}

            <div className="mx-auto mt-12 max-w-3xl border-t border-slate-200 pt-8">
              <BlogContentRenderer content={content} className="space-y-6" />
            </div>
          </div>
        </div>
      </section>
    </form>
  );
}
