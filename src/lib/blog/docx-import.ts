import mammoth from "mammoth";
import { parse } from "node-html-parser";
import type { BlogBlock, BlogContent } from "@/lib/blog/types";
import { makeSlug } from "@/lib/utils";

type ImportedImage = {
  url: string;
  alt: string;
};

type ImportImageFn = (buffer: Buffer, alt: string) => Promise<ImportedImage>;

export type ImportedDocxDraft = {
  title: string;
  slug: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  featuredImage: string;
  featuredImageAlt: string;
  content: BlogContent;
  warnings: string[];
};

function cleanText(value: string) {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function truncateText(value: string, maxLength: number) {
  const normalized = cleanText(value);

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const truncated = normalized.slice(0, maxLength - 1);
  const lastSpace = truncated.lastIndexOf(" ");
  const safeTruncate = lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated;

  return `${safeTruncate.trimEnd()}…`;
}

function createId() {
  return crypto.randomUUID();
}

function getMammothImageAltText(image: unknown) {
  if (!image || typeof image !== "object") {
    return "";
  }

  if ("altText" in image && typeof image.altText === "string") {
    return image.altText;
  }

  return "";
}

function asElement(node: unknown) {
  if (!node || typeof node !== "object") return null;
  if (!("tagName" in node)) return null;
  return node as {
    tagName?: string;
    childNodes?: unknown[];
    getAttribute?: (name: string) => string | undefined;
    querySelectorAll?: (selector: string) => Array<{
      getAttribute?: (name: string) => string | undefined;
      tagName?: string;
    }>;
    text?: string;
  };
}

function serializeInline(node: unknown): string {
  if (!node || typeof node !== "object") {
    return "";
  }

  if ("rawText" in node && typeof node.rawText === "string") {
    return node.rawText;
  }

  const element = asElement(node);

  if (!element) {
    return "";
  }

  const tagName = (element.tagName || "").toLowerCase();
  const children = (element.childNodes || []).map((child) => serializeInline(child)).join("");
  const content = cleanText(children);

  if (!content && tagName !== "br") {
    return "";
  }

  switch (tagName) {
    case "strong":
    case "b":
      return `**${content}**`;
    case "em":
    case "i":
      return `*${content}*`;
    case "mark":
      return `==${content}==`;
    case "u":
      return `++${content}++`;
    case "a": {
      const href = element.getAttribute?.("href") || "";
      return href ? `[${content}](${href})` : content;
    }
    case "br":
      return "\n";
    case "img":
      return "";
    default:
      if (element.getAttribute?.("style")?.toLowerCase().includes("background")) {
        return `==${content}==`;
      }

      if (element.getAttribute?.("style")?.toLowerCase().includes("underline")) {
        return `++${content}++`;
      }

      return children;
  }
}

function createImageBlock(src: string, alt: string): BlogBlock {
  return {
    id: createId(),
    type: "image",
    src,
    alt,
    caption: "",
    size: "medium",
  };
}

function getImageElements(element: ReturnType<typeof asElement>) {
  if (!element) return [];

  const directChildren = (element.childNodes || [])
    .map((child) => asElement(child))
    .filter((child) => child && (child.tagName || "").toLowerCase() === "img");

  if (directChildren.length) {
    return directChildren;
  }

  return element.querySelectorAll?.("img") || [];
}

function looksLikeImageReferenceAlt(value: string) {
  return /^(https?:\/\/|inline:)/i.test(value) || /\.(jpg|jpeg|png|gif|webp)$/i.test(value);
}

function looksLikeCaption(value: string) {
  const normalized = cleanText(value);

  if (!normalized) return false;
  if (normalized.length > 160) return false;

  const sentenceMatches = normalized.match(/[.!?]/g);
  if (sentenceMatches && sentenceMatches.length > 1) {
    return false;
  }

  return true;
}

function attachImageCaptions(blocks: BlogBlock[]) {
  const nextBlocks: BlogBlock[] = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const current = blocks[index];
    const following = blocks[index + 1];

    if (
      current.type === "image" &&
      following?.type === "paragraph" &&
      looksLikeCaption(following.text)
    ) {
      const caption = cleanText(following.text);

      nextBlocks.push({
        ...current,
        alt:
          current.alt && !looksLikeImageReferenceAlt(current.alt)
            ? current.alt
            : caption,
        caption,
      });
      index += 1;
      continue;
    }

    nextBlocks.push(current);
  }

  return nextBlocks;
}

