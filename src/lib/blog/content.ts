import type { BlogContent } from "@/lib/blog/types";

export function createEmptyContent(): BlogContent {
  return {
    version: 1,
    featuredImageSize: "small",
    relatedBookId: "",
    blocks: [
      {
        id: crypto.randomUUID(),
        type: "paragraph",
        text: "",
      },
    ],
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function sanitizeHref(value: string) {
  if (/^https?:\/\//i.test(value) || value.startsWith("/")) {
    return value;
  }

  return "#";
}

export function renderInlineMarkup(value: string) {
  const escaped = escapeHtml(value);

  return escaped
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_, label: string, href: string) =>
        `<a href="${sanitizeHref(href)}" rel="noreferrer noopener">${escapeHtml(label)}</a>`
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}
