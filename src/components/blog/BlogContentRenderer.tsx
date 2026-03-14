import Image from "next/image";
import type { BlogContent } from "@/lib/blog/types";
import { cn } from "@/lib/utils";
import { renderInlineMarkup } from "@/lib/blog/content";

export default function BlogContentRenderer({
  content,
  className,
}: {
  content: BlogContent;
  className?: string;
}) {
  const imageSizeClasses = {
    small: "w-[min(calc(100vw-8rem),20rem)]",
    medium: "w-[min(calc(100vw-8rem),25rem)]",
    large: "w-[min(calc(100vw-8rem),56rem)]",
    xlarge: "w-[min(calc(100vw-8rem),64rem)]",
  } as const;

  return (
    <div className={cn("space-y-7", className)}>
      {content.blocks.map((block) => {
        if (block.type === "paragraph") {
          return (
            <p
              key={block.id}
              className="text-lg leading-8 text-slate-700"
              dangerouslySetInnerHTML={{
                __html: renderInlineMarkup(block.text),
              }}
            />
          );
        }

        if (block.type === "heading") {
          const Tag = block.level === 2 ? "h2" : "h3";

          return (
            <Tag
              key={block.id}
              className={cn(
                "font-semibold tracking-tight text-slate-950",
                block.level === 2 ? "text-3xl mt-12" : "text-2xl mt-10",
              )}
              dangerouslySetInnerHTML={{
                __html: renderInlineMarkup(block.text),
              }}
            />
          );
        }

        if (block.type === "quote") {
          return (
            <figure
              key={block.id}
              className="border-l-4 border-[var(--brand)] bg-slate-50 px-6 py-5"
            >
              <blockquote
                className="text-xl italic leading-8 text-slate-800"
                dangerouslySetInnerHTML={{
                  __html: renderInlineMarkup(block.text),
                }}
              />
              {block.citation ? (
                <figcaption className="mt-3 text-sm uppercase tracking-[0.16em] text-slate-500">
                  {block.citation}
                </figcaption>
              ) : null}
            </figure>
          );
        }

        if (block.type === "list") {
          return (
            <ul
              key={block.id}
              className="space-y-3 pl-6 text-lg leading-8 text-slate-700 list-disc"
            >
              {block.items.map((item, index) => (
                <li
                  key={`${block.id}-${index}`}
                  dangerouslySetInnerHTML={{ __html: renderInlineMarkup(item) }}
                />
              ))}
            </ul>
          );
        }

        const imageSize = block.size ?? "medium";

        return (
          <figure
            key={block.id}
            className={cn(
              "flex flex-col items-center space-y-4",
              imageSize === "large" || imageSize === "xlarge"
                ? "relative left-1/2 -translate-x-1/2"
                : "mx-auto",
            )}
          >
            {block.src ? (
              <div
                className={cn(
                  "overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100",
                  imageSizeClasses[imageSize],
                )}
              >
                <Image
                  src={block.src}
                  alt={block.alt}
                  width={1600}
                  height={900}
                  className="h-auto w-full object-cover"
                />
              </div>
            ) : (
              <div
                className={cn(
                  "flex min-h-48 items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 text-center text-sm uppercase tracking-[0.14em] text-slate-400",
                  imageSizeClasses[imageSize],
                )}
              >
                Image placeholder
              </div>
            )}
            {block.caption ? (
              <figcaption
                className={cn(
                  "w-full text-center text-sm text-slate-500",
                  imageSizeClasses[imageSize],
                )}
              >
                {block.caption}
              </figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