function collectBlocks(nodes: unknown[], blocks: BlogBlock[]) {
  for (const node of nodes) {
    const element = asElement(node);

    if (!element) {
      const text = serializeInline(node);
      const normalized = cleanText(text);

      if (normalized) {
        blocks.push({
          id: createId(),
          type: "paragraph",
          text: normalized,
        });
      }

      continue;
    }

    const tagName = (element.tagName || "").toLowerCase();

    if (!tagName) {
      collectBlocks(element.childNodes || [], blocks);
      continue;
    }

    if (tagName === "h1" || tagName === "h2" || tagName === "h3" || tagName === "h4") {
      const text = cleanText(serializeInline(element));

      if (text) {
        blocks.push({
          id: createId(),
          type: "heading",
          level: tagName === "h3" || tagName === "h4" ? 3 : 2,
          text,
        });
      }

      continue;
    }

    if (tagName === "p") {
      const imageChildren = getImageElements(element);
      const paragraphText = cleanText(serializeInline(element));

      for (const imageChild of imageChildren) {
        const src = imageChild?.getAttribute?.("src") || "";
        const alt = cleanText(imageChild?.getAttribute?.("alt") || "");

        if (src) {
          blocks.push(createImageBlock(src, alt));
        }
      }

      if (paragraphText) {
        blocks.push({
          id: createId(),
          type: "paragraph",
          text: paragraphText,
        });
      }

      continue;
    }

    if (tagName === "blockquote") {
      const text = cleanText(serializeInline(element));

      if (text) {
        blocks.push({
          id: createId(),
          type: "quote",
          text,
          citation: "",
        });
      }

      continue;
    }

    if (tagName === "ul" || tagName === "ol") {
      const items = (element.childNodes || [])
        .map((child) => asElement(child))
        .filter((child) => child && (child.tagName || "").toLowerCase() === "li")
        .map((item) => cleanText(serializeInline(item)))
        .filter(Boolean)
        .slice(0, 20);

      if (items.length) {
        blocks.push({
          id: createId(),
          type: "list",
          style: "unordered",
          items,
        });
      }

      continue;
    }

    if (tagName === "img") {
      const src = element.getAttribute?.("src") || "";
      const alt = cleanText(element.getAttribute?.("alt") || "");

      if (src) {
        blocks.push(createImageBlock(src, alt));
      }

      continue;
    }

    collectBlocks(element.childNodes || [], blocks);
  }
}

function createEmptyParagraph(): BlogBlock {
  return {
    id: createId(),
    type: "paragraph",
    text: "",
  };
}

export async function importDocxToDraft(
  buffer: Buffer,
  filename: string,
  importImage: ImportImageFn
): Promise<ImportedDocxDraft> {
  const warnings: string[] = [];

  const result = await mammoth.convertToHtml(
    { buffer },
    {
      convertImage: mammoth.images.imgElement(async (image) => {
        const altText = getMammothImageAltText(image);

        try {
          const base64 = await image.read("base64");
          const uploaded = await importImage(Buffer.from(base64, "base64"), altText);

          return {
            src: uploaded.url,
            alt: uploaded.alt,
          };
        } catch (error) {
          const imageLabel = altText || image.contentType || "embedded image";
          const reason =
            error instanceof Error && error.message ? error.message : "conversion failed";

          warnings.push(`Skipped ${imageLabel}: ${reason}`);

          return {
            src: "",
            alt: altText,
          };
        }
      }),
    }
  );

  for (const message of result.messages) {
    warnings.push(cleanText(message.message));
  }

  const root = parse(`<article>${result.value}</article>`);
  const article = root.querySelector("article");
  const blocks: BlogBlock[] = [];
  collectBlocks(article?.childNodes || [], blocks);
  const blocksWithCaptions = attachImageCaptions(blocks);

  let title = "";
  let featuredImage = "";
  let featuredImageAlt = "";
  const contentBlocks = [...blocksWithCaptions];

  if (contentBlocks[0]?.type === "heading") {
    title = cleanText(contentBlocks[0].text);
    contentBlocks.shift();
  }

  if (contentBlocks[0]?.type === "image") {
    featuredImage = contentBlocks[0].src;
    featuredImageAlt = contentBlocks[0].alt || contentBlocks[0].caption || "";
    contentBlocks.shift();
  }

  if (!title) {
    const fallbackName = filename.replace(/\.docx$/i, "").replace(/[-_]+/g, " ");
    title = truncateText(fallbackName, 160) || "Imported draft";
  }

  const firstParagraph = contentBlocks.find(
    (block): block is Extract<BlogBlock, { type: "paragraph" }> => block.type === "paragraph"
  );
  const excerptSource =
    firstParagraph?.text ||
    contentBlocks.find(
      (block): block is Extract<BlogBlock, { type: "quote" | "heading" }> =>
        block.type === "quote" || block.type === "heading"
    )?.text ||
    title;

  const excerpt = truncateText(excerptSource, 220);
  const seoTitle = truncateText(`${title} | Chimeral Insight`, 160);
  const seoDescription = truncateText(excerpt, 180);

  return {
    title,
    slug: makeSlug(title) || `imported-${Date.now()}`,
    excerpt,
    seoTitle,
    seoDescription,
    featuredImage,
    featuredImageAlt,
    content: {
      version: 1,
      featuredImageSize: "large",
      relatedBookId: "",
      blocks: contentBlocks.length ? contentBlocks : [createEmptyParagraph()],
    },
    warnings,
  };
}
