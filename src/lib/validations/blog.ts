import { z } from "zod";

export const postStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

export const blogBlockSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string().min(1),
    type: z.literal("paragraph"),
    text: z.string().max(5000),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("heading"),
    level: z.union([z.literal(2), z.literal(3)]),
    text: z.string().max(300),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("quote"),
    text: z.string().max(2000),
    citation: z.string().max(160).optional().default(""),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("list"),
    style: z.literal("unordered"),
    items: z.array(z.string().max(300)).max(20),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("image"),
    src: z.string().min(1).max(500),
    alt: z.string().max(300),
    caption: z.string().max(300).optional().default(""),
    size: z.enum(["small", "medium", "large", "xlarge"]).optional().default("small"),
  }),
]);

export const blogContentSchema = z.object({
  version: z.literal(1),
  featuredImageSize: z.enum(["small", "medium", "large", "xlarge"]).optional().default("small"),
  relatedBookId: z.string().max(80).optional().default(""),
  blocks: z.array(blogBlockSchema).max(100),
});

export const postInputSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(90)
    .regex(/^[a-z0-9-]+$/),
  excerpt: z.string().trim().max(320).optional().default(""),
  featuredImage: z.string().trim().max(500).optional().default(""),
  featuredImageAlt: z.string().trim().max(300).optional().default(""),
  featuredImageSize: z
    .union([z.enum(["small", "medium", "large", "xlarge"]), z.literal(""), z.null(), z.undefined()])
    .transform((value) =>
      value === "small" || value === "large" || value === "medium" || value === "xlarge"
        ? value
        : "small"
    ),
  seoTitle: z.string().trim().max(160).optional().default(""),
  seoDescription: z.string().trim().max(180).optional().default(""),
  status: postStatusSchema,
  publishedAt: z.string().trim().optional().default(""),
  content: z.string().min(2),
});
