import type { z } from "zod";
import { blogBlockSchema, blogContentSchema } from "@/lib/validations/blog";

export type BlogBlock = z.infer<typeof blogBlockSchema>;
export type BlogContent = z.infer<typeof blogContentSchema>;
