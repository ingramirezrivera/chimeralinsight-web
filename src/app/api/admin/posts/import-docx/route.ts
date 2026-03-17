import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { importDocxToDraft } from "@/lib/blog/docx-import";
import { assertUploadRateLimit } from "@/lib/security/upload-rate-limit";
import { saveUploadBuffer } from "@/lib/storage";

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const forwardedFor = request.headers.get("x-forwarded-for") || "";
    const clientIp = forwardedFor.split(",")[0]?.trim() || "unknown";
    const rateLimitKey = `docx-import:${session.userId}:${clientIp}`;

    if (!assertUploadRateLimit(rateLimitKey)) {
      return NextResponse.json({ error: "Too many import attempts" }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Word file is required" }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith(".docx")) {
      return NextResponse.json({ error: "Only .docx files are supported right now." }, { status: 400 });
    }

    const imported = await importDocxToDraft(
      Buffer.from(await file.arrayBuffer()),
      file.name,
      async (buffer, alt) => {
        const uploaded = await saveUploadBuffer(buffer);

        await prisma.media.create({
          data: {
            filename: uploaded.filename,
            path: uploaded.path,
            mimeType: uploaded.mimeType,
            size: uploaded.size,
            alt: alt || null,
            uploadedById: session.userId,
          },
        });

        return {
          url: uploaded.path,
          alt,
        };
      }
    );

    return NextResponse.json(imported);
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Unable to import the Word document.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
